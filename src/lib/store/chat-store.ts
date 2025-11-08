import { ChatMessage } from "../../constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Extended chat session interface for better state management
export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  category: string;
  icon: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

// Chat state interface
interface ChatState {
  // State
  currentChatId: string | null;
  chatSessions: ChatSession[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentChatId: (chatId: string | null) => void;
  createNewChat: (title?: string) => string;
  addMessageToChat: (chatId: string, message: ChatMessage) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  updateChatPreview: (chatId: string, preview: string) => void;
  deleteChat: (chatId: string) => void;
  getChatById: (chatId: string) => ChatSession | undefined;
  getCurrentChat: () => ChatSession | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  importLegacyChatHistory: () => void;
}

// Helper function to generate unique chat ID
const generateChatId = (): string => {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to generate chat title from first message
const generateChatTitle = (firstMessage?: string): string => {
  if (!firstMessage) return "New Chat";

  // Take first 50 characters and add ellipsis if longer
  const title =
    firstMessage.length > 50
      ? firstMessage.substring(0, 50) + "..."
      : firstMessage;

  return title;
};

// Helper function to generate chat preview from last message
const generateChatPreview = (messages: ChatMessage[]): string => {
  if (messages.length === 0) return "No messages yet";

  const lastMessage = messages[messages.length - 1];
  const preview =
    lastMessage.message.length > 100
      ? lastMessage.message.substring(0, 100) + "..."
      : lastMessage.message;

  return preview;
};

// Helper function to determine chat category based on content
const determineChatCategory = (messages: ChatMessage[]): string => {
  if (messages.length === 0) return "General";

  const allText = messages.map((m) => m.message.toLowerCase()).join(" ");

  if (
    allText.includes("menu") ||
    allText.includes("food") ||
    allText.includes("dish")
  ) {
    return "Menu";
  }
  if (
    allText.includes("reservation") ||
    allText.includes("book") ||
    allText.includes("table")
  ) {
    return "Reservations";
  }
  if (allText.includes("delivery") || allText.includes("order")) {
    return "Delivery";
  }
  if (allText.includes("catering") || allText.includes("event")) {
    return "Catering";
  }
  if (
    allText.includes("hours") ||
    allText.includes("open") ||
    allText.includes("close")
  ) {
    return "Hours";
  }

  return "General";
};

// Helper function to get category icon
const getCategoryIcon = (category: string): string => {
  const iconMap: { [key: string]: string } = {
    Menu: "utensils",
    Reservations: "calendar-alt",
    Delivery: "truck",
    Catering: "concierge-bell",
    Hours: "clock",
    General: "comments",
  };

  return iconMap[category] || "comments";
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentChatId: null,
      chatSessions: [],
      isLoading: false,
      error: null,

      // Actions
      setCurrentChatId: (chatId: string | null) => {
        set({ currentChatId: chatId });
      },

      createNewChat: (title?: string): string => {
        try {
          const newChatId = generateChatId();
          const now = new Date().toISOString();

          const newChat: ChatSession = {
            id: newChatId,
            title: title || "New Chat",
            preview: "No messages yet",
            timestamp: "Just now",
            category: "General",
            icon: "comments",
            messages: [],
            createdAt: now,
            updatedAt: now,
            isActive: true,
          };

          set((state) => ({
            chatSessions: [newChat, ...state.chatSessions],
            currentChatId: newChatId,
            error: null,
          }));

          return newChatId;
        } catch (error) {
          console.error("Error creating new chat:", error);
          set({
            error:
              "Failed to create new chat. Please check your storage and try again.",
          });
          return "";
        }
      },

      addMessageToChat: (chatId: string, message: ChatMessage) => {
        try {
          set((state) => {
            const chatIndex = state.chatSessions.findIndex(
              (chat) => chat.id === chatId
            );
            if (chatIndex === -1) {
              return {
                error:
                  "Chat session not found. Please try creating a new chat.",
              };
            }

            // Validate message
            if (!message.id || !message.role || !message.message?.trim()) {
              return { error: "Invalid message format. Please try again." };
            }

            const updatedSessions = [...state.chatSessions];
            const chat = { ...updatedSessions[chatIndex] };
            const updatedMessages = [...chat.messages, message];

            // Update chat metadata
            chat.messages = updatedMessages;
            chat.updatedAt = new Date().toISOString();
            chat.timestamp = "Just now";
            chat.preview = generateChatPreview(updatedMessages);

            // Update title if it's the first user message and title is still default
            if (
              chat.title === "New Chat" &&
              message.role === "user" &&
              updatedMessages.length === 1
            ) {
              chat.title = generateChatTitle(message.message);
            }

            // Update category based on message content
            chat.category = determineChatCategory(updatedMessages);
            chat.icon = getCategoryIcon(chat.category);

            updatedSessions[chatIndex] = chat;

            // Move updated chat to the top
            const [updatedChat] = updatedSessions.splice(chatIndex, 1);
            updatedSessions.unshift(updatedChat);

            return {
              chatSessions: updatedSessions,
              error: null,
            };
          });
        } catch (error) {
          console.error("Error adding message to chat:", error);
          set({
            error:
              "Failed to save message. Please check your storage and try again.",
          });
        }
      },

      updateChatTitle: (chatId: string, title: string) => {
        set((state) => {
          const updatedSessions = state.chatSessions.map((chat) =>
            chat.id === chatId
              ? { ...chat, title, updatedAt: new Date().toISOString() }
              : chat
          );

          return { chatSessions: updatedSessions, error: null };
        });
      },

      updateChatPreview: (chatId: string, preview: string) => {
        set((state) => {
          const updatedSessions = state.chatSessions.map((chat) =>
            chat.id === chatId
              ? { ...chat, preview, updatedAt: new Date().toISOString() }
              : chat
          );

          return { chatSessions: updatedSessions, error: null };
        });
      },

      deleteChat: (chatId: string) => {
        try {
          set((state) => {
            const chatExists = state.chatSessions.some(
              (chat) => chat.id === chatId
            );
            if (!chatExists) {
              return {
                error: "Chat not found. It may have already been deleted.",
              };
            }

            const updatedSessions = state.chatSessions.filter(
              (chat) => chat.id !== chatId
            );
            const newCurrentChatId =
              state.currentChatId === chatId ? null : state.currentChatId;

            return {
              chatSessions: updatedSessions,
              currentChatId: newCurrentChatId,
              error: null,
            };
          });
        } catch (error) {
          console.error("Error deleting chat:", error);
          set({ error: "Failed to delete chat. Please try again." });
        }
      },

      getChatById: (chatId: string): ChatSession | undefined => {
        const state = get();
        return state.chatSessions.find((chat) => chat.id === chatId);
      },

      getCurrentChat: (): ChatSession | undefined => {
        const state = get();
        if (!state.currentChatId) return undefined;
        return state.chatSessions.find(
          (chat) => chat.id === state.currentChatId
        );
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      importLegacyChatHistory: () => {
        // Import existing chat history from constants if no chats exist
        const state = get();
        if (state.chatSessions.length === 0) {
          try {
            // Create mock chat sessions with markdown table examples for testing
            const mockChatSessions: ChatSession[] = [
              {
                id: "mock_basic_table",
                title: "Basic Table Example",
                preview: "Testing basic markdown table formatting",
                timestamp: "5 minutes ago",
                category: "Menu",
                icon: "utensils",
                messages: [
                  {
                    id: "msg_1",
                    role: "user",
                    message: "Can you show me a basic table format?",
                    timestamp: new Date().toISOString(),
                  },
                  {
                    id: "msg_2",
                    role: "assistant",
                    message: `Here's a **basic table** example:\n\n| Name | Age | City |\n|------|-----|------|\n| John | 25  | NYC  |\n| Jane | 30  | LA   |\n| Bob  | 35  | Chicago |\n\nThis demonstrates simple rows and columns with standard formatting.`,
                    timestamp: new Date().toISOString(),
                  },
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: false,
              },
              {
                id: "mock_alignment_table",
                title: "Table Alignment Demo",
                preview: "Testing table alignment controls",
                timestamp: "10 minutes ago",
                category: "Menu",
                icon: "utensils",
                messages: [
                  {
                    id: "msg_3",
                    role: "user",
                    message: "How do I align table columns?",
                    timestamp: new Date().toISOString(),
                  },
                  {
                    id: "msg_4",
                    role: "assistant",
                    message: `Here's how to control **table alignment**:\n\n| Product | Price | Rating | Status |\n|:--------|:-----:|-------:|:------:|\n| iPhone  | $999  | 4.5/5  | Available |\n| Samsung | $799  | 4.2/5  | Limited |\n| Google  | $699  | 4.0/5  | Sold Out |\n\n- \`:---\` = left align\n- \`:---:\` = center align\n- \`---:\` = right align`,
                    timestamp: new Date().toISOString(),
                  },
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: false,
              },
              {
                id: "mock_formatted_table",
                title: "Advanced Table Formatting",
                preview: "Testing special characters and formatting in tables",
                timestamp: "15 minutes ago",
                category: "General",
                icon: "comments",
                messages: [
                  {
                    id: "msg_5",
                    role: "user",
                    message: "Can tables include special formatting?",
                    timestamp: new Date().toISOString(),
                  },
                  {
                    id: "msg_6",
                    role: "assistant",
                    message: `**Yes!** Tables can include various formatting:\n\n| Feature | Description | Example | Status |\n|---------|-------------|---------|--------|\n| **Bold** | \`Strong emphasis\` | **Important** | ✅ Active |\n| *Italic* | _Emphasis text_ | *Highlighted* | ⚠️ Warning |\n| \`Code\` | Inline code blocks | \`console.log()\` | 🔧 Dev |\n| Links | [Link text](url) | [GitHub](https://github.com) | 🌐 Live |\n| Emoji | Unicode symbols | 🚀 🎉 💡 | 🎯 Ready |\n\nThis includes **bold**, *italic*, \`code\`, links, and emojis!`,
                    timestamp: new Date().toISOString(),
                  },
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: false,
              },
              {
                id: "mock_ai_history_table",
                title: "AI Development History",
                preview: "Comprehensive AI timeline in table format",
                timestamp: "20 minutes ago",
                category: "General",
                icon: "comments",
                messages: [
                  {
                    id: "msg_7",
                    role: "user",
                    message: "Can you show me the history of AI development?",
                    timestamp: new Date().toISOString(),
                  },
                  {
                    id: "msg_8",
                    role: "assistant",
                    message: `Here's a comprehensive **AI Development Timeline**:\n\n| Year | Milestone | Key Figures | Impact | Technology |\n|:----:|-----------|-------------|:------:|------------|\n| 1950 | Turing Test | Alan Turing | 🧠 Foundational | Theoretical Framework |\n| 1956 | AI Term Coined | John McCarthy | 🎯 Defining | Dartmouth Conference |\n| 1957 | Perceptron | Frank Rosenblatt | ⚡ Neural Networks | Single-layer NN |\n| 1965 | ELIZA | Joseph Weizenbaum | 💬 NLP | Pattern Matching |\n| 1997 | Deep Blue | IBM Team | 🏆 Games | Specialized Hardware |\n| 2006 | Deep Learning | Geoffrey Hinton | 🚀 Renaissance | Deep Neural Networks |\n| 2017 | Transformer | Google Research | 🔤 Language | Attention Mechanism |\n| 2020 | GPT-3 | OpenAI | 🌟 Breakthrough | 175B Parameters |\n| 2022 | ChatGPT | OpenAI | 🌍 Mainstream | RLHF Training |\n| 2023 | GPT-4 | OpenAI | 🎨 Multimodal | Vision + Language |\n\nThis timeline shows the major breakthroughs that shaped modern AI!`,
                    timestamp: new Date().toISOString(),
                  },
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: false,
              },
              {
                id: "mock_complex_table",
                title: "Complex Table with Multi-line Content",
                preview: "Testing tables with nested content and line breaks",
                timestamp: "25 minutes ago",
                category: "General",
                icon: "comments",
                messages: [
                  {
                    id: "msg_9",
                    role: "user",
                    message:
                      "Can tables handle complex content with multiple lines?",
                    timestamp: new Date().toISOString(),
                  },
                  {
                    id: "msg_10",
                    role: "assistant",
                    message: `**Absolutely!** Here's a complex table with multi-line content:\n\n| Component | Technologies | Features | Complexity |\n|-----------|--------------|----------|------------|\n| Frontend | • React<br>• TypeScript<br>• Tailwind | - Responsive UI<br>- Dark mode<br>- Animations | ⭐⭐⭐ |\n| Backend | • Node.js<br>• Express<br>• MongoDB | - REST API<br>- Authentication<br>- Real-time | ⭐⭐⭐⭐ |\n| DevOps | • Docker<br>• AWS<br>• CI/CD | - Auto deploy<br>- Monitoring<br>- Scaling | ⭐⭐⭐⭐⭐ |\n\nUsing \`<br>\` tags allows multiple lines within table cells!`,
                    timestamp: new Date().toISOString(),
                  },
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: false,
              },
            ];

            set({ chatSessions: mockChatSessions });
            console.log("Mock chat sessions with table examples created");
          } catch (error) {
            console.error("Failed to import legacy chat history:", error);
            set({ error: "Failed to import chat history" });
          }
        }
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: ChatState) => ({
        currentChatId: state.currentChatId,
        chatSessions: state.chatSessions,
      }),
      onRehydrateStorage: () => (state) => {
        try {
          if (state) {
            // Set loading to false after hydration
            state.isLoading = false;
            state.error = null;

            // Validate and clean up chat sessions
            if (state.chatSessions) {
              state.chatSessions = state.chatSessions.filter(
                (chat) =>
                  chat && chat.id && chat.title && Array.isArray(chat.messages)
              );
            } else {
              state.chatSessions = [];
            }

            // Import legacy data if no chats exist
            if (state.chatSessions.length === 0) {
              state.importLegacyChatHistory();
            }

            // Validate current chat ID
            if (
              state.currentChatId &&
              !state.chatSessions.some(
                (chat) => chat.id === state.currentChatId
              )
            ) {
              state.currentChatId =
                state.chatSessions.length > 0 ? state.chatSessions[0].id : null;
            }
          }
        } catch (error) {
          console.error("Error during storage rehydration:", error);
          if (state) {
            state.isLoading = false;
            state.error = "Failed to load chat history. Starting fresh.";
            state.chatSessions = [];
            state.currentChatId = null;
          }
        }
      },
    }
  )
);

// Selectors and convenience hooks
export const useChat = () => {
  const {
    currentChatId,
    chatSessions,
    isLoading,
    error,
    setCurrentChatId,
    createNewChat,
    addMessageToChat,
    updateChatTitle,
    updateChatPreview,
    deleteChat,
    getChatById,
    getCurrentChat,
    setLoading,
    setError,
    clearError,
    importLegacyChatHistory,
  } = useChatStore();

  return {
    currentChatId,
    chatSessions,
    isLoading,
    error,
    setCurrentChatId,
    createNewChat,
    addMessageToChat,
    updateChatTitle,
    updateChatPreview,
    deleteChat,
    getChatById,
    getCurrentChat,
    setLoading,
    setError,
    clearError,
    importLegacyChatHistory,
  };
};

// Specific selectors for common use cases
export const useCurrentChatId = () =>
  useChatStore((state) => state.currentChatId);
export const useChatSessions = () =>
  useChatStore((state) => state.chatSessions);
export const useChatLoading = () => useChatStore((state) => state.isLoading);
export const useChatError = () => useChatStore((state) => state.error);
