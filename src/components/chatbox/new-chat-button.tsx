import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, useColorScheme } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useChat } from "../../lib/store/chat-store";

interface NewChatButtonProps {
  isDark: boolean;
}

export default function NewChatButton({ isDark }: NewChatButtonProps) {
  const router = useRouter();

  const { createNewChat, setCurrentChatId } = useChat();

  const handleNewChatPress = () => {
    // Create new chat and navigate
    const newChatId = createNewChat();
    setCurrentChatId(newChatId);
    router.push("/(tabs)/chat");
  };

  return (
    <TouchableOpacity
      onPress={handleNewChatPress}
      className={`flex-row items-center justify-center py-3 px-4 rounded-xl border-2 ${
        isDark
          ? "bg-secondary border-secondary"
          : "bg-secondary border-secondary"
      }`}
      style={{
        shadowColor: "#4EBD7C",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <FontAwesome5
        name="plus"
        size={18}
        color="#FFFFFF"
        style={{ marginRight: 8 }}
      />
      <Text className="text-white text-lg font-semibold">Start New Chat</Text>
    </TouchableOpacity>
  );
}
