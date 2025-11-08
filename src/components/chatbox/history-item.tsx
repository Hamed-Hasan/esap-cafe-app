import { ChatMessage } from "../../constants/constants";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HistoryItemProps {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
  category: string;
  icon: string;
  isDark: boolean;
  isActive?: boolean;
  messages?: ChatMessage[];
  onPress: (id: string) => void;
}

export default function HistoryItem({
  id,
  title,
  timestamp,
  preview,
  category,
  icon,
  isDark,
  isActive = false,
  messages,
  onPress,
}: HistoryItemProps) {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Menu: "#45B7D1",
      Reservations: "#96CEB4",
      Catering: "#FFEAA7",
      Delivery: "#4ECDC4",
      hours: "#FF6B6B",
    };
    return colors[category] || "#A67C52";
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      className={`p-4 rounded-xl mb-3 ${
        isActive
          ? isDark
            ? "bg-status-active/20 border-2 border-status-active"
            : "bg-status-active/10 border-2 border-status-active"
          : isDark
          ? "bg-primary-dark"
          : "bg-primary-light"
      }`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center mb-2">
            <View
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: getCategoryColor(category) }}
            />
            <Text
              className={`font-semibold text-base ${
                isDark ? "text-text-primary-dark" : "text-text-primary"
              }`}
            >
              {title}
            </Text>
          </View>

          <Text
            className={`text-sm mb-2 ${
              isDark ? "text-text-secondary-dark" : "text-text-secondary"
            }`}
          >
            {messages && messages.length > 0
              ? `${
                  messages[messages.length - 1].role === "user"
                    ? "You"
                    : "Assistant"
                }: ${messages[messages.length - 1].message.substring(0, 60)}${
                  messages[messages.length - 1].message.length > 60 ? "..." : ""
                }`
              : preview}
          </Text>

          <View className="flex-row items-center">
            <Text
              className={`text-xs px-2 py-1 rounded-full ${
                isDark
                  ? "bg-secondary-dark text-text-secondary-dark"
                  : "bg-secondary text-text-secondary"
              }`}
            >
              {category}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <FontAwesome5
            name={icon}
            size={16}
            color={isDark ? "#4EBD7C" : "#4EBD7C"}
          />
          <Text
            className={`text-xs mt-1 ${
              isDark ? "text-text-secondary-dark" : "text-text-secondary"
            }`}
          >
            {timestamp}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
