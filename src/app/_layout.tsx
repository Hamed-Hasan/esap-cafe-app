import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalProvider } from "../lib/providers/global-provider";
import "./global.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
    },
  },
});



export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

    const [fontsLoaded, error] = useFonts({
    "OpenSauceTwo-bold": require("../assets/fonts/open-sauce-two-bold.ttf"),
    "OpenSauceTwo-medium": require("../assets/fonts/open-sauce-two-medium.ttf"),
    "OpenSauceTwo-semibold": require("../assets/fonts/open-sauce-two-semibold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        {/* <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark font-open-sauce-two-medium" edges={["top"]}> */}
          <StatusBar style={isDark ? "light" : "dark"} backgroundColor="transparent" translucent />
          <GestureHandlerRootView className="flex-1">
            <Slot />
          </GestureHandlerRootView>
        {/* </SafeAreaView> */}
      </GlobalProvider>
    </QueryClientProvider>
  );
}
