import ChatInput from "../../../components/chatbox/chat-input";
import { ChatMessage } from "../../../constants/constants";
import { ChatService } from "../../../lib/services/chat-service";
import { useChat } from "../../../lib/store/chat-store";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";

export default function ChatPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    currentChatId,
    createNewChat,
    addMessageToChat,
    getCurrentChat,
    setCurrentChatId,
    error,
    clearError,
  } = useChat();

  const currentChat = getCurrentChat();
  const messages = currentChat?.messages || [];

  // Create a new chat if none exists
  useEffect(() => {
    if (!currentChatId) {
      const newChatId = createNewChat();
      setCurrentChatId(newChatId);
    }
  }, [currentChatId, createNewChat, setCurrentChatId]);

  // Display error if any
  useEffect(() => {
    if (error) {
      Alert.alert("Storage Error", error, [
        {
          text: "OK",
          onPress: () => {
            clearError();
          },
        },
      ]);
    }
  }, [error, clearError]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSendMessage = async (message: string) => {
    const validation = ChatService.validateMessage(message);
    if (!validation.isValid) {
      Alert.alert(
        "Invalid Message",
        validation.error || "Please enter a valid message"
      );
      return;
    }

    if (!currentChatId) {
      Alert.alert("Error", "No active chat session. Please create a new chat.");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user message
    addMessageToChat(currentChatId, userMessage);

    // Check for errors after adding message
    if (error) {
      Alert.alert("Error", error);
      return;
    }

    try {
      // Get AI response
      const aiResponse = await ChatService.generateAIResponse(
        message,
        messages
      );

      // Check if AI response has an error
      if (aiResponse.error) {
        console.warn("AI response warning:", aiResponse.error);
        // Still show the fallback message but log the error
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        message: aiResponse.message,
        timestamp: aiResponse.timestamp,
      };

      // Add AI response
      addMessageToChat(currentChatId, assistantMessage);

      // Check for errors after adding AI response
      if (error) {
        Alert.alert("Error", error);
      }
    } catch (error) {
      console.error("Failed to get AI response:", error);
      Alert.alert(
        "Error",
        "Failed to get AI response. Please check your connection and try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${isDark ? "bg-bg-dark" : "bg-bg-light"}`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="p-6">
          {messages.length === 0 ? (
            <View className="flex-1 items-center justify-center min-h-96">
              <Text className="text-6xl mb-4">🍽️</Text>
              <Text className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
                AI Restaurant Assistant
              </Text>
              <Text className="text-text-secondary dark:text-text-secondary-dark mt-4 text-center px-6">
                Welcome to our AI Chat! Ask me anything about our menu, hours,
                reservations, or services. Swipe from the left to access chat
                history and FAQs.
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {messages.map((message) => (
                <View
                  key={message.id}
                  className={`flex-row items-end ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  {/* AI Avatar - Left side for assistant messages */}
                  {message.role === "assistant" && (
                    <View className="w-10 h-10 rounded-full bg-green-500 mr-3 flex items-center justify-center">
                      <Text className="text-white text-base font-bold">🤖</Text>
                    </View>
                  )}

                  <View
                    className={`max-w-[75%] p-4 rounded-2xl ${
                      message.role === "user"
                        ? isDark
                          ? "bg-status-active rounded-br-md"
                          : "bg-status-active rounded-br-md"
                        : isDark
                        ? "bg-primary-dark rounded-bl-md"
                        : "bg-primary-light rounded-bl-md"
                    }`}
                  >
                    <Markdown
                      style={{
                        body: {
                          fontSize: 16,
                          lineHeight: 24,
                          color:
                            message.role === "user"
                              ? "#FFFFFF"
                              : isDark
                              ? "#FFFFFF"
                              : "#000000",
                          margin: 0,
                          padding: 0,
                        },
                        paragraph: {
                          marginTop: 0,
                          marginBottom: 0,
                          color:
                            message.role === "user"
                              ? "#FFFFFF"
                              : isDark
                              ? "#FFFFFF"
                              : "#000000",
                        },
                        strong: {
                          color:
                            message.role === "user"
                              ? "#FFFFFF"
                              : isDark
                              ? "#FFFFFF"
                              : "#000000",
                        },
                        em: {
                          color:
                            message.role === "user"
                              ? "#FFFFFF"
                              : isDark
                              ? "#FFFFFF"
                              : "#000000",
                        },
                        code_inline: {
                          backgroundColor: isDark ? "#1E1410" : "#F6F2E0",
                          color: isDark ? "#D5BBA2" : "#482C20",
                          paddingHorizontal: 4,
                          paddingVertical: 2,
                          borderRadius: 4,
                        },
                        code_block: {
                          backgroundColor: isDark ? "#1E1410" : "#F6F2E0",
                          color: isDark ? "#D5BBA2" : "#482C20",
                          padding: 8,
                          borderRadius: 8,
                          marginVertical: 4,
                        },
                        fence: {
                          backgroundColor: isDark ? "#1E1410" : "#F6F2E0",
                          color: isDark ? "#D5BBA2" : "#482C20",
                          padding: 8,
                          borderRadius: 8,
                          marginVertical: 4,
                        },
                        blockquote: {
                          backgroundColor: isDark ? "#2E2A27" : "#D5BBA2",
                          borderLeftColor: isDark ? "#332920" : "#A67C52",
                          borderLeftWidth: 4,
                          paddingLeft: 16,
                          paddingVertical: 8,
                          marginVertical: 8,
                        },
                        bullet_list: {
                          marginVertical: 8,
                        },
                        ordered_list: {
                          marginVertical: 8,
                        },
                        list_item: {
                          marginVertical: 4,
                        },
                        hr: {
                          backgroundColor: isDark ? "#332920" : "#D5BBA2",
                          marginVertical: 16,
                        },
                        heading1: {
                          color:
                            message.role === "user"
                              ? "#FFFFFF"
                              : isDark
                              ? "#D5BBA2"
                              : "#482C20",
                          marginVertical: 10,
                        },
                        heading2: {
                          color:
                            message.role === "user"
                              ? "#FFFFFF"
                              : isDark
                              ? "#D5BBA2"
                              : "#482C20",
                          marginVertical: 10,
                        },
                        heading3: {
                          color:
                            message.role === "user"
                              ? "#FFFFFF"
                              : isDark
                              ? "#D5BBA2"
                              : "#482C20",
                          marginVertical: 10,
                        },
                      }}
                    >
                      {message.message}
                    </Markdown>
                  </View>

                  {/* User Avatar - Right side for user messages */}
                  {message.role === "user" && (
                    <View className="w-10 h-10 rounded-full bg-gray-400 ml-3 flex items-center justify-center">
                      <Text className="text-white text-base font-bold">👤</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <ChatInput
        onSendMessage={handleSendMessage}
        placeholder="Ask about our menu, hours, or reservations..."
      />
    </KeyboardAvoidingView>
  );
}
