import React from "react";
import { Image, View } from "react-native";

interface CoffeeIconProps {
  size?: number;
  className?: string;
}

export const CoffeeIcon: React.FC<CoffeeIconProps> = ({
  size = 80,
  className,
}) => {
  return (
    <View
      className={`items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        source={require("../../assets/icon.png")}
        resizeMode="contain"
        className="size-32"
      />
    </View>
  );
};

export default CoffeeIcon;
