import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import {
  BranchLocation,
  calculateDistance,
  MAX_BRANCH_DISTANCE,
  SAMPLE_BRANCH_LOCATIONS
} from '../constants/branch-locations';
import { LocationData } from '../lib/services/location-gps-service';

interface BranchLocationModalProps {
  visible: boolean;
  onClose: () => void;
  locationData: LocationData | null;
  loading: boolean;
  error: string | null;
}

export const BranchLocationModal: React.FC<BranchLocationModalProps> = ({
  visible,
  onClose,
  locationData,
  loading,
  error,
}) => {
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#FFFFFF' : '#A67C52';
  const [selectedBranch, setSelectedBranch] = useState<BranchLocation | null>(null);
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [branchDistance, setBranchDistance] = useState<number | null>(null);
  const [isValidRange, setIsValidRange] = useState<boolean>(false);

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
    return `${(speed * 3.6).toFixed(1)} km/h`;
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

  const handleBranchSelect = (branch: BranchLocation) => {
    setSelectedBranch(branch);
    
    if (locationData) {
      const distance = calculateDistance(
        locationData.latitude,
        locationData.longitude,
        branch.latitude,
        branch.longitude
      );
      setBranchDistance(distance);
      setIsValidRange(distance <= MAX_BRANCH_DISTANCE);
      setShowLocationDetails(true);
    }
  };

  const handleBackToBranchSelection = () => {
    setShowLocationDetails(false);
    setSelectedBranch(null);
    setBranchDistance(null);
    setIsValidRange(false);
  };

  const handleClose = () => {
    setShowLocationDetails(false);
    setSelectedBranch(null);
    setBranchDistance(null);
    setIsValidRange(false);
    onClose();
  };

  const getBranchStatusColor = (distance: number) => {
    return distance <= MAX_BRANCH_DISTANCE ? '#10B981' : '#EF4444';
  };

  const getBranchStatusText = (distance: number) => {
    return distance <= MAX_BRANCH_DISTANCE ? 'Valid Range' : 'Out of Range';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-bg-light dark:bg-bg-dark">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
          <View className="flex-row items-center">
            {showLocationDetails && (
              <TouchableOpacity
                onPress={handleBackToBranchSelection}
                className="mr-3 p-2 rounded-full bg-border-light dark:bg-border-dark"
              >
                <FontAwesome5 name="arrow-left" size={16} color={iconColor} />
              </TouchableOpacity>
            )}
            <Text className="text-xl font-rubik-bold text-text-primary dark:text-text-primary-dark">
              {showLocationDetails ? 'Location Verification' : 'Select Branch'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleClose}
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

          {!loading && !error && !showLocationDetails && (
            <View className="gap-y-3">
              <Text className="text-lg font-rubik-bold text-text-primary dark:text-text-primary-dark mb-4">
                Choose a branch to verify your location:
              </Text>
              
              {SAMPLE_BRANCH_LOCATIONS.map((branch) => (
                <TouchableOpacity
                  key={branch.id}
                  onPress={() => handleBranchSelect(branch)}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-border-light dark:border-border-dark"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-rubik-bold text-text-primary dark:text-text-primary-dark">
                        {branch.name}
                      </Text>
                      <Text className="text-sm font-rubik-regular text-text-secondary dark:text-text-secondary-dark mt-1">
                        {branch.address}
                      </Text>
                      <View className="flex-row items-center mt-2">
                        <View 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: branch.isWithinRange ? '#10B981' : '#EF4444' }}
                        />
                        <Text 
                          className="text-sm font-rubik-medium"
                          style={{ color: branch.isWithinRange ? '#10B981' : '#EF4444' }}
                        >
                          {branch.isWithinRange ? 'Within Range' : 'Out of Range'}
                        </Text>
                      </View>
                    </View>
                    <FontAwesome5 name="chevron-right" size={16} color={iconColor} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {locationData && !loading && !error && showLocationDetails && selectedBranch && (
            <View className="gap-y-4 pb-10">
              {/* Branch Validation Status */}
              <View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <View className="flex-row items-center mb-3">
                  <FontAwesome5 
                    name={isValidRange ? "check-circle" : "times-circle"} 
                    size={20} 
                    color={getBranchStatusColor(branchDistance || 0)} 
                  />
                  <Text className="ml-3 text-lg font-rubik-bold text-text-primary dark:text-text-primary-dark">
                    Branch Verification
                  </Text>
                </View>
                
                <View className="gap-y-2">
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Selected Branch:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark flex-1 text-right">
                      {selectedBranch.name}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Distance:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                      {branchDistance ? `${branchDistance.toFixed(1)}m` : 'N/A'}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Status:
                    </Text>
                    <Text 
                      className="font-rubik-bold"
                      style={{ color: getBranchStatusColor(branchDistance || 0) }}
                    >
                      {getBranchStatusText(branchDistance || 0)}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Max Allowed:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                      {MAX_BRANCH_DISTANCE}m
                    </Text>
                  </View>
                </View>
                
                {!isValidRange && (
                  <View className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <Text className="text-red-600 dark:text-red-400 font-rubik-medium text-sm">
                      ⚠️ You are outside the valid range for this branch. Please move closer to the selected branch location.
                    </Text>
                  </View>
                )}
              </View>

              {/* Current Location Coordinates */}
              <View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <View className="flex-row items-center mb-3">
                  <FontAwesome5 name="map-marker-alt" size={20} color={iconColor} />
                  <Text className="ml-3 text-lg font-rubik-bold text-text-primary dark:text-text-primary-dark">
                    Your Location
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
                  
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Accuracy:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                      {formatAccuracy(locationData.accuracy)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Branch Location Coordinates */}
              <View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <View className="flex-row items-center mb-3">
                  <FontAwesome5 name="building" size={20} color={iconColor} />
                  <Text className="ml-3 text-lg font-rubik-bold text-text-primary dark:text-text-primary-dark">
                    Branch Location
                  </Text>
                </View>
                
                <View className="gap-y-2">
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Latitude:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                      {formatCoordinate(selectedBranch.latitude, 'lat')}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Longitude:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                      {formatCoordinate(selectedBranch.longitude, 'lng')}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="font-rubik-medium text-text-secondary dark:text-text-secondary-dark">
                      Address:
                    </Text>
                    <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark flex-1 text-right">
                      {selectedBranch.address}
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
                      Current Address
                    </Text>
                  </View>
                  <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                    {locationData.address}
                  </Text>
                </View>
              )}

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
                        Timestamp:
                      </Text>
                      <Text className="font-rubik-regular text-text-primary dark:text-text-primary-dark">
                        {formatTimestamp(locationData.timestamp)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View className="p-4 border-t border-border-light dark:border-border-dark">
          <TouchableOpacity
            onPress={handleClose}
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