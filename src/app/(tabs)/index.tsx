import {
  QuickStats,
  RecentTasks,
  RoleDashboard,
  TaskDetailModal,
} from "../../components";
import {
  restaurantMockData,
  RoleData,
  Task,
} from "../../constants/restaurant-data";
import { useLogoutMutation } from "../../lib/hooks/use-auth-mutations";
import { useAuth } from "../../lib/store/auth-store";
import cn from "clsx";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function Index() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isAuthenticated, user } = useAuth();
  const logoutMutation = useLogoutMutation();
  const [selectedRoleData, setSelectedRoleData] = useState<RoleData | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleRolePress = (roleData: RoleData) => {
    setSelectedRoleData(roleData);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRoleData(null);
  };

  const handleTaskPress = (task: Task) => {
    Alert.alert(
      task.title,
      `${
        task.description
      }\n\nPriority: ${task.priority.toUpperCase()}\nStatus: ${task.status
        .replace("-", " ")
        .toUpperCase()}\nCategory: ${task.category}`,
      [
        { text: "Close", style: "cancel" },
        { text: "Mark Complete", style: "default" },
      ]
    );
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-bg-light dark:bg-bg-dark px-6">
        <View className="items-center mb-8">
          <Text className="text-6xl mb-4">🍽️</Text>
          <Text className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
            Restaurant Manager
          </Text>
          <Text className="text-text-secondary dark:text-text-secondary-dark text-center">
            Streamline your restaurant operations with our comprehensive
            management system
          </Text>
        </View>

        <Link href="/sign-in" asChild>
          <TouchableOpacity className="bg-primary dark:bg-primary-dark px-8 py-4 rounded-xl">
            <Text className="text-white font-semibold text-lg">
              Sign In to Continue
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg-light dark:bg-bg-dark">
      {/* Header */}
      <View className="px-6 pt-5 pb-5">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-text-secondary dark:text-text-secondary-dark">
              Hi, {user?.full_name}
            </Text>
            <Text className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mt-1.5">
              Good Morning! 👋
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            disabled={logoutMutation.isPending}
            className="items-center justify-center w-12 h-12 rounded-full bg-primary dark:bg-primary-dark"
          >
            {user?.profile_image ? (
              <Image
                source={{ uri: user.profile_image }}
                className="w-12 h-12 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-white font-semibold text-lg">
                {user?.full_name?.charAt(0).toUpperCase() || "U"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Quick Stats Overview */}
        <QuickStats />

        {/* Recent/Urgent Tasks */}
        <View className="pt-4 flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
            Task Overview
          </Text>
          <Link href="/chat" asChild>
            <TouchableOpacity
              className={cn(
                "rounded-full border border-[#FFAB00]/[24%] min-w-[70px] h-6 justify-center items-center",
                isDark ? "bg-[#212121]" : "bg-white"
              )}
            >
              <Text
                className="text-xs font-medium"
                style={{ color: "#FFBC33" }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
        <RecentTasks onTaskPress={handleTaskPress} />

        {/* Role-based Dashboards */}
        <View className="pt-5">
          <Text className="pb-6 text-lg font-open-sauce-two-medium text-text-primary dark:text-text-primary-dark">
            Department Overview
          </Text>

          {restaurantMockData.map((roleData) => (
            <RoleDashboard
              key={roleData.role}
              roleData={roleData}
              onPress={() => handleRolePress(roleData)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Task Detail Modal */}
      <TaskDetailModal
        visible={isModalVisible}
        roleData={selectedRoleData}
        onClose={handleCloseModal}
        onTaskPress={handleTaskPress}
      />
    </View>
  );
}
