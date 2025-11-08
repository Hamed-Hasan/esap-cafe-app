import { Redirect } from 'expo-router';
import { useAuth } from '../lib/store/auth-store';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5DC' }}>
        <ActivityIndicator size="large" color="#6B4423" />
      </View>
    );
  }

  // Redirect to appropriate screen based on auth status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
