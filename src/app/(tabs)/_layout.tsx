import { TAB_ROUTES } from "../../routes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { Image, Platform, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const tabBarStyle = {
    backgroundColor: isDark
      ? "rgba(34, 38, 43, 0.9)"
      : Platform.OS === "android"
      ? "#FFFFFF" // Solid white for Android light mode
      : "rgba(255, 255, 255, 0.48)", // Semi-transparent for iOS
    height: Platform.OS === "ios" ? 70 : 88,
    paddingTop: Platform.OS === "ios" ? 5 : 15,
    borderTopWidth: Platform.OS === "ios" ? 1 : 0,
    borderTopColor: isDark
      ? "rgba(34, 38, 43, 0.9)"
      : Platform.OS === "android"
      ? "#E5E5E5" // Light gray border for Android
      : "rgba(255, 255, 255, 0.48)",
    elevation: Platform.OS === "android" ? 8 : 0, // Add shadow for Android
    shadowColor: Platform.OS === "ios" ? "#000" : undefined,
    shadowOffset: Platform.OS === "ios" ? { width: 0, height: -2 } : undefined,
    shadowOpacity: Platform.OS === "ios" ? 0.1 : undefined,
    shadowRadius: Platform.OS === "ios" ? 4 : undefined,
  };

  const getTabBarIcon = (iconName: any, focused: boolean) => {
    const iconColor = focused
      ? "#FFBC33" // status-active (consistent for both themes)
      : isDark
      ? "#5B616D" // status-inactive dark
      : Platform.OS === "android"
      ? "#8C929C" // Better contrast for Android light mode
      : "#5B616D"; // status-inactive iOS

    if (focused) {
      return (
        <View
          style={{
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Shadow background image for active tab */}
          <Image
            source={require("../../assets/active-shadow.png")}
            style={{
              position: "absolute",
              bottom: -50,
              left: -40,
              width: 131,
              height: 74,
              resizeMode: "contain",
            }}
          />
          {/* Icon on top of shadow */}
          <Ionicons name={iconName} size={22} color={iconColor} />
        </View>
      );
    }

    return <Ionicons name={iconName} size={22} color={iconColor} />;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark
          ? "rgba(34, 38, 43, 0.9)"
          : Platform.OS === "android"
          ? "#F8F9FA" // Light background for Android
          : "rgba(255, 255, 255, 0.48)", // Semi-transparent for iOS
      }}
      edges={["top", "left", "right", "bottom"]}
    >
      <Tabs
        screenOptions={{
          tabBarStyle,
          tabBarActiveTintColor: "#FFBC33", // consistent active color for both themes
          tabBarInactiveTintColor: isDark
            ? "#AFB3BB"
            : Platform.OS === "android"
            ? "#6B7280" // Better contrast for Android light mode
            : "#8C929C", // iOS light mode
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginTop: 8,
          },
          headerShown: false,
          animation: "shift",
        }}
      >
        {/* Render visible tab screens */}
        {TAB_ROUTES.map((route) => (
          <Tabs.Screen
            key={route.name}
            name={route.name}
            options={{
              title: route.title,
              tabBarIcon: ({ focused }) => getTabBarIcon(route.icon, focused),
            }}
          />
        ))}
      </Tabs>
    </SafeAreaView>
  );
}
