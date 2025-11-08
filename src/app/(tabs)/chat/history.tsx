import HistoryItem from "../../../components/chatbox/history-item";
import SectionHeader from "../../../components/chatbox/section-header";
import { useChat } from "../../../lib/store/chat-store";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function History() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  const { chatSessions, currentChatId, setCurrentChatId, deleteChat } =
    useChat();

  const handleHistoryPress = (chatSession: any) => {
    setActiveHistoryId(chatSession.id);
    setCurrentChatId(chatSession.id);
    router.push(`/(tabs)/chat/${chatSession.id}`);
  };

  const handleDeletePress = (chatId: string, chatTitle: string) => {
    Alert.alert(
      "Delete Chat",
      `Are you sure you want to delete "${chatTitle}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteChat(chatId);
            if (currentChatId === chatId) {
              // If we deleted the current chat, navigate to main chat
              router.push("/(tabs)/chat");
            }
          },
        },
      ]
    );
  };

  return (
    <View className={`flex-1 ${isDark ? "bg-bg-dark" : "bg-bg-light"}`}>
      {/* Header */}
      <View className="px-4 pt-4">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-lg"
          >
            <FontAwesome5
              name="arrow-left"
              size={20}
              color={isDark ? "#4EBD7C" : "#4EBD7C"}
            />
          </TouchableOpacity>
          <SectionHeader
            title={`${chatSessions.length} Conversations`}
            icon="history"
            isDark={isDark}
            className="mb-0 pt-0"
          />
        </View>
      </View>

      {/* Chat History List */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="gap-y-3 pb-6">
          {chatSessions.length === 0 ? (
            <View
              className={`p-8 rounded-xl items-center ${
                isDark ? "bg-secondary-dark" : "bg-secondary"
              }`}
            >
              <FontAwesome5
                name="history"
                size={48}
                color={isDark ? "#989898" : "#A67C52"}
                style={{ marginBottom: 16 }}
              />
              <Text
                className={`text-center text-lg font-semibold mb-2 ${
                  isDark ? "text-text-primary-dark" : "text-text-primary"
                }`}
              >
                No chat history yet
              </Text>
              <Text
                className={`text-center text-base ${
                  isDark ? "text-text-secondary-dark" : "text-text-secondary"
                }`}
              >
                Start a new conversation to see it here
              </Text>
            </View>
          ) : (
            chatSessions.map((session) => (
              <View key={session.id} className="flex-row items-center">
                <View className="flex-1 mr-3">
                  <HistoryItem
                    id={session.id}
                    title={session.title}
                    timestamp={session.timestamp}
                    preview={session.preview}
                    category={session.category}
                    icon={session.icon}
                    isDark={isDark}
                    isActive={currentChatId === session.id}
                    messages={session.messages}
                    onPress={() => handleHistoryPress(session)}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => handleDeletePress(session.id, session.title)}
                  className={`p-3 rounded-lg ${
                    isDark ? "bg-red-500/20" : "bg-red-500/10"
                  }`}
                >
                  <FontAwesome5
                    name="trash"
                    size={16}
                    color={isDark ? "#FF6B6B" : "#DC2626"}
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
