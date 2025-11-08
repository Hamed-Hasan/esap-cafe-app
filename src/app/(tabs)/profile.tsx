import {
  AuthGuard,
  BiometricAuthModal,
  BranchLocationModal,
  UserProfile,
} from "../../components";
import { useAuth } from "../../lib/store/auth-store";
import {
  useQuickCheckInMutation,
  useQuickCheckOutMutation,
} from "../../lib/hooks/use-attendance-mutations";
import { useCurrentUserEmployee } from "../../lib/hooks/use-employee-queries";
import { AuthService } from "../../lib/services/auth-service";
import {
  LocationData,
  LocationGPSService,
} from "../../lib/services/location-gps-service";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import cn from "clsx";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

interface SettingsItemProp {
  icon: string;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
  iconColor?: string;
  arrowColor?: string;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
  iconColor,
  arrowColor,
}: SettingsItemProp) => {
  const isDark = useColorScheme() === "dark";
  const defaultIconColor = isDark ? "#FFFFFF" : "#A67C52";
  const defaultArrowColor = isDark ? "#FFFFFF" : "#989898";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-row items-center justify-between py-3"
    >
      <View className="flex flex-row items-center gap-3">
        <FontAwesome5
          name={icon}
          size={20}
          color={iconColor || defaultIconColor}
        />
        <Text
          className={cn(
            "text-lg font-rubik-medium text-text-primary dark:text-text-primary-dark",
            textStyle
          )}
        >
          {title}
        </Text>
      </View>

      {showArrow && (
        <FontAwesome5
          name="chevron-right"
          size={16}
          color={arrowColor || defaultArrowColor}
        />
      )}
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const {
    data: employeeData,
    error: employeeError,
    isLoading: employeeLoading,
  } = useCurrentUserEmployee();
  const employee = employeeData?.employee;
  const isDark = useColorScheme() === "dark";
  const bellIconColor = isDark ? "#FFFFFF" : "#A67C52";
  const userIconColor = isDark ? "#989898" : "#A67C52";
  const editIconColor = isDark ? "#FFFFFF" : "#A67C52";

  console.log("employee", JSON.stringify(employee?.location, null, 2));

  // Biometric modal state
  const [biometricModalVisible, setBiometricModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    "check-in" | "check-out" | "location"
  >("check-in");

  // Location modal state
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Profile modal state
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // Attendance mutations
  const checkInMutation = useQuickCheckInMutation();
  const checkOutMutation = useQuickCheckOutMutation();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout locally even if API call fails
      logout();
    }
  };

  const handleProfilePress = () => {
    setProfileModalVisible(true);
  };

  const handleCheckInPress = () => {
    if (employeeLoading) {
      Alert.alert("Please Wait", "Loading employee information...");
      return;
    }
    if (!employee?.id) {
      Alert.alert(
        "Error",
        employeeError?.message ||
          "Employee information not available. Please ensure you are registered as an employee."
      );
      return;
    }
    setCurrentAction("check-in");
    setBiometricModalVisible(true);
  };

  const handleCheckOutPress = () => {
    if (employeeLoading) {
      Alert.alert("Please Wait", "Loading employee information...");
      return;
    }
    if (!employee?.id) {
      Alert.alert(
        "Error",
        employeeError?.message ||
          "Employee information not available. Please ensure you are registered as an employee."
      );
      return;
    }
    setCurrentAction("check-out");
    setBiometricModalVisible(true);
  };

  const handleBiometricSuccess = () => {
    if (currentAction === "location") {
      handleLocationCapture();
      return;
    }

    if (!employee?.id) {
      Alert.alert(
        "Error",
        employeeError?.message ||
          "Employee information not available for attendance operations."
      );
      return;
    }

    if (currentAction === "check-in") {
      checkInMutation.mutate(employee.id);
    } else {
      checkOutMutation.mutate(employee.id);
    }
  };

  const handleModalClose = () => {
    setBiometricModalVisible(false);
  };

  const handleLocationPress = async () => {
    // First require biometric authentication
    setCurrentAction("location");
    setBiometricModalVisible(true);
  };

  const handleLocationCapture = async () => {
    setLocationModalVisible(true);
    setLocationLoading(true);
    setLocationError(null);
    setLocationData(null);

    try {
      // Check and request location permissions
      const hasPermission =
        await LocationGPSService.handleLocationPermissionFlow();

      if (!hasPermission) {
        setLocationError(
          "Location permission is required to get your current position."
        );
        setLocationLoading(false);
        return;
      }

      // Get current location with address and device info
      const location = await LocationGPSService.getCurrentLocationWithAddress();
      setLocationData(location);
      setLocationLoading(false);
    } catch (error: any) {
      console.error("Location error:", error);
      setLocationError(
        error.message ||
          "Failed to get your current location. Please try again."
      );
      setLocationLoading(false);
    }
  };

  const handleLocationModalClose = () => {
    setLocationModalVisible(false);
    setLocationData(null);
    setLocationError(null);
    setLocationLoading(false);
  };

  return (
    <AuthGuard>
      <SafeAreaView className="h-full bg-bg-light dark:bg-bg-dark">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-32 px-7"
        >
          <View className="flex flex-row items-center justify-between mt-5">
            <Text className="text-xl font-rubik-bold text-text-primary dark:text-text-primary-dark">
              Profile
            </Text>
            <FontAwesome5 name="bell" size={20} color={bellIconColor} />
          </View>

          <View className="flex flex-row justify-center mt-5">
            <View className="flex flex-col items-center relative mt-5">
              <View className="size-44 relative rounded-full bg-border-light dark:bg-border-dark flex items-center justify-center">
                <FontAwesome5 name="user" size={80} color={userIconColor} />
              </View>
              <TouchableOpacity className="absolute bottom-11 right-2">
                <FontAwesome5 name="edit" size={24} color={editIconColor} />
              </TouchableOpacity>

              <Text className="text-2xl font-rubik-bold mt-2 text-text-primary dark:text-text-primary-dark">
                {user?.full_name || "User"}
              </Text>
            </View>
          </View>

          <View className="flex flex-col mt-10">
            <SettingsItem
              icon="user"
              title="Profile"
              onPress={handleProfilePress}
            />
            <SettingsItem
              icon="clock"
              title="Check In"
              onPress={handleCheckInPress}
            />
            <SettingsItem
              icon="clock"
              title="Check Out"
              onPress={handleCheckOutPress}
            />
            <SettingsItem
              icon="map"
              title="Location"
              onPress={handleLocationPress}
            />
          </View>

          <View className="flex flex-col border-t mt-5 pt-5 border-border-light dark:border-border-dark">
            <SettingsItem
              icon="sign-out-alt"
              title="Logout"
              textStyle="text-red-500 dark:text-red-500 font-bold"
              arrowColor="#EF4444"
              showArrow={false}
              onPress={handleLogout}
            />
          </View>
        </ScrollView>

        {/* Biometric Authentication Modal */}
        <BiometricAuthModal
          visible={biometricModalVisible}
          onClose={handleModalClose}
          onSuccess={handleBiometricSuccess}
          title={
            currentAction === "check-in"
              ? "Check In"
              : currentAction === "check-out"
              ? "Check Out"
              : "Location Access"
          }
          subtitle={
            currentAction === "location"
              ? "Authenticate to access your location and device information"
              : `Authenticate to record your ${currentAction}`
          }
          actionType={currentAction}
          employee={employee}
        />

        {/* Branch Location Modal */}
        <BranchLocationModal
          visible={locationModalVisible}
          onClose={handleLocationModalClose}
          locationData={locationData}
          loading={locationLoading}
          error={locationError}
        />

        {/* Profile Modal */}
        <Modal
          visible={profileModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setProfileModalVisible(false)}
        >
          <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark">
            <View className="flex-row items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
              <Text className="text-xl font-rubik-bold text-text-primary dark:text-text-primary-dark">
                Profile Details
              </Text>
              <TouchableOpacity
                onPress={() => setProfileModalVisible(false)}
                className="p-2"
              >
                <FontAwesome5
                  name="times"
                  size={20}
                  color={isDark ? "#FFFFFF" : "#482C20"}
                />
              </TouchableOpacity>
            </View>
            <UserProfile className="flex-1 px-4" />
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </AuthGuard>
  );
}
