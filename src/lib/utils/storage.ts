import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { StateStorage } from 'zustand/middleware';

// Web-compatible storage adapter
const webStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(name) || null;
      }
      return await AsyncStorage.getItem(name);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(name, value);
      } else {
        await AsyncStorage.setItem(name, value);
      }
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(name);
      } else {
        await AsyncStorage.removeItem(name);
      }
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  },
};

export default webStorage;
