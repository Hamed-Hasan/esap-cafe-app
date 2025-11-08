import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { Alert, Platform, Dimensions } from 'react-native';
import Constants from 'expo-constants';

export interface DeviceInfo {
  deviceName: string | null;
  deviceType: Device.DeviceType | null;
  brand: string | null;
  manufacturer: string | null;
  modelName: string | null;
  modelId: string | null;
  designName: string | null;
  productName: string | null;
  deviceYearClass: number | null;
  totalMemory: number | null;
  supportedCpuArchitectures: string[] | null;
  osName: string;
  osVersion: string;
  osBuildId: string | null;
  osInternalBuildId: string | null;
  osBuildFingerprint: string | null;
  platformApiLevel: number | null;
  deviceId: string | null;
  sessionId: string;
  appVersion: string;
  screenDimensions: {
    width: number;
    height: number;
    scale: number;
  };
  captureTimestamp: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
  address?: string;
  deviceInfo: DeviceInfo;
}

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: Location.PermissionStatus;
}

export class LocationGPSService {
  /**
   * Collect comprehensive device information
   */
  static async getDeviceInfo(): Promise<DeviceInfo> {
    const { width, height, scale } = Dimensions.get('window');
    const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    return {
      deviceName: Device.deviceName,
      deviceType: Device.deviceType,
      brand: Device.brand,
      manufacturer: Device.manufacturer,
      modelName: Device.modelName,
      modelId: Device.modelId,
      designName: Device.designName,
      productName: Device.productName,
      deviceYearClass: Device.deviceYearClass,
      totalMemory: Device.totalMemory,
      supportedCpuArchitectures: Device.supportedCpuArchitectures,
      osName: Device.osName || Platform.OS,
      osVersion: Device.osVersion || Platform.Version.toString(),
      osBuildId: Device.osBuildId,
      osInternalBuildId: Device.osInternalBuildId,
      osBuildFingerprint: Device.osBuildFingerprint,
      platformApiLevel: Device.platformApiLevel,
      deviceId: Constants.sessionId,
      sessionId,
      appVersion: Constants.expoConfig?.version || '1.0.0',
      screenDimensions: {
        width,
        height,
        scale
      },
      captureTimestamp: new Date().toISOString()
    };
  }
  /**
   * Request location permissions from the user
   */
  static async requestLocationPermission(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      return {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain,
        status
      };
    } catch (error) {
      console.error('Error requesting location permission:', error);
      throw new Error('Failed to request location permission');
    }
  }

  /**
   * Check current location permission status
   */
  static async checkLocationPermission(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      
      return {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain,
        status
      };
    } catch (error) {
      console.error('Error checking location permission:', error);
      throw new Error('Failed to check location permission');
    }
  }

  /**
   * Get current GPS location
   */
  static async getCurrentLocation(): Promise<LocationData> {
    try {
      // Check if location services are enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        throw new Error('Location services are disabled. Please enable location services in your device settings.');
      }

      // Check permissions
      const permissionStatus = await this.checkLocationPermission();
      if (!permissionStatus.granted) {
        throw new Error('Location permission not granted');
      }

      // Get current position with high accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 1,
      });

      // Get device information
      const deviceInfo = await this.getDeviceInfo();

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude,
        altitudeAccuracy: location.coords.altitudeAccuracy,
        heading: location.coords.heading,
        speed: location.coords.speed,
        timestamp: location.timestamp,
        deviceInfo,
      };

      return locationData;
    } catch (error: any) {
      console.error('Error getting current location:', error);
      
      if (error.code === 'E_LOCATION_SERVICES_DISABLED') {
        throw new Error('Location services are disabled. Please enable them in your device settings.');
      }
      if (error.code === 'E_LOCATION_UNAVAILABLE') {
        throw new Error('Location is temporarily unavailable. Please try again.');
      }
      if (error.code === 'E_LOCATION_TIMEOUT') {
        throw new Error('Location request timed out. Please try again.');
      }
      
      throw new Error(error.message || 'Failed to get current location');
    }
  }

  /**
   * Get address from coordinates (reverse geocoding)
   */
  static async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string | null> {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        const addressParts = [
          address.name,
          address.street,
          address.city,
          address.region,
          address.country,
        ].filter(Boolean);
        
        return addressParts.join(', ');
      }
      
      return null;
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      return null;
    }
  }

  /**
   * Get current location with address
   */
  static async getCurrentLocationWithAddress(): Promise<LocationData> {
    try {
      const locationData = await this.getCurrentLocation();
      
      // Try to get address
      const address = await this.getAddressFromCoordinates(
        locationData.latitude,
        locationData.longitude
      );
      
      return {
        ...locationData,
        address: address || undefined,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle location permission flow with user feedback
   */
  static async handleLocationPermissionFlow(): Promise<boolean> {
    try {
      // First check current permission status
      const currentStatus = await this.checkLocationPermission();
      
      if (currentStatus.granted) {
        return true;
      }

      // If permission is not granted, request it
      if (currentStatus.canAskAgain) {
        const requestResult = await this.requestLocationPermission();
        
        if (requestResult.granted) {
          return true;
        } else {
          Alert.alert(
            'Location Permission Required',
            'This app needs location access to show your current position. Please grant location permission in the next dialog.',
            [{ text: 'OK' }]
          );
          return false;
        }
      } else {
        // Permission was denied and can't ask again
        Alert.alert(
          'Location Permission Denied',
          'Location access has been permanently denied. Please enable location permission in your device settings to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                // Note: Opening settings is platform-specific and might need additional setup
                console.log('Open device settings for location permission');
              },
            },
          ]
        );
        return false;
      }
    } catch (error) {
      console.error('Error in location permission flow:', error);
      Alert.alert(
        'Permission Error',
        'Failed to check location permissions. Please try again.',
        [{ text: 'OK' }]
      );
      return false;
    }
  }

  /**
   * Format coordinates for display
   */
  static formatCoordinates(latitude: number, longitude: number): string {
    const latDirection = latitude >= 0 ? 'N' : 'S';
    const lngDirection = longitude >= 0 ? 'E' : 'W';
    
    return `${Math.abs(latitude).toFixed(6)}°${latDirection}, ${Math.abs(longitude).toFixed(6)}°${lngDirection}`;
  }

  /**
   * Calculate distance between two coordinates (in kilometers)
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }


}