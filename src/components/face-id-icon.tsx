import React from 'react';
import { View, Text } from 'react-native';

interface FaceIdIconProps {
  size?: number;
  className?: string;
}

export const FaceIdIcon: React.FC<FaceIdIconProps> = ({ size = 24, className }) => {
  return (
    <View className={`items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <View className="border-2 border-primary rounded-lg" style={{ width: size * 0.8, height: size * 0.8 }}>
        {/* Corner brackets */}
        <View className="absolute -top-1 -left-1">
          <View className="w-2 h-2 border-l-2 border-t-2 border-primary rounded-tl" />
        </View>
        <View className="absolute -top-1 -right-1">
          <View className="w-2 h-2 border-r-2 border-t-2 border-primary rounded-tr" />
        </View>
        <View className="absolute -bottom-1 -left-1">
          <View className="w-2 h-2 border-l-2 border-b-2 border-primary rounded-bl" />
        </View>
        <View className="absolute -bottom-1 -right-1">
          <View className="w-2 h-2 border-r-2 border-b-2 border-primary rounded-br" />
        </View>
        
        {/* Face elements */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-primary text-xs">😊</Text>
        </View>
      </View>
    </View>
  );
};

export default FaceIdIcon;