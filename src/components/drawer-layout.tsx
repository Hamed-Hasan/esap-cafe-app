import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Drawer } from "expo-router/drawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React from "react";

export interface DrawerItem {
  name: string;
  title: string;
  icon: string;
  hidden?: boolean;
}

export interface DrawerLayoutProps {
  children?: React.ReactNode;
  drawerItems?: DrawerItem[];
  screenOptions?: any;
  drawerContent?: (props: DrawerContentComponentProps) => React.ReactNode;
}

const defaultDrawerItems: DrawerItem[] = [
  {
    name: "(tabs)",
    title: "Home",
    icon: "home",
  },
  {
    name: "(auth)",
    title: "Auth",
    icon: "user",
    hidden: true,
  },
];

const defaultScreenOptions = {
  headerTitle: "Hello",
  headerStyle: { 
    backgroundColor: "#000000", // bg-drawer-dark
    height: 60, // Fixed header height to prevent SafeAreaView conflicts
  },
  headerTitleStyle: {
    color: "#FFFFFF", // text-primary-dark
    fontSize: 18,
    fontWeight: "600",
  },
  headerTintColor: "#FFFFFF", // text-primary-dark
  drawerInactiveTintColor: "#FFFFFF", // text-primary-dark
  drawerActiveTintColor: "#4EBD7C", // status-active
  drawerStyle: {
    backgroundColor: "#000000", // bg-drawer-dark
    borderRightColor: "#808080", // border-drawer-dark
    borderRightWidth: 1,
  },
  // Prevent SafeAreaView double padding
  headerStatusBarHeight: 0,
  headerTransparent: false,
};

export const DrawerLayout: React.FC<DrawerLayoutProps> = ({
  children,
  drawerItems = defaultDrawerItems,
  screenOptions = defaultScreenOptions,
  drawerContent,
}) => {
  return (
    <Drawer 
      screenOptions={screenOptions}
      drawerContent={drawerContent}
    >
      {drawerItems.map((item) => (
        <Drawer.Screen
          key={item.name}
          name={item.name}
          options={{
            title: item.title,
            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name={item.icon} size={size || 24} color={color} />
            ),
            drawerItemStyle: item.hidden ? { display: "none" } : undefined,
          }}
        />
      ))}
      {children}
    </Drawer>
  );
};

export default DrawerLayout;