import React from "react";
import {
    View,
    useColorScheme
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

interface GradientCardProps {
  children: React.ReactNode;
}

export default function GradientCard({ children }: GradientCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
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
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        {children}
      </LinearGradient>
    </View>
  );
}
