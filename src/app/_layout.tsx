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

  console.log('🎨 Root Layout rendering - Platform:', Platform.OS);

  const [fontsLoaded, error] = useFonts({
    "OpenSauceTwo-bold": require("../assets/fonts/open-sauce-two-bold.ttf"),
    "OpenSauceTwo-medium": require("../assets/fonts/open-sauce-two-medium.ttf"),
    "OpenSauceTwo-semibold": require("../assets/fonts/open-sauce-two-semibold.ttf"),
  });

  useEffect(() => {
    console.log('📊 Font loading state:', { fontsLoaded, error: !!error, appIsReady });
  }, [fontsLoaded, error, appIsReady]);

  useEffect(() => {
    if (error) {
      console.error('❌ Error loading fonts:', error);
      // On web, continue even if fonts fail to load
      if (Platform.OS === 'web') {
        console.log('🌐 Web platform - continuing despite font error');
        setAppIsReady(true);
      }
    }
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      console.log('✅ Fonts loaded successfully');
      setAppIsReady(true);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // Fallback timeout for web: if fonts don't load within 2 seconds, show app anyway
    if (Platform.OS === 'web') {
      console.log('⏱️  Setting 2s timeout for web...');
      const timeout = setTimeout(() => {
        console.log('⏰ Web timeout triggered after 2s, forcing app ready');
        setAppIsReady(true);
      }, 2000);
      return () => {
        console.log('🧹 Clearing timeout');
        clearTimeout(timeout);
      };
    }
  }, []);

  useEffect(() => {
    if (appIsReady) {
      console.log('🚀 App is ready! Hiding splash screen...');
      SplashScreen.hideAsync().catch((err) => {
        // Ignore errors on web where splash screen might not exist
        console.log('⚠️  Splash screen error (expected on web):', err?.message || 'unknown');
      });
    }
  }, [appIsReady]);

  // Don't render anything until app is ready
  if (!appIsReady) {
    console.log('⏳ App not ready yet, returning null');
    return null;
  }

  console.log('✨ Rendering app content!');

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
