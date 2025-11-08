import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import cn from "clsx";
import * as LocalAuthentication from "expo-local-authentication";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { LocationGPSService } from "../lib/services/location-gps-service";
import { EmployeeResponse } from "../lib/schemas/employee-schemas";

interface BiometricAuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  subtitle?: string;
  actionType: "check-in" | "check-out" | "location";
  employee?: EmployeeResponse | null;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  visible,
  onClose,
  onSuccess,
  title,
  subtitle,
  actionType,
  employee,
}) => {
  const isDark = useColorScheme() === "dark";
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStatus, setAuthStatus] = useState<
    "idle" | "checking-location" | "authenticating" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [biometricType, setBiometricType] = useState<string>("");
  const [locationCheckPassed, setLocationCheckPassed] = useState(false);

  const scaleAnim = new Animated.Value(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    if (visible) {
      checkBiometricSupport();
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      scaleAnim.setValue(0);
      setAuthStatus("idle");
      setErrorMessage("");
      setLocationCheckPassed(false);
    }
  }, [visible]);

  useEffect(() => {
    if (authStatus === "authenticating") {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (authStatus === "authenticating") {
            pulse();
          }
        });
      };
      pulse();
    } else {
      pulseAnim.setValue(1);
    }
  }, [authStatus]);

  const checkBiometricSupport = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware) {
        setErrorMessage(
          "Biometric authentication is not available on this device"
        );
        setAuthStatus("error");
        return;
      }

      if (!isEnrolled) {
        setErrorMessage("No biometric credentials are enrolled on this device");
        setAuthStatus("error");
        return;
      }

      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (
        supportedTypes.includes(
          LocalAuthentication.AuthenticationType.FINGERPRINT
        )
      ) {
        // iOS uses Touch ID, Android uses Fingerprint
        setBiometricType(Platform.OS === "ios" ? "Touch ID" : "Fingerprint");
      } else if (
        supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)
      ) {
        setBiometricType("Iris");
      } else {
        setBiometricType("Biometric");
      }
    } catch (error) {
      console.error("Error checking biometric support:", error);
      setErrorMessage("Failed to check biometric support");
      setAuthStatus("error");
    }
  };

  const validateLocation = async (): Promise<boolean> => {
    try {
      // Check if employee has location data
      if (!employee?.location?.latitude || !employee?.location?.longitude) {
        setErrorMessage(
          "Employee location not configured. Please contact your administrator."
        );
        return false;
      }

      // Check location permissions
      const hasPermission =
        await LocationGPSService.handleLocationPermissionFlow();
      if (!hasPermission) {
        setErrorMessage(
          "Location permission is required for attendance operations."
        );
        return false;
      }

      // Get current location
      const currentLocation = await LocationGPSService.getCurrentLocation();

      // Calculate distance between current location and employee's registered location
      const employeeLat = parseFloat(employee.location.latitude);
      const employeeLng = parseFloat(employee.location.longitude);
      const distanceKm = LocationGPSService.calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        employeeLat,
        employeeLng
      );

      // Convert to meters and check if within 100m
      const distanceMeters = distanceKm * 1000;
      console.log(
        `📍 Distance from registered location: ${distanceMeters.toFixed(2)}m`
      );

      if (distanceMeters > 100) {
        setErrorMessage(
          `You are ${distanceMeters.toFixed(
            0
          )}m away from your registered location. You must be within 100m to ${
            actionType === "check-in" ? "check in" : "check out"
          }.`
        );
        return false;
      }

      return true;
    } catch (error: any) {
      console.error("Location validation error:", error);
      setErrorMessage(
        error.message || "Failed to validate your location. Please try again."
      );
      return false;
    }
  };

  const handleBiometricAuth = async () => {
    try {
      setIsAuthenticating(true);
      setErrorMessage("");

      // For check-in/check-out, validate location first
      if (
        (actionType === "check-in" || actionType === "check-out") &&
        !locationCheckPassed
      ) {
        setAuthStatus("checking-location");

        const locationValid = await validateLocation();
        if (!locationValid) {
          setAuthStatus("error");
          setIsAuthenticating(false);
          return;
        }

        setLocationCheckPassed(true);
      }

      setAuthStatus("authenticating");

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Use ${biometricType} to ${
          actionType === "check-in" ? "check in" : "check out"
        }`,
        fallbackLabel: "Use Passcode",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        console.log(
          "🔐 Biometric authentication successful for action:",
          actionType
        );
        setAuthStatus("success");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      } else {
        // Handle authentication failure
        if (result.success === false) {
          console.log("Authentication error:", result.error);
          setErrorMessage("Authentication failed. Please try again.");
          setAuthStatus("error");
        } else {
          // User cancelled or other reason
          setAuthStatus("idle");
          setLocationCheckPassed(false); // Reset location check on cancel
        }
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      setErrorMessage("An unexpected error occurred");
      setAuthStatus("error");
      setLocationCheckPassed(false); // Reset location check on error
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getBiometricIcon = () => {
    if (biometricType === "Touch ID" || biometricType === "Fingerprint")
      return "fingerprint";
    return "shield-alt";
  };

  const getStatusIcon = () => {
    switch (authStatus) {
      case "success":
        return "check-circle";
      case "error":
        return "exclamation-circle";
      default:
        return getBiometricIcon();
    }
  };

  const getStatusColor = () => {
    switch (authStatus) {
      case "success":
        return isDark ? "#4EBD7C" : "#4EBD7C"; // accent color
      case "error":
        return "#EF4444";
      case "authenticating":
        return isDark ? "#A67C52" : "#482C20"; // secondary and primary colors
      default:
        return isDark ? "#FFFFFF" : "#A67C52"; // secondary color
    }
  };

  const getActionIcon = () => {
    return actionType === "check-in" ? "clock" : "clock";
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }] }}
          className={cn(
            "bg-bg-drawer-light dark:bg-bg-drawer-dark rounded-3xl p-8 w-full max-w-sm",
            "shadow-2xl border border-border-light dark:border-border-dark"
          )}
        >
          {/* Header */}
          <View className="items-center mb-6">
            <View className="flex-row items-center mb-4">
              <FontAwesome5
                name={getActionIcon()}
                size={24}
                color={isDark ? "#FFFFFF" : "#A67C52"}
                style={{ marginRight: 8 }}
              />
              <Text className="text-xl font-rubik-bold text-text-primary dark:text-text-primary-dark">
                {title}
              </Text>
            </View>
            {subtitle && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 text-center font-rubik-regular">
                {subtitle}
              </Text>
            )}
          </View>

          {/* Biometric Icon */}
          <View className="items-center mb-8">
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
              }}
              className={cn(
                "w-24 h-24 rounded-full items-center justify-center",
                authStatus === "success"
                  ? "bg-accent/20 dark:bg-accent-dark/30"
                  : authStatus === "error"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : authStatus === "authenticating" ||
                    authStatus === "checking-location"
                  ? "bg-primary/20 dark:bg-secondary/30"
                  : "bg-bg-light dark:bg-bg-dark"
              )}
            >
              <FontAwesome5
                name={getStatusIcon()}
                size={40}
                color={getStatusColor()}
              />
            </Animated.View>
          </View>

          {/* Status Text */}
          <View className="items-center mb-8">
            {authStatus === "idle" && (
              <Text className="text-base text-text-secondary dark:text-text-secondary-dark text-center font-rubik-medium">
                {biometricType
                  ? `Use ${biometricType} to authenticate`
                  : "Preparing authentication..."}
              </Text>
            )}
            {authStatus === "checking-location" && (
              <Text className="text-base text-primary dark:text-secondary text-center font-rubik-medium">
                Checking your location...
              </Text>
            )}
            {authStatus === "authenticating" && (
              <Text className="text-base text-primary dark:text-secondary text-center font-rubik-medium">
                Authenticating...
              </Text>
            )}
            {authStatus === "success" && (
              <Text className="text-base text-accent dark:text-accent-dark text-center font-rubik-medium">
                Authentication successful!
              </Text>
            )}
            {authStatus === "error" && (
              <Text className="text-base text-red-600 dark:text-red-400 text-center font-rubik-medium">
                {errorMessage}
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          <View className="gap-y-3">
            {authStatus === "idle" && biometricType && (
              <TouchableOpacity
                onPress={handleBiometricAuth}
                disabled={isAuthenticating}
                className={cn(
                  "bg-primary dark:bg-secondary py-4 rounded-xl",
                  "shadow-lg active:scale-95"
                )}
              >
                <Text className="text-white text-center font-rubik-semibold text-base">
                  Authenticate with {biometricType}
                </Text>
              </TouchableOpacity>
            )}

            {authStatus === "error" && (
              <TouchableOpacity
                onPress={handleBiometricAuth}
                className="bg-primary dark:bg-secondary py-4 rounded-xl shadow-lg active:scale-95"
              >
                <Text className="text-white text-center font-rubik-semibold text-base">
                  Try Again
                </Text>
              </TouchableOpacity>
            )}

            {authStatus !== "success" && authStatus !== "authenticating" && (
              <TouchableOpacity
                onPress={onClose}
                className="bg-bg-light dark:bg-bg-dark py-4 rounded-xl active:scale-95"
              >
                <Text className="text-text-secondary dark:text-text-secondary-dark text-center font-rubik-medium text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
