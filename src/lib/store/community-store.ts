import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Types
export interface CommunityMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  replyTo?: string;
  edited?: boolean;
  editedAt?: string;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member';
  joinedAt: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
  messages: CommunityMessage[];
  lastMessage?: CommunityMessage;
  unreadCount: number;
  isActive: boolean;
}

export interface DirectMessage {
  id: string;
  participants: [string, string]; // Always exactly 2 participants
  participantNames: [string, string];
  participantAvatars?: [string?, string?];
  messages: CommunityMessage[];
  lastMessage?: CommunityMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface CommunityState {
  // Current user
  currentUser: User | null;
  
  // Groups
  groups: Group[];
  currentGroupId: string | null;
  
  // Direct messages
  directMessages: DirectMessage[];
  currentDirectMessageId: string | null;
  
  // Available users for inviting
  availableUsers: User[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentUser: (user: User) => void;
  
  // Group actions
  createGroup: (name: string, description?: string, memberIds?: string[]) => string;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  deleteGroup: (groupId: string) => void;
  addGroupMember: (groupId: string, userId: string) => void;
  removeGroupMember: (groupId: string, userId: string) => void;
  updateGroupInfo: (groupId: string, updates: Partial<Pick<Group, 'name' | 'description' | 'avatar'>>) => void;
  setCurrentGroupId: (groupId: string | null) => void;
  
  // Direct message actions
  createDirectMessage: (participantId: string) => string;
  setCurrentDirectMessageId: (dmId: string | null) => void;
  
  // Message actions
  sendGroupMessage: (groupId: string, message: Omit<CommunityMessage, 'id' | 'timestamp'>) => void;
  sendDirectMessage: (dmId: string, message: Omit<CommunityMessage, 'id' | 'timestamp'>) => void;
  editMessage: (messageId: string, newContent: string, isGroup: boolean, chatId: string) => void;
  deleteMessage: (messageId: string, isGroup: boolean, chatId: string) => void;
  
  // Utility actions
  getGroupById: (groupId: string) => Group | undefined;
  getDirectMessageById: (dmId: string) => DirectMessage | undefined;
  getCurrentGroup: () => Group | undefined;
  getCurrentDirectMessage: () => DirectMessage | undefined;
  markAsRead: (chatId: string, isGroup: boolean) => void;
  
  // Error handling
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Initialize mock data
  initializeMockData: () => void;
}

// Helper functions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const generateMessageId = (): string => {
  return `msg_${generateId()}`;
};

const generateGroupId = (): string => {
  return `group_${generateId()}`;
};

const generateDirectMessageId = (): string => {
  return `dm_${generateId()}`;
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'John Doe',
    email: 'john@example.com',
    isOnline: true,
  },
  {
    id: 'user_2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: 'user_3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    isOnline: true,
  },
  {
    id: 'user_4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'user_5',
    name: 'Alex Brown',
    email: 'alex@example.com',
    isOnline: true,
  },
];

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      groups: [],
      currentGroupId: null,
      directMessages: [],
      currentDirectMessageId: null,
      availableUsers: mockUsers,
      isLoading: false,
      error: null,

      // Current user actions
      setCurrentUser: (user: User) => {
        set({ currentUser: user });
      },

      // Group actions
      createGroup: (name: string, description?: string, memberIds: string[] = []): string => {
        try {
          const state = get();
          const newGroupId = generateGroupId();
          const now = new Date().toISOString();
          
          if (!state.currentUser) {
            set({ error: 'No current user set' });
            return '';
          }

          // Create group members array
          const members: GroupMember[] = [
            {
              id: state.currentUser.id,
              name: state.currentUser.name,
              avatar: state.currentUser.avatar,
              role: 'admin',
              joinedAt: now,
              isOnline: state.currentUser.isOnline,
            },
          ];

          // Add invited members
          memberIds.forEach(userId => {
            const user = state.availableUsers.find(u => u.id === userId);
            if (user && !members.find(m => m.id === userId)) {
              members.push({
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                role: 'member',
                joinedAt: now,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen,
              });
            }
          });

          const newGroup: Group = {
            id: newGroupId,
            name,
            description,
            createdBy: state.currentUser.id,
            createdAt: now,
            updatedAt: now,
            members,
            messages: [],
            unreadCount: 0,
            isActive: true,
          };

          set((state) => ({
            groups: [newGroup, ...state.groups],
            currentGroupId: newGroupId,
            error: null,
          }));

          return newGroupId;
        } catch (error) {
          console.error('Error creating group:', error);
          set({ error: 'Failed to create group' });
          return '';
        }
      },

      joinGroup: (groupId: string) => {
        try {
          const state = get();
          if (!state.currentUser) {
            set({ error: 'No current user set' });
            return;
          }

          set((state) => ({
            groups: state.groups.map(group => {
              if (group.id === groupId) {
                const isAlreadyMember = group.members.find(m => m.id === state.currentUser!.id);
                if (!isAlreadyMember) {
                  return {
                    ...group,
                    members: [
                      ...group.members,
                      {
                        id: state.currentUser!.id,
                        name: state.currentUser!.name,
                        avatar: state.currentUser!.avatar,
                        role: 'member' as const,
                        joinedAt: new Date().toISOString(),
                        isOnline: state.currentUser!.isOnline,
                      },
                    ],
                    updatedAt: new Date().toISOString(),
                  };
                }
              }
              return group;
            }),
            error: null,
          }));
        } catch (error) {
          console.error('Error joining group:', error);
          set({ error: 'Failed to join group' });
        }
      },

      leaveGroup: (groupId: string) => {
        try {
          const state = get();
          if (!state.currentUser) {
            set({ error: 'No current user set' });
            return;
          }

          set((state) => ({
            groups: state.groups.map(group => {
              if (group.id === groupId) {
                return {
                  ...group,
                  members: group.members.filter(m => m.id !== state.currentUser!.id),
                  updatedAt: new Date().toISOString(),
                };
              }
              return group;
            }),
            currentGroupId: state.currentGroupId === groupId ? null : state.currentGroupId,
            error: null,
          }));
        } catch (error) {
          console.error('Error leaving group:', error);
          set({ error: 'Failed to leave group' });
        }
      },

      deleteGroup: (groupId: string) => {
        try {
          set((state) => ({
            groups: state.groups.filter(group => group.id !== groupId),
            currentGroupId: state.currentGroupId === groupId ? null : state.currentGroupId,
            error: null,
          }));
        } catch (error) {
          console.error('Error deleting group:', error);
          set({ error: 'Failed to delete group' });
        }
      },

      addGroupMember: (groupId: string, userId: string) => {
        try {
          const state = get();
          const user = state.availableUsers.find(u => u.id === userId);
          if (!user) {
            set({ error: 'User not found' });
            return;
          }

          set((state) => ({
            groups: state.groups.map(group => {
              if (group.id === groupId) {
                const isAlreadyMember = group.members.find(m => m.id === userId);
                if (!isAlreadyMember) {
                  return {
                    ...group,
                    members: [
                      ...group.members,
                      {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar,
                        role: 'member' as const,
                        joinedAt: new Date().toISOString(),
                        isOnline: user.isOnline,
                        lastSeen: user.lastSeen,
                      },
                    ],
                    updatedAt: new Date().toISOString(),
                  };
                }
              }
              return group;
            }),
            error: null,
          }));
        } catch (error) {
          console.error('Error adding group member:', error);
          set({ error: 'Failed to add member' });
        }
      },

      removeGroupMember: (groupId: string, userId: string) => {
        try {
          set((state) => ({
            groups: state.groups.map(group => {
              if (group.id === groupId) {
                return {
                  ...group,
                  members: group.members.filter(m => m.id !== userId),
                  updatedAt: new Date().toISOString(),
                };
              }
              return group;
            }),
            error: null,
          }));
        } catch (error) {
          console.error('Error removing group member:', error);
          set({ error: 'Failed to remove member' });
        }
      },

      updateGroupInfo: (groupId: string, updates: Partial<Pick<Group, 'name' | 'description' | 'avatar'>>) => {
        try {
          set((state) => ({
            groups: state.groups.map(group => {
              if (group.id === groupId) {
                return {
                  ...group,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                };
              }
              return group;
            }),
            error: null,
          }));
        } catch (error) {
          console.error('Error updating group info:', error);
          set({ error: 'Failed to update group' });
        }
      },

      setCurrentGroupId: (groupId: string | null) => {
        set({ currentGroupId: groupId });
      },

      // Direct message actions
      createDirectMessage: (participantId: string): string => {
        try {
          const state = get();
          if (!state.currentUser) {
            set({ error: 'No current user set' });
            return '';
          }

          const participant = state.availableUsers.find(u => u.id === participantId);
          if (!participant) {
            set({ error: 'Participant not found' });
            return '';
          }

          // Check if DM already exists
          const existingDM = state.directMessages.find(dm => 
            dm.participants.includes(state.currentUser!.id) && 
            dm.participants.includes(participantId)
          );

          if (existingDM) {
            set({ currentDirectMessageId: existingDM.id });
            return existingDM.id;
          }

          const newDMId = generateDirectMessageId();
          const now = new Date().toISOString();

          const newDM: DirectMessage = {
            id: newDMId,
            participants: [state.currentUser.id, participantId],
            participantNames: [state.currentUser.name, participant.name],
            participantAvatars: [state.currentUser.avatar, participant.avatar],
            messages: [],
            unreadCount: 0,
            createdAt: now,
            updatedAt: now,
            isActive: true,
          };

          set((state) => ({
            directMessages: [newDM, ...state.directMessages],
            currentDirectMessageId: newDMId,
            error: null,
          }));

          return newDMId;
        } catch (error) {
          console.error('Error creating direct message:', error);
          set({ error: 'Failed to create direct message' });
          return '';
        }
      },

      setCurrentDirectMessageId: (dmId: string | null) => {
        set({ currentDirectMessageId: dmId });
      },

      // Message actions
      sendGroupMessage: (groupId: string, message: Omit<CommunityMessage, 'id' | 'timestamp'>) => {
        try {
          const newMessage: CommunityMessage = {
            ...message,
            id: generateMessageId(),
            timestamp: new Date().toISOString(),
          };

          set((state) => ({
            groups: state.groups.map(group => {
              if (group.id === groupId) {
                return {
                  ...group,
                  messages: [...group.messages, newMessage],
                  lastMessage: newMessage,
                  updatedAt: new Date().toISOString(),
                };
              }
              return group;
            }),
            error: null,
          }));
        } catch (error) {
          console.error('Error sending group message:', error);
          set({ error: 'Failed to send message' });
        }
      },

      sendDirectMessage: (dmId: string, message: Omit<CommunityMessage, 'id' | 'timestamp'>) => {
        try {
          const newMessage: CommunityMessage = {
            ...message,
            id: generateMessageId(),
            timestamp: new Date().toISOString(),
          };

          set((state) => ({
            directMessages: state.directMessages.map(dm => {
              if (dm.id === dmId) {
                return {
                  ...dm,
                  messages: [...dm.messages, newMessage],
                  lastMessage: newMessage,
                  updatedAt: new Date().toISOString(),
                };
              }
              return dm;
            }),
            error: null,
          }));
        } catch (error) {
          console.error('Error sending direct message:', error);
          set({ error: 'Failed to send message' });
        }
      },

      editMessage: (messageId: string, newContent: string, isGroup: boolean, chatId: string) => {
        try {
          const now = new Date().toISOString();
          
          if (isGroup) {
            set((state) => ({
              groups: state.groups.map(group => {
                if (group.id === chatId) {
                  return {
                    ...group,
                    messages: group.messages.map(msg => 
                      msg.id === messageId 
                        ? { ...msg, message: newContent, edited: true, editedAt: now }
                        : msg
                    ),
                    updatedAt: now,
                  };
                }
                return group;
              }),
              error: null,
            }));
          } else {
            set((state) => ({
              directMessages: state.directMessages.map(dm => {
                if (dm.id === chatId) {
                  return {
                    ...dm,
                    messages: dm.messages.map(msg => 
                      msg.id === messageId 
                        ? { ...msg, message: newContent, edited: true, editedAt: now }
                        : msg
                    ),
                    updatedAt: now,
                  };
                }
                return dm;
              }),
              error: null,
            }));
          }
        } catch (error) {
          console.error('Error editing message:', error);
          set({ error: 'Failed to edit message' });
        }
      },

      deleteMessage: (messageId: string, isGroup: boolean, chatId: string) => {
        try {
          if (isGroup) {
            set((state) => ({
              groups: state.groups.map(group => {
                if (group.id === chatId) {
                  const updatedMessages = group.messages.filter(msg => msg.id !== messageId);
                  return {
                    ...group,
                    messages: updatedMessages,
                    lastMessage: updatedMessages[updatedMessages.length - 1],
                    updatedAt: new Date().toISOString(),
                  };
                }
                return group;
              }),
              error: null,
            }));
          } else {
            set((state) => ({
              directMessages: state.directMessages.map(dm => {
                if (dm.id === chatId) {
                  const updatedMessages = dm.messages.filter(msg => msg.id !== messageId);
                  return {
                    ...dm,
                    messages: updatedMessages,
                    lastMessage: updatedMessages[updatedMessages.length - 1],
                    updatedAt: new Date().toISOString(),
                  };
                }
                return dm;
              }),
              error: null,
            }));
          }
        } catch (error) {
          console.error('Error deleting message:', error);
          set({ error: 'Failed to delete message' });
        }
      },

      // Utility actions
      getGroupById: (groupId: string): Group | undefined => {
        const state = get();
        return state.groups.find(group => group.id === groupId);
      },

      getDirectMessageById: (dmId: string): DirectMessage | undefined => {
        const state = get();
        return state.directMessages.find(dm => dm.id === dmId);
      },

      getCurrentGroup: (): Group | undefined => {
        const state = get();
        if (!state.currentGroupId) return undefined;
        return state.groups.find(group => group.id === state.currentGroupId);
      },

      getCurrentDirectMessage: (): DirectMessage | undefined => {
        const state = get();
        if (!state.currentDirectMessageId) return undefined;
        return state.directMessages.find(dm => dm.id === state.currentDirectMessageId);
      },

      markAsRead: (chatId: string, isGroup: boolean) => {
        try {
          if (isGroup) {
            set((state) => ({
              groups: state.groups.map(group => 
                group.id === chatId ? { ...group, unreadCount: 0 } : group
              ),
              error: null,
            }));
          } else {
            set((state) => ({
              directMessages: state.directMessages.map(dm => 
                dm.id === chatId ? { ...dm, unreadCount: 0 } : dm
              ),
              error: null,
            }));
          }
        } catch (error) {
          console.error('Error marking as read:', error);
          set({ error: 'Failed to mark as read' });
        }
      },

      // Error handling
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Initialize mock data
      initializeMockData: () => {
        const state = get();
        if (!state.currentUser) {
          // Set first user as current user for demo
          set({ currentUser: mockUsers[0] });
        }
        
        if (state.groups.length === 0) {
          // Create some mock groups
          const mockGroups: Group[] = [
            {
              id: 'group_demo_1',
              name: 'Team Chat',
              description: 'General team discussions',
              createdBy: 'user_1',
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              members: [
                {
                  id: 'user_1',
                  name: 'John Doe',
                  role: 'admin',
                  joinedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                  isOnline: true,
                },
                {
                  id: 'user_2',
                  name: 'Jane Smith',
                  role: 'member',
                  joinedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
                  isOnline: false,
                  lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                },
                {
                  id: 'user_3',
                  name: 'Mike Johnson',
                  role: 'member',
                  joinedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
                  isOnline: true,
                },
              ],
              messages: [
                {
                  id: 'msg_demo_1',
                  senderId: 'user_2',
                  senderName: 'Jane Smith',
                  message: 'Hey everyone! How\'s the project going?',
                  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                  type: 'text',
                },
                {
                  id: 'msg_demo_2',
                  senderId: 'user_1',
                  senderName: 'John Doe',
                  message: 'Going well! We\'re on track for the deadline.',
                  timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
                  type: 'text',
                },
                {
                  id: 'msg_demo_3',
                  senderId: 'user_3',
                  senderName: 'Mike Johnson',
                  message: 'Great! Let me know if you need any help with the backend.',
                  timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                  type: 'text',
                },
              ],
              unreadCount: 0,
              isActive: true,
            },
            {
              id: 'group_demo_2',
              name: 'Design Team',
              description: 'UI/UX discussions and feedback',
              createdBy: 'user_4',
              createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
              members: [
                {
                  id: 'user_1',
                  name: 'John Doe',
                  role: 'member',
                  joinedAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
                  isOnline: true,
                },
                {
                  id: 'user_4',
                  name: 'Sarah Wilson',
                  role: 'admin',
                  joinedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                  isOnline: false,
                  lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                },
                {
                  id: 'user_5',
                  name: 'Alex Brown',
                  role: 'member',
                  joinedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
                  isOnline: true,
                },
              ],
              messages: [
                {
                  id: 'msg_demo_4',
                  senderId: 'user_4',
                  senderName: 'Sarah Wilson',
                  message: 'I\'ve updated the design mockups. Please review when you have time.',
                  timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
                  type: 'text',
                },
              ],
              unreadCount: 1,
              isActive: true,
            },
          ];

          // Update last messages
          mockGroups.forEach(group => {
            if (group.messages.length > 0) {
              group.lastMessage = group.messages[group.messages.length - 1];
            }
          });

          set({ groups: mockGroups });
        }

        if (state.directMessages.length === 0) {
          // Create some mock direct messages
          const mockDMs: DirectMessage[] = [
            {
              id: 'dm_demo_1',
              participants: ['user_1', 'user_2'],
              participantNames: ['John Doe', 'Jane Smith'],
              messages: [
                {
                  id: 'msg_dm_1',
                  senderId: 'user_2',
                  senderName: 'Jane Smith',
                  message: 'Hey John, can we discuss the project timeline?',
                  timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
                  type: 'text',
                },
                {
                  id: 'msg_dm_2',
                  senderId: 'user_1',
                  senderName: 'John Doe',
                  message: 'Sure! I think we can finish by Friday.',
                  timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                  type: 'text',
                },
              ],
              unreadCount: 0,
              createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              isActive: true,
            },
          ];

          // Update last messages
          mockDMs.forEach(dm => {
            if (dm.messages.length > 0) {
              dm.lastMessage = dm.messages[dm.messages.length - 1];
            }
          });

          set({ directMessages: mockDMs });
        }
      },
    }),
    {
      name: 'community-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: CommunityState) => ({
        currentUser: state.currentUser,
        groups: state.groups,
        directMessages: state.directMessages,
        currentGroupId: state.currentGroupId,
        currentDirectMessageId: state.currentDirectMessageId,
      }),
    }
  )
);

// Hook for easier usage
export const useCommunity = () => {
  const {
    currentUser,
    groups,
    currentGroupId,
    directMessages,
    currentDirectMessageId,
    availableUsers,
    isLoading,
    error,
    setCurrentUser,
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
    addGroupMember,
    removeGroupMember,
    updateGroupInfo,
    setCurrentGroupId,
    createDirectMessage,
    setCurrentDirectMessageId,
    sendGroupMessage,
    sendDirectMessage,
    editMessage,
    deleteMessage,
    getGroupById,
    getDirectMessageById,
    getCurrentGroup,
    getCurrentDirectMessage,
    markAsRead,
    setLoading,
    setError,
    clearError,
    initializeMockData,
  } = useCommunityStore();

  return {
    currentUser,
    groups,
    currentGroupId,
    directMessages,
    currentDirectMessageId,
    availableUsers,
    isLoading,
    error,
    setCurrentUser,
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
    addGroupMember,
    removeGroupMember,
    updateGroupInfo,
    setCurrentGroupId,
    createDirectMessage,
    setCurrentDirectMessageId,
    sendGroupMessage,
    sendDirectMessage,
    editMessage,
    deleteMessage,
    getGroupById,
    getDirectMessageById,
    getCurrentGroup,
    getCurrentDirectMessage,
    markAsRead,
    setLoading,
    setError,
    clearError,
    initializeMockData,
  };
};

// Specific selectors for performance
export const useCurrentUser = () => useCommunityStore((state) => state.currentUser);
export const useGroups = () => useCommunityStore((state) => state.groups);
export const useDirectMessages = () => useCommunityStore((state) => state.directMessages);
export const useCommunityLoading = () => useCommunityStore((state) => state.isLoading);
export const useCommunityError = () => useCommunityStore((state) => state.error);