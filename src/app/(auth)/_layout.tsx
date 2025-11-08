import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../lib/providers/global-provider';

export default function AuthLayout() {
  const { loading, isLoggedIn } = useGlobalContext();

  if (loading) {
    return (
      <SafeAreaView className="bg-neutral-light dark:bg-neutral-dark h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary" size="large" />
      </SafeAreaView>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  return <Slot />;
}