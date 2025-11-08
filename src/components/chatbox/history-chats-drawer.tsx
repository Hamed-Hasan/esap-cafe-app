import {
    DrawerContent,
    DrawerContentComponentProps,
} from "@react-navigation/drawer";
import React from "react";
import { Text, View } from "react-native";

export default function HistoryChatDrawer(props: DrawerContentComponentProps) {
  return (
    <View>
      <Text>History Chat Drawer</Text>
      <DrawerContent {...props} />
    </View>
  );
}
