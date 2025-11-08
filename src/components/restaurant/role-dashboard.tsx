import { RoleData } from "../../constants/restaurant-data";
import cn from "clsx";
import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import Svg, {
  Defs,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import GradientCard from "../gradient-card";

interface RoleDashboardProps {
  roleData: RoleData;
  onPress?: () => void;
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({
  roleData,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { width: screenWidth } = useWindowDimensions();

  const completionPercentage =
    roleData.totalTasks > 0
      ? Math.round((roleData.completedTasks / roleData.totalTasks) * 100)
      : 0;

  // Calculate responsive SVG width based on screen size
  // Use most of the available width with proper padding
  const progressBarWidth = Math.max(screenWidth - 70, 200); // Screen width minus padding, minimum 200px
  const progressWidth = progressBarWidth * (completionPercentage / 100); // Dynamic progress based on completion percentage

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-accent";
    if (percentage >= 50) return "bg-secondary";
    return "bg-red-500";
  };

  const getUrgentTasksCount = () => {
    return roleData.tasks.filter(
      (task) => task.priority === "high" && task.status === "pending"
    ).length;
  };

  return (
    <TouchableOpacity onPress={onPress} className="mb-5">
      <GradientCard>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: `${roleData.color}20` }}
            >
              <Text className="text-2xl">{roleData.icon}</Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
                {roleData.role}
              </Text>
              <Text className="text-sm text-text-secondary dark:text-text-secondary-dark">
                Total Tasks {roleData.totalTasks}
              </Text>
            </View>
          </View>

          {getUrgentTasksCount() > 0 && (
            <View className="bg-danger/[12%] px-3 py-2 rounded-full">
              <Text className="text-xs font-open-sauce-two-medium font-medium text-danger">
                {getUrgentTasksCount()} Urgent
              </Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View className="flex-col justify-between gap-2 mb-6">
          <View className="flex-row items-center justify-between">
            <Text
              className={`text-sm font-medium ${
                isDark ? "text-white/[48%]" : "text-[#8C929C]"
              }`}
            >
              Done
            </Text>
            <Text
              className={`text-sm font-bold ${
                isDark ? "text-white/[48%]" : "text-[#8C929C]"
              }`}
            >
              {completionPercentage}%
            </Text>
          </View>
          {isDark ? (
            <Svg
              width={progressBarWidth}
              height="11"
              viewBox={`0 0 ${progressBarWidth} 11`}
              fill="none"
            >
              <Defs>
                <SvgLinearGradient
                  id="paint0_linear_85694_32562"
                  x1="0.894"
                  y1="5.5"
                  x2={progressWidth}
                  y2="5.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop stopColor="#35C220" />
                  <Stop offset="1" stopColor="#E8FBE5" />
                </SvgLinearGradient>
              </Defs>
              <Rect
                width={progressBarWidth}
                height="11"
                rx="5.5"
                fill="#1F2228"
              />
              <Rect
                x="0.894"
                y="1"
                width={progressWidth - 0.894}
                height="9"
                rx="4.5"
                fill="url(#paint0_linear_85694_32562)"
              />
            </Svg>
          ) : (
            <Svg
              width={progressBarWidth}
              height="11"
              viewBox={`0 0 ${progressBarWidth} 11`}
              fill="none"
            >
              <Defs>
                <SvgLinearGradient
                  id="paint0_linear_85723_9382"
                  x1="0.894"
                  y1="5.5"
                  x2={progressWidth}
                  y2="5.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop stopColor="#35C220" />
                  <Stop offset="1" stopColor="#E8FBE5" />
                </SvgLinearGradient>
              </Defs>
              <Rect
                width={progressBarWidth}
                height="11"
                rx="5.5"
                fill="#F2F2F4"
              />
              <Rect
                x="0.894"
                y="1"
                width={progressWidth - 0.894}
                height="9"
                rx="4.5"
                fill="url(#paint0_linear_85723_9382)"
              />
            </Svg>
          )}
        </View>

        {/* Task Statistics */}
        <View className="flex-row justify-between pb-4">
          <View className="flex-1 items-center">
            <Text className="font-open-sauce-two-bold text-2xl text-info">
              {roleData.pendingTasks}
            </Text>
            <Text
              className={cn(
                "text-base mt-1",
                isDark ? "text-white/[48%]" : "text-[#8C929C]"
              )}
            >
              Pending
            </Text>
          </View>

          <View className="w-px mx-4" />

          <View className="flex-1 items-center">
            <Text className={cn("text-2xl font-bold text-success")}>
              {roleData.completedTasks}
            </Text>
            <Text
              className={cn(
                "text-base mt-1",
                isDark ? "text-white/[48%]" : "text-[#8C929C]"
              )}
            >
              Completed
            </Text>
          </View>

          <View className="w-px mx-4" />

          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-warning">
              {roleData.tasks.filter((t) => t.status === "in-progress").length}
            </Text>
            <Text
              className={cn(
                "text-base mt-1",
                isDark ? "text-white/[48%]" : "text-[#8C929C]"
              )}
            >
              In Progress
            </Text>
          </View>
        </View>
      </GradientCard>
    </TouchableOpacity>
  );
};

export default RoleDashboard;
