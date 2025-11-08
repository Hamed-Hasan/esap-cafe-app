import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCommunity } from '../../../../lib/store/community-store';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import ChatInput from '../../../../components/chatbox/chat-input';

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  
  const {
    getCurrentGroup,
    getGroupById,
    sendGroupMessage,
    currentUser,
    availableUsers,
    addGroupMember,
    removeGroupMember,
    deleteGroup,
    leaveGroup,
  } = useCommunity();

  // Debug logging
  console.log('GroupChatScreen - Route ID:', id);
  const currentGroup = getCurrentGroup();
  const groupById = getGroupById(id!);
  console.log('GroupChatScreen - Current Group:', currentGroup?.id);
  console.log('GroupChatScreen - Group by ID:', groupById?.id);
  
  const group = currentGroup || groupById;

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [group?.messages]);

  if (!group) {
    return (
      <View className={`flex-1 justify-center items-center ${
        isDark ? 'bg-bg-dark' : 'bg-bg-light'
      }`}>
        <Text className={`text-lg ${
          isDark ? 'text-text-primary-dark' : 'text-text-primary'
        }`}>
          Group not found
        </Text>
      </View>
    );
  }

  const handleSendMessage = (message: string) => {
    if (message.trim() && currentUser) {
      sendGroupMessage(group.id, {
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        message: message.trim(),
        type: 'text',
      });
    }
  };

  const handleAddMember = (userId: string) => {
    addGroupMember(group.id, userId);
    setShowAddMembers(false);
  };

  const handleRemoveMember = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${user?.name} from this group?`,
      [
        { text: 'Cancel', style: 'cancel' as const },
        {
          text: 'Remove',
          style: 'destructive' as const,
          onPress: () => removeGroupMember(group.id, userId),
        },
      ]
    );
  };

  const handleDeleteGroup = () => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' as const },
        {
          text: 'Delete',
          style: 'destructive' as const,
          onPress: () => {
            deleteGroup(group.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      'Leave Group',
      'Are you sure you want to leave this group?',
      [
        { text: 'Cancel', style: 'cancel' as const },
        {
          text: 'Leave',
          style: 'destructive' as const,
          onPress: () => {
            leaveGroup(group.id);
            router.back();
          },
        },
      ]
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateHeader = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = () => {
    const grouped: { [key: string]: any[] } = {};
    group.messages.forEach(message => {
      const dateKey = new Date(message.timestamp).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    });
    return grouped;
  };

  const availableUsersToAdd = availableUsers.filter(user => 
    user.id !== currentUser?.id && !group.members.some(member => member.id === user.id)
  );

  const isGroupAdmin = group.createdBy === currentUser?.id;

  const renderMessage = (message: any, isLast: boolean) => {
    const isCurrentUser = message.senderId === currentUser?.id;
    const sender = availableUsers.find(u => u.id === message.senderId);
    
    return (
      <View
        key={message.id}
        className={`mb-3 ${isCurrentUser ? 'items-end' : 'items-start'}`}
      >
        {!isCurrentUser && (
          <Text
            className={`text-xs mb-1 ml-3 ${
              isDark ? 'text-text-muted-dark' : 'text-text-muted'
            }`}
          >
            {sender?.name || 'Unknown User'}
          </Text>
        )}
        
        <View
          className={`max-w-[80%] px-4 py-3 rounded-2xl ${
            isCurrentUser
              ? isDark
                ? 'bg-accent rounded-br-md'
                : 'bg-accent rounded-br-md'
              : isDark
              ? 'bg-primary-dark rounded-bl-md'
              : 'bg-primary-light rounded-bl-md'
          }`}
        >
          <Text
            className={`text-base ${
              isCurrentUser
                ? 'text-white'
                : isDark
                ? 'text-text-primary-dark'
                : 'text-text-primary'
            }`}
          >
            {message.message}
          </Text>
          
          <Text
            className={`text-xs mt-1 ${
              isCurrentUser
                ? 'text-white opacity-70'
                : isDark
                ? 'text-text-muted-dark'
                : 'text-text-muted'
            }`}
          >
            {formatTimestamp(message.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const renderAddMemberItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleAddMember(item.id)}
      className={`flex-row items-center p-4 border-b ${
        isDark ? 'border-border-dark' : 'border-border-light'
      }`}
    >
      <View
        className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
          isDark ? 'bg-secondary-dark' : 'bg-secondary'
        }`}
      >
        <Text className="text-white font-semibold text-lg">
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      <View className="flex-1">
        <Text
          className={`font-semibold text-base ${
            isDark ? 'text-text-primary-dark' : 'text-text-primary'
          }`}
        >
          {item.name}
        </Text>
        {item.email && (
          <Text
            className={`text-sm ${
              isDark ? 'text-text-secondary-dark' : 'text-text-secondary'
            }`}
          >
            {item.email}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? 'bg-bg-dark' : 'bg-bg-light'
      }`}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
      {/* Header */}
      <View
        className={`flex-row items-center justify-between px-4 py-3 border-b ${
          isDark
            ? 'bg-bg-header-dark border-border-dark'
            : 'bg-bg-header-light border-border-light'
        }`}
      >
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <FontAwesome5
              name="arrow-left"
              size={20}
              color={isDark ? '#FFFFFF' : '#000000'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setShowGroupInfo(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Show group information for ${group.name}`}
            accessibilityHint="Double tap to view group details and members"
            className="flex-1 flex-row items-center"
          >
            <View
              className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                isDark ? 'bg-secondary-dark' : 'bg-secondary'
              }`}
            >
              <Text className="text-white font-semibold">
                {group.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            
            <View className="flex-1">
              <Text
                className={`font-semibold text-lg ${
                  isDark ? 'text-text-primary-dark' : 'text-text-primary'
                }`}
              >
                {group.name}
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? 'text-text-secondary-dark' : 'text-text-secondary'
                }`}
              >
                {group.members.length} members
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {isGroupAdmin && (
          <TouchableOpacity 
            onPress={() => setShowAddMembers(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Add new member to group"
            accessibilityHint="Double tap to open member selection"
          >
            <FontAwesome5
              name="user-plus"
              size={20}
              color={isDark ? '#4EBD7C' : '#4EBD7C'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupMessagesByDate()).map(([dateKey, messages]) => (
          <View key={dateKey}>
            {/* Date Header */}
            <View className="items-center my-4">
              <View
                className={`px-3 py-1 rounded-full ${
                  isDark ? 'bg-primary-dark' : 'bg-primary-light'
                }`}
              >
                <Text
                  className={`text-xs ${
                    isDark ? 'text-text-muted-dark' : 'text-text-muted'
                  }`}
                >
                  {formatDateHeader(messages[0].timestamp)}
                </Text>
              </View>
            </View>
            
            {/* Messages for this date */}
            {messages.map((message, index) =>
              renderMessage(message, index === messages.length - 1)
            )}
          </View>
        ))}
      </ScrollView>

      {/* Chat Input */}
      <View className="px-4 pb-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          placeholder={`Message ${group.name}...`}
        />
      </View>

      {/* Group Info Modal */}
      <Modal
        visible={showGroupInfo}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowGroupInfo(false)}
      >
        <View
          className={`flex-1 ${
            isDark ? 'bg-bg-dark' : 'bg-bg-light'
          }`}
        >
          {/* Modal Header */}
          <View
            className={`flex-row items-center justify-between px-4 py-3 border-b ${
              isDark
                ? 'bg-bg-header-dark border-border-dark'
                : 'bg-bg-header-light border-border-light'
            }`}
          >
            <TouchableOpacity onPress={() => setShowGroupInfo(false)}>
              <Text
                className={`text-base ${
                  isDark ? 'text-accent' : 'text-accent'
                }`}
              >
                Done
              </Text>
            </TouchableOpacity>
            <Text
              className={`text-lg font-semibold ${
                isDark ? 'text-text-primary-dark' : 'text-text-primary'
              }`}
            >
              Group Info
            </Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView className="flex-1">
            {/* Group Details */}
            <View className="items-center py-6">
              <View
                className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
                  isDark ? 'bg-secondary-dark' : 'bg-secondary'
                }`}
              >
                <Text className="text-white font-bold text-2xl">
                  {group.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text
                className={`text-2xl font-bold ${
                  isDark ? 'text-text-primary-dark' : 'text-text-primary'
                }`}
              >
                {group.name}
              </Text>
              {group.description && (
                <Text
                  className={`text-base mt-2 text-center px-6 ${
                    isDark ? 'text-text-secondary-dark' : 'text-text-secondary'
                  }`}
                >
                  {group.description}
                </Text>
              )}
            </View>

            {/* Members Section */}
            <View className="px-4">
              <Text
                className={`text-lg font-semibold mb-3 ${
                  isDark ? 'text-text-primary-dark' : 'text-text-primary'
                }`}
              >
                Members ({group.members.length})
              </Text>
              
              {group.members.map((member) => {
                const user = availableUsers.find(u => u.id === member.id);
                const isAdmin = member.id === group.createdBy;
                
                return (
                  <View
                    key={member.id}
                    className={`flex-row items-center justify-between p-3 mb-2 rounded-xl ${
                      isDark ? 'bg-primary-dark' : 'bg-primary-light'
                    }`}
                  >
                    <View className="flex-row items-center flex-1">
                      <View
                        className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                          isDark ? 'bg-secondary-dark' : 'bg-secondary'
                        }`}
                      >
                        <Text className="text-white font-semibold text-lg">
                          {user?.name.charAt(0).toUpperCase() || '?'}
                        </Text>
                      </View>
                      
                      <View className="flex-1">
                        <Text
                          className={`font-semibold text-base ${
                            isDark ? 'text-text-primary-dark' : 'text-text-primary'
                          }`}
                        >
                          {user?.name || 'Unknown User'}
                          {member.id === currentUser?.id && ' (You)'}
                        </Text>
                        {isAdmin && (
                          <Text
                            className={`text-sm ${
                              isDark ? 'text-accent' : 'text-accent'
                            }`}
                          >
                            Group Admin
                          </Text>
                        )}
                      </View>
                    </View>
                    
                    {isGroupAdmin && member.id !== currentUser?.id && (
                      <TouchableOpacity
                        onPress={() => handleRemoveMember(member.id)}
                      >
                        <FontAwesome5
                          name="user-minus"
                          size={16}
                          color={isDark ? '#FF6B6B' : '#FF6B6B'}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Actions */}
            <View className="px-4 py-6">
              {!isGroupAdmin && (
                <TouchableOpacity
                  onPress={handleLeaveGroup}
                  className="bg-red-500 py-3 px-4 rounded-xl mb-3"
                >
                  <Text className="text-white text-center font-semibold">
                    Leave Group
                  </Text>
                </TouchableOpacity>
              )}
              
              {isGroupAdmin && (
                <TouchableOpacity
                  onPress={handleDeleteGroup}
                  className="bg-red-500 py-3 px-4 rounded-xl"
                >
                  <Text className="text-white text-center font-semibold">
                    Delete Group
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Add Members Modal */}
      <Modal
        visible={showAddMembers}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddMembers(false)}
      >
        <View
          className={`flex-1 ${
            isDark ? 'bg-bg-dark' : 'bg-bg-light'
          }`}
        >
          {/* Modal Header */}
          <View
            className={`flex-row items-center justify-between px-4 py-3 border-b ${
              isDark
                ? 'bg-bg-header-dark border-border-dark'
                : 'bg-bg-header-light border-border-light'
            }`}
          >
            <TouchableOpacity onPress={() => setShowAddMembers(false)}>
              <Text
                className={`text-base ${
                  isDark ? 'text-accent' : 'text-accent'
                }`}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <Text
              className={`text-lg font-semibold ${
                isDark ? 'text-text-primary-dark' : 'text-text-primary'
              }`}
            >
              Add Members
            </Text>
            <View style={{ width: 60 }} />
          </View>

          {/* Available Users */}
          {availableUsersToAdd.length === 0 ? (
            <View className="flex-1 justify-center items-center px-8">
              <FontAwesome5
                name="users"
                size={48}
                color={isDark ? '#767577' : '#989898'}
              />
              <Text
                className={`text-lg font-medium mt-4 text-center ${
                  isDark ? 'text-text-muted-dark' : 'text-text-muted'
                }`}
              >
                No Users Available
              </Text>
              <Text
                className={`text-sm text-center mt-2 ${
                  isDark ? 'text-text-muted-dark' : 'text-text-muted'
                }`}
              >
                All available users are already members of this group
              </Text>
            </View>
          ) : (
            <FlatList
              data={availableUsersToAdd}
              renderItem={renderAddMemberItem}
              keyExtractor={(item) => item.id}
              className="flex-1"
            />
          )}
        </View>
      </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}