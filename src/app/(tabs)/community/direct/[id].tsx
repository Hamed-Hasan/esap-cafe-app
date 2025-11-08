import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCommunity } from "../../../../lib/store/community-store";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import ChatInput from "../../../../components/chatbox/chat-input";

export default function DirectMessageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    getCurrentDirectMessage,
    getDirectMessageById,
    sendDirectMessage,
    currentUser,
    availableUsers,
  } = useCommunity();

  const directMessage = getCurrentDirectMessage() || getDirectMessageById(id!);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [directMessage?.messages]);

  if (!directMessage) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDark ? "bg-bg-dark" : "bg-bg-light"
        }`}
      >
        <Text
          className={`text-lg ${
            isDark ? "text-text-primary-dark" : "text-text-primary"
          }`}
        >
          Conversation not found
        </Text>
      </View>
    );
  }

  const handleSendMessage = (message: string) => {
    if (message.trim() && currentUser) {
      sendDirectMessage(directMessage.id, {
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        message: message.trim(),
        type: "text",
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDateHeader = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = () => {
    const grouped: { [key: string]: any[] } = {};
    directMessage.messages.forEach((message) => {
      const dateKey = new Date(message.timestamp).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    });
    return grouped;
  };

  // Get the other participant info
  const getOtherParticipant = () => {
    const otherParticipantId = directMessage.participants.find(
      (id) => id !== currentUser?.id
    );
    const otherParticipantIndex = directMessage.participants.indexOf(
      otherParticipantId!
    );
    const otherUser = availableUsers.find((u) => u.id === otherParticipantId);

    return {
      id: otherParticipantId,
      name:
        directMessage.participantNames[otherParticipantIndex] ||
        otherUser?.name ||
        "Unknown User",
      avatar:
        directMessage.participantAvatars?.[otherParticipantIndex] ||
        otherUser?.avatar,
      isOnline: otherUser?.isOnline,
      lastSeen: otherUser?.lastSeen,
    };
  };

  const otherParticipant = getOtherParticipant();

  const renderMessage = (message: any, isLast: boolean) => {
    const isCurrentUser = message.senderId === currentUser?.id;

    return (
      <View
        key={message.id}
        className={`mb-3 ${isCurrentUser ? "items-end" : "items-start"}`}
        accessible={true}
        accessibilityLabel={`${
          isCurrentUser ? "You" : message.senderName
        } said: ${message.message}. Sent at ${formatTimestamp(
          message.timestamp
        )}`}
        accessibilityRole="text"
      >
        <View
          className={`max-w-[80%] px-4 py-3 rounded-2xl ${
            isCurrentUser
              ? isDark
                ? "bg-accent rounded-br-md"
                : "bg-accent rounded-br-md"
              : isDark
              ? "bg-primary-dark rounded-bl-md"
              : "bg-primary-light rounded-bl-md"
          }`}
        >
          <Text
            className={`text-base ${
              isCurrentUser
                ? "text-white"
                : isDark
                ? "text-text-primary-dark"
                : "text-text-primary"
            }`}
          >
            {message.message}
          </Text>

          <Text
            className={`text-xs mt-1 ${
              isCurrentUser
                ? "text-white opacity-70"
                : isDark
                ? "text-text-muted-dark"
                : "text-text-muted"
            }`}
          >
            {formatTimestamp(message.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-bg-dark" : "bg-bg-light"}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View
          className={`flex-row items-center justify-between px-4 py-3 border-b ${
            isDark
              ? "bg-bg-header-dark border-border-dark"
              : "bg-bg-header-light border-border-light"
          }`}
        >
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              accessibilityHint="Double tap to return to previous screen"
            >
              <FontAwesome5
                name="arrow-left"
                size={20}
                color={isDark ? "#FFFFFF" : "#000000"}
              />
            </TouchableOpacity>

            <View className="flex-1 flex-row items-center">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  isDark ? "bg-secondary-dark" : "bg-secondary"
                }`}
              >
                <Text className="text-white font-semibold">
                  {otherParticipant.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View className="flex-1">
                <Text
                  className={`font-semibold text-lg ${
                    isDark ? "text-text-primary-dark" : "text-text-primary"
                  }`}
                >
                  {otherParticipant.name}
                </Text>

                {/* Online Status */}
                {otherParticipant.isOnline ? (
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-accent mr-2" />
                    <Text
                      className={`text-sm ${
                        isDark ? "text-accent" : "text-accent"
                      }`}
                    >
                      Online
                    </Text>
                  </View>
                ) : (
                  otherParticipant.lastSeen && (
                    <Text
                      className={`text-sm ${
                        isDark
                          ? "text-text-secondary-dark"
                          : "text-text-secondary"
                      }`}
                    >
                      Last seen {formatLastSeen(otherParticipant.lastSeen)}
                    </Text>
                  )
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          accessible={true}
          accessibilityLabel="Chat messages"
          accessibilityHint="Scroll to view more messages"
        >
          {directMessage.messages.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <FontAwesome5
                name="comment"
                size={48}
                color={isDark ? "#767577" : "#989898"}
              />
              <Text
                className={`text-lg font-medium mt-4 ${
                  isDark ? "text-text-muted-dark" : "text-text-muted"
                }`}
              >
                No messages yet
              </Text>
              <Text
                className={`text-sm text-center mt-2 px-8 ${
                  isDark ? "text-text-muted-dark" : "text-text-muted"
                }`}
              >
                Start the conversation with {otherParticipant.name}
              </Text>
            </View>
          ) : (
            Object.entries(groupMessagesByDate()).map(([dateKey, messages]) => (
              <View key={dateKey}>
                {/* Date Header */}
                <View className="items-center my-4">
                  <View
                    className={`px-3 py-1 rounded-full ${
                      isDark ? "bg-primary-dark" : "bg-primary-light"
                    }`}
                  >
                    <Text
                      className={`text-xs ${
                        isDark ? "text-text-muted-dark" : "text-text-muted"
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
            ))
          )}
        </ScrollView>

        {/* Chat Input */}
        <View className="px-4 pb-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            placeholder={`Message ${otherParticipant.name}...`}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
