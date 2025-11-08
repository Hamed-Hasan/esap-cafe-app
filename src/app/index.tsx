import { Redirect } from 'expo-router';
import { useAuth } from '../lib/store/auth-store';
import { useEffect } from 'react';
import { View, ActivityIndicator, Platform, Text } from 'react-native';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('📍 Index page rendered - Auth state:', { isAuthenticated, isLoading, platform: Platform.OS });
  }, [isAuthenticated, isLoading]);

  // On web, never show loading - just redirect
  if (Platform.OS === 'web') {
    console.log('🌐 Web platform - Redirecting immediately');
    if (isAuthenticated) {
      return <Redirect href="/(tabs)" />;
    }
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Show loading state while checking authentication (mobile only)
  if (isLoading) {
    console.log('⏳ Showing loading state');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5DC' }}>
        <ActivityIndicator size="large" color="#6B4423" />
        <Text style={{ marginTop: 16, color: '#6B4423' }}>Loading...</Text>
      </View>
    );
  }

  // Redirect to appropriate screen based on auth status
  console.log('🔄 Redirecting based on auth:', isAuthenticated ? 'tabs' : 'sign-in');
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
