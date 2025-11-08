import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function ChatInput({
  onSendMessage,
  placeholder = "Ask anything",
  disabled = false,
  className = "",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View
        className={`bg-primary dark:bg-primary-dark rounded-t-2xl ${className}`}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#989898" : "#A67C52"}
          multiline
          className="text-text-primary-dark pt-6 pb-2 px-4"
          value={message}
          onChangeText={setMessage}
          editable={!disabled}
          onSubmitEditing={handleSend}
        />
        <View className="flex-row items-center px-4 pb-4">
         <MaterialCommunityIcons 
           name="plus" 
           size={24} 
           color="white" 
         />
         {!!message ? (
           <TouchableOpacity onPress={handleSend} className="ml-auto">
             <MaterialCommunityIcons 
               name="arrow-up-circle" 
               size={30} 
               color="white" 
             />
           </TouchableOpacity>
         ) : (
           <View className="flex-row ml-auto bg-bg-drawer-light dark:bg-bg-drawer-light rounded-full p-2 items-center gap-1">
             <MaterialCommunityIcons 
               name="account-voice" 
               size={15} 
               color="black" 
             />
             <Text className="text-text-primary text-xs">Voice</Text>
           </View>
         )}
       </View>
      </View>
    </KeyboardAvoidingView>
  );
}
