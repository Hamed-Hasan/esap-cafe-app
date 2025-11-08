import { Task } from "../../constants/restaurant-data";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import GradientCard from "../gradient-card";

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-[#F03D3D]/[12%]";
      case "medium":
        return "bg-[#F09D3D]/[12%] text-[#F09D3D]";
      case "low":
        return "bg-[#3DF09D]/[12%] text-[#3DF09D]";
      default:
        return "bg-[#F0F03D]/[12%] text-[#F0F03D]";
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-[#F36363]";
      case "medium":
        return "text-[#F09D3D]";
      case "low":
        return "text-[#3DF09D]";
      default:
        return "text-[#F0F03D]";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-success bg-success/[12%]";
      case "in-progress":
        return "text-warning bg-warning/[12%]";
      case "pending":
        return "text-info bg-info/[12%]";
      default:
        return "text-text-muted dark:text-text-muted-dark";
    }
  };

  return (
    <TouchableOpacity onPress={onPress} className="mb-5">
      <GradientCard>
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-row items-center gap-2.5 pt-1">
            <View
              className={`size-8 p-3 rounded-xl items-center justify-center ${
                isDark ? "bg-[#1F2228]" : "bg-[#F2F2F4]"
              }`}
            >
              <Image
                source={require("../../assets/icons/task.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
            </View>
            <Text
              className={`text-base font-open-sauce-two-semibold font-semibold ${
                isDark ? "text-white" : "text-[#0A0C11]"
              }`}
            >
              {task.title}
            </Text>
          </View>
          {task.dueTime && (
            <View className="flex-row items-center gap-2 px-2 py-1 rounded-lg">
              <Image
                source={require("../../assets/icons/clock.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
              <Text className="text-xs font-medium text-[#8C929C] dark:text-white/[48%]">
                {task.dueTime}
              </Text>
            </View>
          )}
        </View>
        <Text className="text-sm text-[#8C929C] dark:text-white/[48%] mb-3 leading-5">
          {task.description}
        </Text>
        <View className="pt-5 flex-row justify-between items-center gap-2">
          <View className="flex-row items-center gap-x-2">
            <View
              className={`px-2 py-1 rounded-full ${getPriorityColor(
                task.priority
              )}`}
            >
              <Text
                className={`text-xs font-medium capitalize ${getPriorityTextColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </Text>
            </View>

            <View className="bg-[#118BE8]/[12%] px-2 py-1 rounded-full">
              <Text className="text-xs font-medium text-[#118BE8]">
                {task.category}
              </Text>
            </View>
          </View>

          <Text
            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
              task.status
            )}`}
          >
            {task.status.replace("-", " ")}
          </Text>
        </View>
      </GradientCard>
    </TouchableOpacity>
  );
};

export default TaskCard;
