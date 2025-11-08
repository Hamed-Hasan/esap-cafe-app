import { restaurantMockData } from "../../constants/restaurant-data";
import cn from "clsx";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

import {
  Image,
  ImageSourcePropType,
  Text,
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

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ImageSourcePropType;
  isTotal?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  isTotal = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { width: screenWidth } = useWindowDimensions();

  // Calculate responsive SVG width based on screen size
  // For a card that takes roughly half the screen width minus padding
  const cardWidth = (screenWidth - 60) / 2; // 60px total padding (20px sides + 20px gap)
  const progressBarWidth = Math.max(cardWidth - 24, 100); // Subtract card padding, minimum 100px
  const progressWidth = progressBarWidth * 0.58; // 58% progress (50% + some visual adjustment)
  if (isTotal) {
    // Total Task card with base gradient only
    return (
      <View className="flex-1 overflow-hidden">
        <LinearGradient
          colors={
            isDark
              ? ["rgba(63, 67, 70, 0.3)", "rgba(76, 81, 85, 0.3)"]
              : ["rgba(255, 255, 255, 0.56)", "rgba(255, 255, 255, 1.0)"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0.5558, 0.9752]}
          style={{
            borderRadius: 28,
            borderWidth: 1,
            borderColor: isDark ? "#414548" : "rgba(255, 255, 255, 0.30)",
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 12,
            paddingRight: 12,
            height: 155,
            justifyContent: "space-between",
            overflow: "hidden",
          }}
        >
          <View className="flex-1 flex-col justify-between gap-7">
            <View>
              <Text
                className={`text-base font-medium ${
                  isDark ? "text-white/[48%]" : "text-[#8C929C]"
                }`}
              >
                {label}
              </Text>
              <View className="flex-row items-center gap-3 pt-1">
                <View
                  className={`size-8 p-3 rounded-xl items-center justify-center ${
                    isDark ? "bg-[#1F2228]" : "bg-[#F2F2F4]"
                  }`}
                >
                  <Image
                    source={icon as ImageSourcePropType}
                    style={{ width: 16, height: 16 }}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-[#0A0C11]"
                  }`}
                >
                  {value}+
                </Text>
              </View>
            </View>

            <View className="flex-col justify-between gap-2">
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
                  50%
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
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Other cards with primary color gradient overlay
  return (
    <View className="flex-1">
      <LinearGradient
        colors={
          isDark
            ? [
                "rgba(166, 124, 82, 0.3)", // Primary color more prominent in top-right
                "rgba(166, 124, 82, 0.2)", // Fade to lighter primary
                "rgba(63, 67, 70, 0.1)", // Dark overlay
                "rgba(76, 81, 85, 0.1)", // Darker overlay at bottom-left
              ]
            : [
                "rgba(255, 171, 0, 0.3)", // Primary color more prominent in top-right
                "rgba(255, 171, 0, 0.1)", // Fade to lighter primary
                "rgba(255, 255, 255, 0.1)", // Light overlay
                "rgba(255, 255, 255, 0.1)", // Lighter overlay at bottom-left
              ]
        }
        start={{ x: 1, y: 0 }} // Start from top-right
        end={{ x: 0, y: 1 }} // End at bottom-left
        locations={[0, 0.3, 0.7, 1]} // Concentrate primary color at top-right
        style={{
          borderRadius: 28,
          borderWidth: 1,
          borderColor: isDark ? "#414548" : "rgba(0, 0, 0, 0.05)",
          height: 155,
          justifyContent: "space-between",
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        <View className="flex-1 flex-col justify-between gap-7">
          <View>
            <Text
              className={`text-base font-medium ${
                isDark ? "text-white/[48%]" : "text-[#8C929C]"
              }`}
            >
              {label}
            </Text>
            <View className="flex-row items-center gap-3 pt-1">
              <View
                className={`size-8 rounded-xl items-center justify-center ${
                  isDark ? "bg-[#1F2228]" : "bg-[#F2F2F4]"
                }`}
              >
                <Image
                  source={icon as ImageSourcePropType}
                  style={{ width: 21, height: 21 }}
                  resizeMode="contain"
                />
              </View>
              <Text
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-[#0A0C11]"
                }`}
              >
                {value}+
              </Text>
            </View>
          </View>
          <View className="flex-col justify-between gap-1">
            <Text
              className={`text-sm font-medium ${
                isDark ? "text-white/[48%]" : "text-[#8C929C]"
              }`}
            >
              Department
            </Text>
            <View className="flex-row items-center">
              {/* Avatar 1 - Profile image */}
              <View
                className={cn(
                  "size-7 rounded-full bg-gray-300 items-center justify-center border-2 z-10",
                  isDark ? "border-[#222732]" : "border-white/[88%]"
                )}
              >
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=28&h=28&fit=crop&crop=face",
                  }}
                  style={{ width: 28, height: 28, borderRadius: 28 }}
                  resizeMode="cover"
                />
              </View>
              {/* Avatar 2 - AT */}
              <View
                className={cn(
                  "size-7 rounded-full bg-[#222732] items-center justify-center border-2 -ml-2 z-20",
                  isDark ? "border-[#222732]" : "border-white/[88%]"
                )}
              >
                <Text className="text-white text-xs font-bold">AT</Text>
              </View>
              {/* Avatar 3 - E */}
              <View
                className={cn(
                  "size-7 rounded-full bg-yellow-500 items-center justify-center border-2 -ml-2 z-30",
                  isDark ? "border-[#222732]" : "border-white/[88%]"
                )}
              >
                <Text className="text-white text-xs font-bold">E</Text>
              </View>
              {/* Avatar 5 - M */}
              <View
                className={cn(
                  "size-7 rounded-full bg-blue-400 items-center justify-center border-2 border-[#222732] -ml-2 z-50",
                  isDark ? "border-[#222732]" : "border-white/[88%]"
                )}
              >
                <Text className="text-white text-xs font-bold">M</Text>
              </View>
              {/* Avatar 6 - C */}
              <View
                className={cn(
                  "size-7 rounded-full bg-pink-500 items-center justify-center border-2 -ml-2 z-[60]",
                  isDark ? "border-[#222732]" : "border-white/[88%]"
                )}
              >
                <Text className="text-white text-xs font-bold">C</Text>
              </View>
              {/* +2 indicator */}
              <View
                className={cn(
                  "size-8 rounded-full  items-center justify-center border-2 border-white/[3%] -ml-2 z-[70]",
                  isDark
                    ? "bg-[#222732] border-[#222732]"
                    : "bg-white border-white/[88%]"
                )}
              >
                <Text
                  className={cn(
                    "text-white text-xs font-bold",
                    isDark ? "text-white" : "text-[#0A0C11]"
                  )}
                >
                  +2
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export const QuickStats: React.FC = () => {
  const totalTasks = restaurantMockData.reduce(
    (sum, role) => sum + role.totalTasks,
    0
  );
  const totalPending = restaurantMockData.reduce(
    (sum, role) => sum + role.pendingTasks,
    0
  );
  const totalInProgress = restaurantMockData.reduce(
    (sum, role) =>
      sum + role.tasks.filter((task) => task.status === "in-progress").length,
    0
  );
  const totalCompleted = restaurantMockData.reduce(
    (sum, role) => sum + role.completedTasks,
    0
  );

  return (
    <View className="mb-6">
      {/* 2x2 Grid Layout */}
      <View className="flex-row">
        {/* First Row */}
        <View className="flex-1 gap-5">
          <View className="flex-row gap-5">
            <StatCard
              label="Total Task"
              value={totalTasks}
              icon={require("../../assets/icons/task.png")}
              isTotal={true}
            />
            <StatCard
              label="Pending Task"
              value={totalPending}
              icon={require("../../assets/icons/pending.png")}
            />
          </View>

          {/* Second Row */}
          <View className="flex-row gap-5">
            <StatCard
              label="Inprogress"
              value={totalInProgress}
              icon={require("../../assets/icons/in-progress.png")}
            />
            <StatCard
              label="Complete"
              value={totalCompleted}
              icon={require("../../assets/icons/completed.png")}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default QuickStats;
