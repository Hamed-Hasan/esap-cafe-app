import ChatInput from "../../../components/chatbox/chat-input";
import { ChatService } from "../../../lib/services/chat-service";
import { useChat } from "../../../lib/store/chat-store";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

export default function ChatId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    chatSessions,
    currentChatId,
    setCurrentChatId,
    addMessageToChat,
    getChatById,
  } = useChat();

  // Find the chat session by id
  const chatSession = getChatById(id as string);

  // Set current chat ID when component mounts
  useEffect(() => {
    if (id && id !== currentChatId) {
      setCurrentChatId(id as string);
    }
  }, [id, currentChatId, setCurrentChatId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatSession?.messages.length) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatSession?.messages]);

  if (!chatSession) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDark ? "bg-bg-dark" : "bg-bg-light"
        }`}
      >
        <Text
          className={`text-lg mb-4 ${
            isDark ? "text-text-primary-dark" : "text-text-primary"
          }`}
        >
          Chat not found
        </Text>
        <Text
          className={`text-base text-center px-6 ${
            isDark ? "text-text-secondary-dark" : "text-text-secondary"
          }`}
        >
          This chat session may have been deleted or doesn't exist.
        </Text>
      </View>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Menu: "#45B7D1",
      Reservations: "#96CEB4",
      Catering: "#FFEAA7",
      Delivery: "#4ECDC4",
      hours: "#FF6B6B",
      General: "#A67C52",
    };
    return colors[category] || "#A67C52";
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !chatSession) return;

    try {
      setIsLoading(true);

      // Validate message
      const validation = ChatService.validateMessage(message);
      if (!validation.isValid) {
        Alert.alert(
          "Invalid Message",
          validation.error || "Please enter a valid message"
        );
        return;
      }

      // Add user message
      addMessageToChat(chatSession.id, {
        id: `user_${Date.now()}`,
        role: "user",
        message: message.trim(),
        timestamp: new Date().toISOString(),
      });

      // Generate AI response
      const aiResponse = await ChatService.generateAIResponse(
        message,
        chatSession.messages
      );

      // Add AI response
      addMessageToChat(chatSession.id, {
        id: `ai_${Date.now()}`,
        role: "assistant",
        message: aiResponse.message,
        timestamp: aiResponse.timestamp,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${isDark ? "bg-bg-dark" : "bg-bg-light"}`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView ref={scrollViewRef} className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <View
                className="w-3 h-3 rounded-full mr-3"
                style={{
                  backgroundColor: getCategoryColor(chatSession.category),
                }}
              />
              <Text
                className={`text-2xl font-bold flex-1 ${
                  isDark ? "text-text-primary-dark" : "text-text-primary"
                }`}
              >
                {chatSession.title}
              </Text>
              <FontAwesome5
                name={chatSession.icon}
                size={24}
                color={getCategoryColor(chatSession.category)}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text
                className={`text-sm px-3 py-1 rounded-full ${
                  isDark
                    ? "bg-secondary-dark text-text-secondary-dark"
                    : "bg-secondary text-text-secondary"
                }`}
              >
                {chatSession.category}
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? "text-text-secondary-dark" : "text-text-secondary"
                }`}
              >
                {chatSession.timestamp.includes("ago") ||
                chatSession.timestamp === "Just now"
                  ? chatSession.timestamp
                  : ChatService.formatTimestamp(
                      new Date(chatSession.timestamp)
                    )}
              </Text>
            </View>
          </View>

          {/* Preview/Description */}
          <View
            className={`p-4 rounded-xl mb-6 ${
              isDark ? "bg-primary-dark" : "bg-primary-light"
            }`}
          >
            <Text
              className={`text-base leading-6 ${
                isDark ? "text-text-primary-dark" : "text-text-primary"
              }`}
            >
              {chatSession.preview}
            </Text>
          </View>

          {/* Chat Messages */}
          <View className="space-y-4">
            {chatSession.messages.map((message) => (
              <View
                key={message.id}
                className={`flex-row items-end ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                {/* AI Avatar - Left side for assistant messages */}
                {message.role === "assistant" && (
                  <View className="w-10 h-10 rounded-full bg-status-active mr-3 flex items-center justify-center">
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
                    rules={{
                      table: (node, children, parent, styles) => (
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={true}
                          style={{
                            marginVertical: 12,
                            borderRadius: 8,
                            backgroundColor:
                              message.role === "user"
                                ? "rgba(255, 255, 255, 0.05)"
                                : isDark
                                ? "rgba(0, 0, 0, 0.2)"
                                : "rgba(255, 255, 255, 0.5)",
                          }}
                          key={node.key}
                        >
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor:
                                message.role === "user"
                                  ? "rgba(255, 255, 255, 0.3)"
                                  : isDark
                                  ? "#332920"
                                  : "#D5BBA2",
                              borderRadius: 8,
                              overflow: "hidden",
                              minWidth: 300,
                            }}
                          >
                            {children}
                          </View>
                        </ScrollView>
                      ),
                    }}
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
                        marginBottom: 8,
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
                        fontWeight: "bold",
                      },
                      em: {
                        color:
                          message.role === "user"
                            ? "#FFFFFF"
                            : isDark
                            ? "#FFFFFF"
                            : "#000000",
                        fontStyle: "italic",
                      },
                      code_inline: {
                        backgroundColor:
                          message.role === "user"
                            ? "rgba(255, 255, 255, 0.2)"
                            : isDark
                            ? "#1E1410"
                            : "#F6F2E0",
                        color:
                          message.role === "user"
                            ? "#FFFFFF"
                            : isDark
                            ? "#D5BBA2"
                            : "#482C20",
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        borderRadius: 4,
                        fontFamily: "monospace",
                      },
                      code_block: {
                        backgroundColor:
                          message.role === "user"
                            ? "rgba(255, 255, 255, 0.1)"
                            : isDark
                            ? "#1E1410"
                            : "#F6F2E0",
                        color:
                          message.role === "user"
                            ? "#FFFFFF"
                            : isDark
                            ? "#D5BBA2"
                            : "#482C20",
                        padding: 12,
                        borderRadius: 8,
                        marginVertical: 8,
                        fontFamily: "monospace",
                      },
                      fence: {
                        backgroundColor:
                          message.role === "user"
                            ? "rgba(255, 255, 255, 0.1)"
                            : isDark
                            ? "#1E1410"
                            : "#F6F2E0",
                        color:
                          message.role === "user"
                            ? "#FFFFFF"
                            : isDark
                            ? "#D5BBA2"
                            : "#482C20",
                        padding: 12,
                        borderRadius: 8,
                        marginVertical: 8,
                        fontFamily: "monospace",
                      },
                      // Table styling - Works with custom horizontal scroll renderer
                      table: {
                        backgroundColor: "transparent",
                        borderWidth: 0,
                        margin: 0,
                        padding: 0,
                        width: "auto",
                      },
                      thead: {
                        backgroundColor:
                          message.role === "user"
                            ? "rgba(255, 255, 255, 0.1)"
                            : isDark
                            ? "#2E2A27"
                            : "#E8DCC0",
                      },
                      tbody: {
                        backgroundColor: "transparent",
                      },
                      th: {
                        borderWidth: 1,
                        borderColor:
                          message.role === "user"
                            ? "rgba(255, 255, 255, 0.2)"
                            : isDark
                            ? "#332920"
                            : "#D5BBA2",
                        padding: 12,
                        fontWeight: "bold",
                        fontSize: 14,
                        color:
                          message.role === "user"
                            ? "#FFFFFF"
                            : isDark
                            ? "#D5BBA2"
                            : "#482C20",
                        textAlign: "center",
                        minWidth: 100,
                      },
                      td: {
                        borderWidth: 1,
                        borderColor:
                          message.role === "user"
                            ? "rgba(255, 255, 255, 0.15)"
                            : isDark
                            ? "#332920"
                            : "#D5BBA2",
                        padding: 10,
                        fontSize: 14,
                        color:
                          message.role === "user"
                            ? "#FFFFFF"
                            : isDark
                            ? "#FFFFFF"
                            : "#000000",
                        verticalAlign: "middle",
                        minWidth: 100,
                      },
                      tr: {
                        backgroundColor: "transparent",
                      },
                      blockquote: {
                        backgroundColor:
                          message.role === "user"
                            ? "rgba(255, 255, 255, 0.1)"
                            : isDark
                            ? "#2E2A27"
                            : "#D5BBA2",
                        borderLeftColor:
                          message.role === "user"
                            ? "#FFFFFF"
                            : isDark
                            ? "#332920"
                            : "#A67C52",
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
                        color:
                          message.role === "user"
                            ? "#FFFFFF"
                            : isDark
                            ? "#FFFFFF"
                            : "#000000",
                      },
                      hr: {
                        backgroundColor:
                          message.role === "user"
                            ? "rgba(255, 255, 255, 0.3)"
                            : isDark
                            ? "#332920"
                            : "#D5BBA2",
                        marginVertical: 16,
                        height: 1,
                      },
                      heading1: {
                        color:
                          message.role === "user"
                            ? "#FFFFFF"
                            : isDark
                            ? "#D5BBA2"
                            : "#482C20",
                        marginVertical: 12,
                        fontSize: 24,
                        fontWeight: "bold",
                      },
                      heading2: {
                        color:
                          message.role === "user"
                            ? "#FFFFFF"
                            : isDark
                            ? "#D5BBA2"
                            : "#482C20",
                        marginVertical: 10,
                        fontSize: 20,
                        fontWeight: "bold",
                      },
                      heading3: {
                        color:
                          message.role === "user"
                            ? "#FFFFFF"
                            : isDark
                            ? "#D5BBA2"
                            : "#482C20",
                        marginVertical: 8,
                        fontSize: 18,
                        fontWeight: "bold",
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
            {chatSession.messages.length === 0 && (
              <View
                className={`p-4 rounded-xl ${
                  isDark ? "bg-secondary-dark" : "bg-secondary"
                }`}
              >
                <Text
                  className={`text-center text-base ${
                    isDark ? "text-text-secondary-dark" : "text-text-secondary"
                  }`}
                >
                  💬 Start the conversation!
                </Text>
                <Text
                  className={`text-center text-sm mt-2 ${
                    isDark ? "text-text-secondary-dark" : "text-text-secondary"
                  }`}
                >
                  Ask me anything about our restaurant
                </Text>
              </View>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <View className="flex-row items-end justify-start mb-4">
                <View className="w-8 h-8 rounded-full bg-status-active mr-3 flex items-center justify-center">
                  <Text className="text-white text-sm font-bold">🤖</Text>
                </View>
                <View
                  className={`p-4 rounded-2xl rounded-bl-md ${
                    isDark ? "bg-primary-dark" : "bg-primary-light"
                  }`}
                >
                  <Text
                    className={`text-base ${
                      isDark ? "text-text-primary-dark" : "text-text-primary"
                    }`}
                  >
                    Thinking...
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <ChatInput
        onSendMessage={handleSendMessage}
        placeholder="Ask about our menu, hours, or reservations..."
        disabled={isLoading}
      />
    </KeyboardAvoidingView>
  );
}
