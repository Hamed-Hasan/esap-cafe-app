import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { useCommunity } from "../../lib/store/community-store";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";

export default function DirectMessagesList() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [showUserModal, setShowUserModal] = useState(false);

  const {
    directMessages,
    currentUser,
    availableUsers,
    createDirectMessage,
    setCurrentDirectMessageId,
  } = useCommunity();

  const handleStartChat = (userId: string) => {
    const dmId = createDirectMessage(userId);
    if (dmId) {
      setShowUserModal(false);
      // Navigate to the direct message
      router.push(`/(tabs)/community/direct/${dmId}` as any);
    }
  };

  const handleDirectMessagePress = (dmId: string) => {
    console.log("Direct message pressed:", dmId);
    const navigationPath = `/(tabs)/community/direct/${dmId}`;
    console.log("Navigating to:", navigationPath);

    try {
      // Set the current direct message ID before navigation
      setCurrentDirectMessageId(dmId);
      router.push(navigationPath as any);
      console.log("Navigation successful");
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getOtherParticipant = (dm: any) => {
    const otherParticipantId = dm.participants.find(
      (id: string) => id !== currentUser?.id
    );
    const otherParticipantIndex = dm.participants.indexOf(otherParticipantId);
    return {
      id: otherParticipantId,
      name: dm.participantNames[otherParticipantIndex],
      avatar: dm.participantAvatars?.[otherParticipantIndex],
    };
  };

  const getLastMessagePreview = (dm: any) => {
    if (!dm.lastMessage) return "No messages yet";
    const isCurrentUser = dm.lastMessage.senderId === currentUser?.id;
    const prefix = isCurrentUser ? "You: " : "";
    return `${prefix}${dm.lastMessage.message.substring(0, 50)}${
      dm.lastMessage.message.length > 50 ? "..." : ""
    }`;
  };

  // Filter available users (exclude current user and users already in DMs)
  const availableUsersForChat = availableUsers.filter((user) => {
    if (user.id === currentUser?.id) return false;
    return !directMessages.some((dm) => dm.participants.includes(user.id));
  });

  const renderUserItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => handleStartChat(item.id)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Start chat with ${item.name}`}
        accessibilityHint="Double tap to start a new conversation"
        className={`flex-row items-center p-4 border-b ${
          isDark ? "border-border-dark" : "border-border-light"
        }`}
      >
        <View
          className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
            isDark ? "bg-secondary-dark" : "bg-secondary"
          }`}
        >
          <Text className="text-white font-semibold text-lg">
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View className="flex-1">
          <Text
            className={`font-semibold text-base ${
              isDark ? "text-text-primary-dark" : "text-text-primary"
            }`}
          >
            {item.name}
          </Text>
          {item.email && (
            <Text
              className={`text-sm ${
                isDark ? "text-text-secondary-dark" : "text-text-secondary"
              }`}
            >
              {item.email}
            </Text>
          )}
        </View>

        <View className="items-end">
          {item.isOnline ? (
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-accent mr-2" />
              <Text
                className={`text-xs ${isDark ? "text-accent" : "text-accent"}`}
              >
                Online
              </Text>
            </View>
          ) : (
            item.lastSeen && (
              <Text
                className={`text-xs ${
                  isDark ? "text-text-muted-dark" : "text-text-muted"
                }`}
              >
                {formatTimestamp(item.lastSeen)}
              </Text>
            )
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1">
      {/* Start New Chat Button */}
      <View className="px-4 py-3">
        <TouchableOpacity
          onPress={() => setShowUserModal(true)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Start new direct message"
          accessibilityHint="Double tap to select a user to chat with"
          className={`flex-row items-center justify-center py-3 px-4 rounded-xl border-2 border-dashed ${
            isDark
              ? "border-border-dark bg-bg-dark"
              : "border-border-light bg-bg-light"
          }`}
        >
          <FontAwesome5
            name="plus"
            size={16}
            color={isDark ? "#4EBD7C" : "#4EBD7C"}
          />
          <Text
            className={`ml-2 font-medium ${
              isDark ? "text-accent" : "text-accent"
            }`}
          >
            Start New Chat
          </Text>
        </TouchableOpacity>
      </View>

      {/* Direct Messages List */}
      <ScrollView className="flex-1 px-4">
        {directMessages.length === 0 ? (
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
              No Direct Messages
            </Text>
            <Text
              className={`text-sm text-center mt-2 px-8 ${
                isDark ? "text-text-muted-dark" : "text-text-muted"
              }`}
            >
              Start a conversation with someone from your team
            </Text>
          </View>
        ) : (
          directMessages.map((dm) => {
            const otherParticipant = getOtherParticipant(dm);
            const otherUser = availableUsers.find(
              (u) => u.id === otherParticipant.id
            );

            return (
              <TouchableOpacity
                key={dm.id}
                onPress={() => handleDirectMessagePress(dm.id)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Open chat with ${
                  getOtherParticipant(dm).name
                }`}
                accessibilityHint="Double tap to open direct message conversation"
                className={`mb-3 p-4 rounded-xl ${
                  isDark ? "bg-primary-dark" : "bg-primary-light"
                }`}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 mr-3">
                    {/* User Info */}
                    <View className="flex-row items-center mb-2">
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
                        <View className="flex-row items-center justify-between">
                          <Text
                            className={`font-semibold text-base ${
                              isDark
                                ? "text-text-primary-dark"
                                : "text-text-primary"
                            }`}
                          >
                            {otherParticipant.name}
                          </Text>
                          {otherUser?.isOnline && (
                            <View className="flex-row items-center">
                              <View className="w-2 h-2 rounded-full bg-accent mr-1" />
                              <Text
                                className={`text-xs ${
                                  isDark ? "text-accent" : "text-accent"
                                }`}
                              >
                                Online
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Last Message */}
                    <Text
                      className={`text-sm mb-2 ${
                        isDark
                          ? "text-text-secondary-dark"
                          : "text-text-secondary"
                      }`}
                    >
                      {getLastMessagePreview(dm)}
                    </Text>

                    {/* Timestamp */}
                    {dm.lastMessage && (
                      <Text
                        className={`text-xs ${
                          isDark ? "text-text-muted-dark" : "text-text-muted"
                        }`}
                      >
                        {formatTimestamp(dm.lastMessage.timestamp)}
                      </Text>
                    )}
                  </View>

                  {/* Unread Badge */}
                  {dm.unreadCount > 0 && (
                    <View
                      className={`min-w-6 h-6 rounded-full items-center justify-center ${
                        isDark ? "bg-accent" : "bg-accent"
                      }`}
                    >
                      <Text className="text-white text-xs font-bold">
                        {dm.unreadCount > 99 ? "99+" : dm.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Select User Modal */}
      <Modal
        visible={showUserModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowUserModal(false)}
      >
        <View className={`flex-1 ${isDark ? "bg-bg-dark" : "bg-bg-light"}`}>
          {/* Modal Header */}
          <View
            className={`flex-row items-center justify-between px-4 py-3 border-b ${
              isDark
                ? "bg-bg-header-dark border-border-dark"
                : "bg-bg-header-light border-border-light"
            }`}
          >
            <TouchableOpacity
              onPress={() => setShowUserModal(false)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              accessibilityHint="Double tap to close the new chat modal"
            >
              <Text
                className={`text-base ${
                  isDark ? "text-accent" : "text-accent"
                }`}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <Text
              className={`text-lg font-semibold ${
                isDark ? "text-text-primary-dark" : "text-text-primary"
              }`}
            >
              Start New Chat
            </Text>
            <View style={{ width: 60 }} />
          </View>

          {/* Users List */}
          {availableUsersForChat.length === 0 ? (
            <View className="flex-1 justify-center items-center px-8">
              <FontAwesome5
                name="users"
                size={48}
                color={isDark ? "#767577" : "#989898"}
              />
              <Text
                className={`text-lg font-medium mt-4 text-center ${
                  isDark ? "text-text-muted-dark" : "text-text-muted"
                }`}
              >
                No Available Users
              </Text>
              <Text
                className={`text-sm text-center mt-2 ${
                  isDark ? "text-text-muted-dark" : "text-text-muted"
                }`}
              >
                You already have conversations with all available users
              </Text>
            </View>
          ) : (
            <FlatList
              data={availableUsersForChat}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id}
              className="flex-1"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
