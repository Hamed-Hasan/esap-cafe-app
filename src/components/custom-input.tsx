import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface CustomInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  className?: string;
  error?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  className = "",
  error,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className={`mb-4 ${className}`}>
      <Text className="text-accent dark:text-accent-dark text-sm font-medium mb-2">{label}</Text>
      <View
        className={`relative bg-bg-drawer-light dark:bg-bg-drawer-dark rounded-xl px-4 py-3 border ${
          error ? "border-red-500" : isFocused ? "border-accent dark:border-accent-dark" : "border-border-light dark:border-border-dark"
        }`}
      >
        <TextInput
          className="text-text-primary dark:text-text-primary-dark text-base flex-1 h-12"
          placeholder={placeholder}
          placeholderTextColor="#989898" // text-muted (will be handled by theme system)
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          // Disable iOS automatic password suggestions
          passwordRules={secureTextEntry ? "" : undefined}
          textContentType={secureTextEntry ? "none" : "none"}
          autoComplete={secureTextEntry ? "off" : "off"}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
          >
            <Text className="text-text-muted dark:text-text-muted-dark text-base">
              {isPasswordVisible ? "👁️" : "🙈"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
};

export default CustomInput;
