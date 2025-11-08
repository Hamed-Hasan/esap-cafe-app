import { restaurantFAQs } from "../../constants/constants";
import { useChat } from "../../lib/store/chat-store";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FAQCard from "./faq-card";
import HistoryItem from "./history-item";
import NewChatButton from "./new-chat-button";
import SectionHeader from "./section-header";

interface CustomChatDrawerProps extends DrawerContentComponentProps {}

export default function CustomChatDrawer(props: CustomChatDrawerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const { chatSessions, currentChatId, createNewChat, setCurrentChatId } =
    useChat();

  const handleFAQPress = (faq: any) => {
    // Navigate to chat with pre-filled FAQ question
    router.push("/(tabs)/chat");
  };

  const handleHistoryPress = (chatSession: any) => {
    // Set active chat session
    setActiveHistoryId(chatSession.id);
    setCurrentChatId(chatSession.id);
    // Navigate to specific chat
    router.push(`/(tabs)/chat/${chatSession.id}`);
    // Close drawer after navigation
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: isDark ? "#1E1410" : "#F6F2E0",
        paddingTop: 0, // Remove extra top padding to prevent header overlap
        paddingBottom: insets.bottom, // Add bottom safe area padding
      }}
      style={{
        paddingTop: 0, // Ensure no top padding on the scroll view itself
      }}
    >
      <View
        className="flex-1 px-4"
        style={{
          paddingTop: 16, // Top padding for content
          paddingBottom: 24, // Bottom padding for content
        }}
      >
        {/* Controlled padding with safe area consideration */}
        {/* Header with New Chat Button */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className={`text-2xl font-bold ${
                isDark ? "text-text-primary-dark" : "text-text-primary"
              }`}
            >
              🍽️ Cafe Assistant
            </Text>
          </View>

          {/* Prominent New Chat Button */}
          <NewChatButton isDark={isDark} />
        </View>

        {/* Frequently Asked Questions Section */}
        <View className="mb-8">
          <SectionHeader
            title="Frequently Asked Questions"
            icon="question-circle"
            isDark={isDark}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row gap-x-3">
              {restaurantFAQs.slice(0, 6).map((faq) => (
                <FAQCard
                  key={faq.id}
                  faq={faq}
                  onPress={handleFAQPress}
                  isDark={isDark}
                />
              ))}
            </View>
          </ScrollView>

          {/* Show More FAQs Button */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/chat/faq")}
            className={`flex-row items-center justify-center py-2 px-4 rounded-lg border ${
              isDark ? "border-border-dark" : "border-border-light"
            }`}
          >
            <Text
              className={`text-sm font-medium mr-2 ${
                isDark ? "text-text-secondary-dark" : "text-text-secondary"
              }`}
            >
              View All FAQs
            </Text>
            <FontAwesome5
              name="chevron-right"
              size={12}
              color={isDark ? "#989898" : "#A67C52"}
            />
          </TouchableOpacity>
        </View>

        {/* Chat History Section */}
        <View className="flex-1">
          <SectionHeader
            title="Recent Conversations"
            icon="history"
            isDark={isDark}
            showAction={true}
            actionIcon="list"
            onActionPress={() => router.push("/(tabs)/chat/history")}
          />

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="gap-y-3">
              {chatSessions.length === 0 ? (
                <View
                  className={`p-4 rounded-xl ${
                    isDark ? "bg-secondary-dark" : "bg-secondary"
                  }`}
                >
                  <Text
                    className={`text-center text-base ${
                      isDark
                        ? "text-text-secondary-dark"
                        : "text-text-secondary"
                    }`}
                  >
                    💬 No chat history yet
                  </Text>
                  <Text
                    className={`text-center text-sm mt-2 ${
                      isDark
                        ? "text-text-secondary-dark"
                        : "text-text-secondary"
                    }`}
                  >
                    Start a new conversation to see it here
                  </Text>
                </View>
              ) : (
                chatSessions.map((session) => (
                  <HistoryItem
                    key={session.id}
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
                ))
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}
