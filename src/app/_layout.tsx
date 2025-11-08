import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalProvider } from "../lib/providers/global-provider";
import "./global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

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
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, error] = useFonts({
    "OpenSauceTwo-bold": require("../assets/fonts/open-sauce-two-bold.ttf"),
    "OpenSauceTwo-medium": require("../assets/fonts/open-sauce-two-medium.ttf"),
    "OpenSauceTwo-semibold": require("../assets/fonts/open-sauce-two-semibold.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error('Error loading fonts:', error);
      // On web, continue even if fonts fail to load
      if (Platform.OS === 'web') {
        setAppIsReady(true);
      }
    }
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      setAppIsReady(true);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // Fallback timeout for web: if fonts don't load within 2 seconds, show app anyway
    if (Platform.OS === 'web') {
      const timeout = setTimeout(() => {
        console.log('Web timeout triggered, setting app ready');
        setAppIsReady(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync().catch(() => {
        // Ignore errors on web where splash screen might not exist
        console.log('Splash screen already hidden or not available');
      });
    }
  }, [appIsReady]);

  // Don't render anything until app is ready
  if (!appIsReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <StatusBar style={isDark ? "light" : "dark"} backgroundColor="transparent" translucent />
        <GestureHandlerRootView
          className="flex-1"
          style={{ flex: 1 }}
        >
          <Slot />
        </GestureHandlerRootView>
      </GlobalProvider>
    </QueryClientProvider>
  );
}
