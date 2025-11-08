import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import cn from "clsx";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  icon: string;
  isDark: boolean;
  showAction?: boolean;
  actionIcon?: string;
  onActionPress?: () => void;
  className?: string;
}

export default function SectionHeader({
  title,
  icon,
  isDark,
  showAction = false,
  actionIcon = "search",
  onActionPress,
  className,
}: SectionHeaderProps) {
  return (
    <View
      className={cn("flex-row items-center justify-between mb-4", className)}
    >
      <View className="flex-row items-center">
        <FontAwesome5
          name={icon}
          size={18}
          color={isDark ? "#4EBD7C" : "#4EBD7C"}
        />
        <Text
          className={`text-lg font-semibold ml-2 ${
            isDark ? "text-text-primary-dark" : "text-text-primary"
          }`}
        >
          {title}
        </Text>
      </View>
      {showAction && (
        <TouchableOpacity onPress={onActionPress}>
          <FontAwesome5
            name={actionIcon}
            size={16}
            color={isDark ? "#989898" : "#A67C52"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
