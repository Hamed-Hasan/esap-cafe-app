import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { LocationData } from '../lib/services/location-gps-service';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  locationData: LocationData | null;
  loading: boolean;
  error: string | null;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
  locationData,
  loading,
  error,
}) => {
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#FFFFFF' : '#A67C52';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const subtextColor = isDark ? '#B0B0B0' : '#666666';

  const formatCoordinate = (value: number, type: 'lat' | 'lng'): string => {
    const direction = type === 'lat' ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W');
    return `${Math.abs(value).toFixed(6)}° ${direction}`;
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAccuracy = (accuracy: number | null): string => {
    if (accuracy === null) return 'N/A';
    return `±${accuracy.toFixed(1)}m`;
  };

  const formatSpeed = (speed: number | null): string => {
    if (speed === null) return 'N/A';
    return `${(speed * 3.6).toFixed(1)} km/h`; // Convert m/s to km/h
  };

  const formatAltitude = (altitude: number | null): string => {
    if (altitude === null) return 'N/A';
    return `${altitude.toFixed(1)}m`;
  };

  const formatHeading = (heading: number | null): string => {
    if (heading === null) return 'N/A';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(heading / 45) % 8;
    return `${heading.toFixed(1)}° (${directions[index]})`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-bg-light dark:bg-bg-dark">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
          <Text className="text-xl font-rubik-bold text-text-primary dark:text-text-primary-dark">
            Current Location
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 rounded-full bg-border-light dark:bg-border-dark"
          >
            <FontAwesome5 name="times" size={16} color={iconColor} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {loading && (
            <View className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" color={iconColor} />
              <Text className="mt-4 text-lg font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                Getting your location...
              </Text>
            </View>
          )}

          {error && (
            <View className="flex-1 justify-center items-center py-20">
              <FontAwesome5 name="exclamation-triangle" size={48} color="#EF4444" />
              <Text className="mt-4 text-lg font-rubik-bold text-red-500 text-center">
                Location Error
              </Text>
              <Text className="mt-2 text-base font-rubik-regular text-text-secondary dark:text-text-secondary-dark text-center px-4">
                {error}
              </Text>
            </View>
          )}

          {locationData && !loading && !error && (
            <View className="gap-y-4">
              {/* Main Coordinates */}
              <View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <View className="flex-row items-center mb-3">
                  <FontAwesome5 name="map-marker-alt" size={20} color={iconColor} />
                  <Text className="ml-3 text-lg font-rubik-bold text-text-primary dark:text-text-primary-dark">
                    Coordinates
                  </Text>
                </View>
                
                <View className="gap-y-2">
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Latitude:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                      {formatCoordinate(locationData.latitude, 'lat')}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Longitude:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                      {formatCoordinate(locationData.longitude, 'lng')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Address */}
              {locationData.address && (
                <View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <View className="flex-row items-center mb-3">
                    <FontAwesome5 name="home" size={20} color={iconColor} />
                    <Text className="ml-3 text-lg font-rubik-bold text-text-primary dark:text-text-primary-dark">
                      Address
                    </Text>
                  </View>
                  <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                    {locationData.address}
                  </Text>
                </View>
              )}

              {/* Location Details */}
              <View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <View className="flex-row items-center mb-3">
                  <FontAwesome5 name="info-circle" size={20} color={iconColor} />
                  <Text className="ml-3 text-lg font-rubik-bold text-text-primary dark:text-text-primary-dark">
                    Location Details
                  </Text>
                </View>
                
                <View className="gap-y-2">
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Accuracy:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                      {formatAccuracy(locationData.accuracy)}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Altitude:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                      {formatAltitude(locationData.altitude)}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Speed:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                      {formatSpeed(locationData.speed)}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Heading:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                      {formatHeading(locationData.heading)}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Timestamp:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                      {formatTimestamp(locationData.timestamp)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Device Information */}
              {locationData.deviceInfo && (
                <View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <View className="flex-row items-center mb-3">
                    <FontAwesome5 name="mobile-alt" size={20} color={iconColor} />
                    <Text className="ml-3 text-lg font-rubik-bold text-text-primary dark:text-text-primary-dark">
                      Device Information
                    </Text>
                  </View>
                  
                  <View className="gap-y-2">
                    <View className="flex-row justify-between">
                      <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                        Device:
                      </Text>
                      <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark flex-1 text-right">
                        {locationData.deviceInfo.deviceName || 'Unknown'}
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                        Brand:
                      </Text>
                      <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                        {locationData.deviceInfo.brand || 'Unknown'}
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                        Model:
                      </Text>
                      <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                        {locationData.deviceInfo.modelName || 'Unknown'}
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                        OS:
                      </Text>
                      <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                        {locationData.deviceInfo.osName} {locationData.deviceInfo.osVersion}
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                        Screen:
                      </Text>
                      <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                        {locationData.deviceInfo.screenDimensions.width}×{locationData.deviceInfo.screenDimensions.height}
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                        Session ID:
                      </Text>
                      <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark font-mono text-xs">
                        {locationData.deviceInfo.sessionId}
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                        Captured:
                      </Text>
                      <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                        {new Date(locationData.deviceInfo.captureTimestamp).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Raw Coordinates for Copy */}
              <View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <View className="flex-row items-center mb-3">
                  <FontAwesome5 name="copy" size={20} color={iconColor} />
                  <Text className="ml-3 text-lg font-rubik-bold text-text-primary dark:text-text-primary-dark">
                    Raw Coordinates
                  </Text>
                </View>
                
                <View className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                  <Text className="font-mono text-sm text-text-primary dark:text-text-primary-dark">
                    {locationData.latitude.toFixed(8)}, {locationData.longitude.toFixed(8)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View className="p-4 border-t border-border-light dark:border-border-dark">
          <TouchableOpacity
            onPress={onClose}
            className="bg-primary rounded-lg py-3 px-6 items-center"
          >
            <Text className="text-white font-rubik-bold text-lg">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};