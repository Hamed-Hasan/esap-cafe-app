import {
  DrawerLayout,
  type DrawerItem,
} from "../../../components/drawer-layout";
import CustomChatDrawer from "../../../components/chatbox/custom-chat-drawer";
import React from "react";
import { useColorScheme } from "react-native";

const chatDrawerItems: DrawerItem[] = [
  {
    name: "index",
    title: "Chat",
    icon: "comments",
  },
  {
    name: "history",
    title: "Chat History",
    icon: "history",
  },
];

export default function ChatLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const chatScreenOptions = {
    headerTitle: "AI Chat",
    headerStyle: {
      backgroundColor: isDark ? "#2E2A27" : "#F6F2E0",
      height: 60, // Standard header height to prevent conflicts
    },
    headerTitleStyle: {
      color: isDark ? "#FFFFFF" : "#1E1410",
      fontSize: 18,
      fontWeight: "600",
    },
    headerTintColor: isDark ? "#FFFFFF" : "#1E1410",
    drawerInactiveTintColor: isDark ? "#989898" : "#A67C52",
    drawerActiveTintColor: "#4EBD7C",
    drawerStyle: {
      backgroundColor: isDark ? "#1E1410" : "#F6F2E0",
      borderRightColor: isDark ? "#332920" : "#D5BBA2",
      borderRightWidth: 1,
    },
    headerStatusBarHeight: 0, // Prevent double padding with SafeAreaView
    headerTransparent: false,
  };

  return (
    <DrawerLayout
      drawerItems={chatDrawerItems}
      screenOptions={chatScreenOptions}
      drawerContent={CustomChatDrawer}
    />
  );
}
