import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useCommunity } from "../../lib/store/community-store";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import { CustomButton } from "../../components/custom-button";

export default function GroupsList() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const {
    groups,
    currentUser,
    createGroup,
    setCurrentGroupId,
    deleteGroup,
    leaveGroup,
    error,
    clearError,
  } = useCommunity();

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }

    const newGroupId = createGroup(groupName.trim(), groupDescription.trim());
    if (newGroupId) {
      setGroupName("");
      setGroupDescription("");
      setShowCreateModal(false);
      // Navigate to the new group
      router.push(`/(tabs)/community/groups/${newGroupId}` as any);
    }
  };

  const handleGroupPress = (groupId: string) => {
    console.log("Group pressed:", groupId);
    const navigationPath = `/(tabs)/community/groups/${groupId}`;
    console.log("Navigating to:", navigationPath);

    try {
      // Set the current group ID before navigation
      setCurrentGroupId(groupId);
      router.push(navigationPath as any);
      console.log("Navigation successful");
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  const handleGroupLongPress = (
    groupId: string,
    groupName: string,
    isAdmin: boolean
  ) => {
    const options = [];

    if (isAdmin) {
      options.push({
        text: "Delete Group",
        style: "destructive" as const,
        onPress: () => {
          Alert.alert(
            "Delete Group",
            `Are you sure you want to delete "${groupName}"? This action cannot be undone.`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => deleteGroup(groupId),
              },
            ]
          );
        },
      });
    } else {
      options.push({
        text: "Leave Group",
        style: "destructive" as const,
        onPress: () => {
          Alert.alert(
            "Leave Group",
            `Are you sure you want to leave "${groupName}"?`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Leave",
                style: "destructive",
                onPress: () => leaveGroup(groupId),
              },
            ]
          );
        },
      });
    }

    options.push({ text: "Cancel", style: "cancel" as const });

    Alert.alert("Group Options", "", options);
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

  const getLastMessagePreview = (group: any) => {
    if (!group.lastMessage) return "No messages yet";
    const isCurrentUser = group.lastMessage.senderId === currentUser?.id;
    const senderName = isCurrentUser ? "You" : group.lastMessage.senderName;
    return `${senderName}: ${group.lastMessage.message.substring(0, 50)}${
      group.lastMessage.message.length > 50 ? "..." : ""
    }`;
  };

  // Filter groups where current user is a member
  const userGroups = groups.filter((group) =>
    group.members.some((member) => member.id === currentUser?.id)
  );

  return (
    <View className="flex-1">
      {/* Create Group Button */}
      <View className="px-4 py-3">
        <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Create new group"
          accessibilityHint="Double tap to open group creation form"
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
            Create New Group
          </Text>
        </TouchableOpacity>
      </View>

      {/* Groups List */}
      <ScrollView className="flex-1 px-4">
        {userGroups.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <FontAwesome5
              name="users"
              size={48}
              color={isDark ? "#767577" : "#989898"}
            />
            <Text
              className={`text-lg font-medium mt-4 ${
                isDark ? "text-text-muted-dark" : "text-text-muted"
              }`}
            >
              No Groups Yet
            </Text>
            <Text
              className={`text-sm text-center mt-2 px-8 ${
                isDark ? "text-text-muted-dark" : "text-text-muted"
              }`}
            >
              Create your first group to start chatting with your team
            </Text>
          </View>
        ) : (
          userGroups.map((group) => {
            const isAdmin =
              group.members.find((m) => m.id === currentUser?.id)?.role ===
              "admin";
            const onlineMembers = group.members.filter(
              (m) => m.isOnline
            ).length;

            return (
              <TouchableOpacity
                key={group.id}
                onPress={() => handleGroupPress(group.id)}
                onLongPress={() =>
                  handleGroupLongPress(group.id, group.name, isAdmin)
                }
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Open ${group.name} group chat`}
                accessibilityHint={`Double tap to open group chat, long press for group options`}
                className={`mb-3 p-4 rounded-xl ${
                  isDark ? "bg-primary-dark" : "bg-primary-light"
                }`}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 mr-3">
                    {/* Group Name and Admin Badge */}
                    <View className="flex-row items-center mb-2">
                      <View
                        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                          isDark ? "bg-accent-dark" : "bg-accent"
                        }`}
                      >
                        <FontAwesome5 name="users" size={16} color="white" />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center">
                          <Text
                            className={`font-semibold text-base ${
                              isDark
                                ? "text-text-primary-dark"
                                : "text-text-primary"
                            }`}
                          >
                            {group.name}
                          </Text>
                          {isAdmin && (
                            <View
                              className={`ml-2 px-2 py-1 rounded-full ${
                                isDark ? "bg-accent-dark" : "bg-accent"
                              }`}
                            >
                              <Text className="text-white text-xs font-medium">
                                Admin
                              </Text>
                            </View>
                          )}
                        </View>
                        {group.description && (
                          <Text
                            className={`text-xs mt-1 ${
                              isDark
                                ? "text-text-secondary-dark"
                                : "text-text-secondary"
                            }`}
                          >
                            {group.description}
                          </Text>
                        )}
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
                      {getLastMessagePreview(group)}
                    </Text>

                    {/* Group Info */}
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Text
                          className={`text-xs ${
                            isDark ? "text-text-muted-dark" : "text-text-muted"
                          }`}
                        >
                          {group.members.length} members
                        </Text>
                        {onlineMembers > 0 && (
                          <>
                            <View
                              className={`w-1 h-1 rounded-full mx-2 ${
                                isDark ? "bg-text-muted-dark" : "bg-text-muted"
                              }`}
                            />
                            <Text
                              className={`text-xs ${
                                isDark ? "text-accent" : "text-accent"
                              }`}
                            >
                              {onlineMembers} online
                            </Text>
                          </>
                        )}
                      </View>

                      {group.lastMessage && (
                        <Text
                          className={`text-xs ${
                            isDark ? "text-text-muted-dark" : "text-text-muted"
                          }`}
                        >
                          {formatTimestamp(group.lastMessage.timestamp)}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Unread Badge */}
                  {group.unreadCount > 0 && (
                    <View
                      className={`min-w-6 h-6 rounded-full items-center justify-center ${
                        isDark ? "bg-accent" : "bg-accent"
                      }`}
                    >
                      <Text className="text-white text-xs font-bold">
                        {group.unreadCount > 99 ? "99+" : group.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Create Group Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
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
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
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
              Create Group
            </Text>
            <View style={{ width: 60 }} />
          </View>

          {/* Modal Content */}
          <View className="flex-1 px-4 py-6">
            <View className="mb-6">
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? "text-text-primary-dark" : "text-text-primary"
                }`}
              >
                Group Name *
              </Text>
              <TextInput
                value={groupName}
                onChangeText={setGroupName}
                placeholder="Enter group name"
                placeholderTextColor={isDark ? "#767577" : "#989898"}
                accessible={true}
                accessibilityLabel="Group name input"
                accessibilityHint="Enter the name for your new group"
                className={`p-3 rounded-xl border ${
                  isDark
                    ? "bg-bg-dark border-border-dark text-text-primary-dark"
                    : "bg-bg-light border-border-light text-text-primary"
                }`}
                maxLength={50}
              />
            </View>

            <View className="mb-6">
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? "text-text-primary-dark" : "text-text-primary"
                }`}
              >
                Description (Optional)
              </Text>
              <TextInput
                value={groupDescription}
                onChangeText={setGroupDescription}
                placeholder="What's this group about?"
                placeholderTextColor={isDark ? "#767577" : "#989898"}
                multiline
                numberOfLines={3}
                accessible={true}
                accessibilityLabel="Group description input"
                accessibilityHint="Enter an optional description for your group"
                className={`p-3 rounded-xl border ${
                  isDark
                    ? "bg-bg-dark border-border-dark text-text-primary-dark"
                    : "bg-bg-light border-border-light text-text-primary"
                }`}
                maxLength={200}
                textAlignVertical="top"
              />
            </View>

            <CustomButton
              title="Create Group"
              onPress={handleCreateGroup}
              disabled={!groupName.trim()}
              className="mt-4"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
