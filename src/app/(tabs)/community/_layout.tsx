import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { useCommunity } from "../../../lib/store/community-store";
import GroupsList from "../../../components/community/groups-list";
import DirectMessagesList from "../../../components/community/direct-messages-list";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type TabType = "groups" | "direct";

export default function CommunityLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [activeTab, setActiveTab] = useState<TabType>("groups");
  const { initializeMockData, currentUser } = useCommunity();
  const segments = useSegments();

  // Check if we're on a nested route (like groups/[id] or direct/[id])
  const isNestedRoute =
    segments.length > 2 &&
    segments[1] === "community" &&
    (segments[2] === "groups" || segments[2] === "direct");

  // Initialize mock data on mount
  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  // If we're on a nested route, render the Slot component
  if (isNestedRoute) {
    return <Slot />;
  }

  const TabButton = ({
    tab,
    icon,
    label,
  }: {
    tab: TabType;
    icon: string;
    label: string;
  }) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(tab)}
        className={`flex-1 py-3 px-4 rounded-lg mx-1 ${
          isActive
            ? isDark
              ? "bg-primary-dark"
              : "bg-primary"
            : isDark
            ? "bg-bg-dark"
            : "bg-bg-light"
        }`}
      >
        <View className="flex-row items-center justify-center">
          <FontAwesome5
            name={icon}
            size={16}
            color={isActive ? "#FFFFFF" : isDark ? "#A67C52" : "#482C20"}
          />
          <Text
            className={`ml-2 font-medium ${
              isActive
                ? "text-white"
                : isDark
                ? "text-text-secondary-dark"
                : "text-text-primary"
            }`}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-bg-dark" : "bg-bg-light"}`}>
      {/* Header */}
      <View
        className={`px-4 py-3 border-b ${
          isDark
            ? "bg-bg-header-dark border-border-dark"
            : "bg-bg-header-light border-border-light"
        }`}
      >
        <Text
          className={`text-2xl font-bold ${
            isDark ? "text-text-primary-dark" : "text-text-primary"
          }`}
        >
          Community
        </Text>
        {currentUser && (
          <Text
            className={`text-sm mt-1 ${
              isDark ? "text-text-secondary-dark" : "text-text-secondary"
            }`}
          >
            Welcome, {currentUser.name}
          </Text>
        )}
      </View>

      {/* Tab Navigation */}
      <View
        className={`flex-row px-4 py-3 ${
          isDark ? "bg-bg-dark" : "bg-bg-light"
        }`}
      >
        <TabButton tab="groups" icon="users" label="Groups" />
        <TabButton tab="direct" icon="comment" label="Direct" />
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === "groups" ? (
          <GroupsList />
        ) : activeTab === "direct" ? (
          <DirectMessagesList />
        ) : null}
      </View>
    </SafeAreaView>
  );
}
