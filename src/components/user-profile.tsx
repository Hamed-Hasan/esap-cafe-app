import { useAuth } from "../lib/store/auth-store";
import { useCurrentUserEmployee } from "../lib/hooks/use-employee-queries";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { CustomButton } from "./custom-button";

interface UserProfileProps {
  className?: string;
}

export const UserProfile = ({ className }: UserProfileProps) => {
  const { user, isLoading, error } = useAuth();
  const {
    data: employeeData,
    error: employeeError,
    isLoading: employeeLoading,
  } = useCurrentUserEmployee();
  const employee = employeeData?.employee;
  const isEmployeeAvailable = !!employee?.id;
  const isDark = useColorScheme() === "dark";

  if (isLoading) {
    return (
      <View className={`flex-1 justify-center items-center ${className || ""}`}>
        <ActivityIndicator
          size="large"
          color={isDark ? "#D5BBA2" : "#482C20"}
        />
        <Text className="text-text-muted dark:text-text-muted-dark mt-2">
          Loading user profile...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        className={`flex-1 justify-center items-center p-4 ${className || ""}`}
      >
        <Text className="text-red-500 text-center mb-4">
          Failed to load user profile
        </Text>
        <CustomButton title="Retry" onPress={() => {}} variant="primary" />
      </View>
    );
  }

  // Check if user data is available
  if (!user) {
    return (
      <View
        className={`flex-1 justify-center items-center p-4 ${className || ""}`}
      >
        <Text className="text-text-muted dark:text-text-muted-dark text-center">
          No user data available
        </Text>
      </View>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const userIconColor = isDark ? "#989898" : "#A67C52";
  const editIconColor = isDark ? "#FFFFFF" : "#A67C52";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className={`flex-1 ${className || ""}`}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* User Avatar Section */}
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

      {/* Basic Information Section */}
      <View className="flex flex-col mt-10">
        <ProfileInfoItem
          icon="user"
          label="Full Name"
          value={user.full_name}
          isDark={isDark}
        />
        <ProfileInfoItem
          icon="at"
          label="Username"
          value={user.username}
          isDark={isDark}
        />
        <ProfileInfoItem
          icon="envelope"
          label="Email"
          value={user.email}
          isDark={isDark}
        />
        <ProfileInfoItem
          icon="phone"
          label="Phone"
          value={user.phone}
          isDark={isDark}
        />
        <ProfileInfoItem
          icon="map-marker-alt"
          label="Address"
          value={user.address}
          isDark={isDark}
        />
      </View>

      {/* Employee Information Section */}
      {isEmployeeAvailable && employee && (
        <View className="flex flex-col mt-5 border-t pt-5 border-border-light dark:border-border-dark">
          <Text className="text-lg font-rubik-semibold mb-3 text-text-primary dark:text-text-primary-dark">
            Employee Information
          </Text>
          <ProfileInfoItem
            icon="id-badge"
            label="Employee ID"
            value={employee.employee_id || "N/A"}
            isDark={isDark}
          />
          <ProfileInfoItem
            icon="briefcase"
            label="Position"
            value={employee.position || "N/A"}
            isDark={isDark}
          />
          <ProfileInfoItem
            icon="building"
            label="Department"
            value={employee.department?.name || "N/A"}
            isDark={isDark}
          />
          <ProfileInfoItem
            icon="map-marker-alt"
            label="Branch Location"
            value={employee.location?.name || "N/A"}
            isDark={isDark}
          />
          <ProfileInfoItem
            icon="calendar-alt"
            label="Hire Date"
            value={
              employee.hire_date
                ? new Date(employee.hire_date).toLocaleDateString()
                : "N/A"
            }
            isDark={isDark}
          />
          <StatusItem
            icon="user-check"
            label="Employee Status"
            value={employee.is_active ? "Active" : "Inactive"}
            isActive={employee.is_active}
            isDark={isDark}
          />
        </View>
      )}

      {/* Employee Loading Section */}
      {employeeLoading && (
        <View className="flex flex-col mt-5 border-t pt-5 border-border-light dark:border-border-dark">
          <Text className="text-lg font-rubik-semibold mb-3 text-text-primary dark:text-text-primary-dark">
            Employee Information
          </Text>
          <View className="flex-row items-center justify-center p-4">
            <ActivityIndicator
              size="small"
              color={isDark ? "#D5BBA2" : "#482C20"}
            />
            <Text className="text-text-muted dark:text-text-muted-dark ml-2">
              Loading employee information...
            </Text>
          </View>
        </View>
      )}

      {/* Employee Error Section */}
      {!employeeLoading && !isEmployeeAvailable && employeeError && (
        <View className="flex flex-col mt-5 border-t pt-5 border-border-light dark:border-border-dark">
          <Text className="text-lg font-rubik-semibold mb-3 text-text-primary dark:text-text-primary-dark">
            Employee Information
          </Text>
          <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <Text className="text-red-600 dark:text-red-400 text-center">
              {employeeError?.message || "Unable to load employee information"}
            </Text>
          </View>
        </View>
      )}

      {/* Account Status Section */}
      <View className="flex flex-col mt-5 border-t pt-5 border-border-light dark:border-border-dark">
        <StatusItem
          icon="check-circle"
          label="Active"
          value={user.is_active ? "Yes" : "No"}
          isActive={user.is_active}
          isDark={isDark}
        />
        <StatusItem
          icon="shield-alt"
          label="Verified"
          value={user.is_verified ? "Yes" : "No"}
          isActive={user.is_verified}
          isDark={isDark}
        />
        <StatusItem
          icon="crown"
          label="Superuser"
          value={user.is_superuser ? "Yes" : "No"}
          isActive={user.is_superuser}
          isDark={isDark}
          isSpecial={true}
        />
      </View>

      {/* Account History Section */}
      <View className="flex flex-col mt-5 border-t pt-5 border-border-light dark:border-border-dark">
        <HistoryItem
          icon="calendar-plus"
          label="Created"
          value={formatDate(user.created_at)}
          isDark={isDark}
        />
        <HistoryItem
          icon="edit"
          label="Last Updated"
          value={formatDate(user.updated_at)}
          isDark={isDark}
        />
        <HistoryItem
          icon="sign-in-alt"
          label="Last Login"
          value={formatDate(user.last_login)}
          isDark={isDark}
        />
      </View>

      {/* Refresh Button */}
      <View className="mt-8">
        <CustomButton
          title="Refresh Profile"
          onPress={() => {
            // Note: useAuth doesn't have a refetch method
            // This would need to be implemented if profile refresh is needed
          }}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
};

// Profile Info Item Component
interface ProfileInfoItemProps {
  icon: string;
  label: string;
  value: string;
  isDark: boolean;
}

const ProfileInfoItem = ({
  icon,
  label,
  value,
  isDark,
}: ProfileInfoItemProps) => {
  const iconColor = isDark ? "#FFFFFF" : "#A67C52";

  return (
    <View className="flex flex-row items-center justify-between py-3">
      <View className="flex flex-row items-center gap-3">
        <FontAwesome5 name={icon} size={20} color={iconColor} />
        <Text className="text-lg font-rubik-medium text-text-primary dark:text-text-primary-dark">
          {label}
        </Text>
      </View>
      <Text className="text-text-secondary dark:text-text-secondary-dark font-rubik-regular text-right flex-1 ml-2">
        {value || "Not provided"}
      </Text>
    </View>
  );
};

// Status Item Component
interface StatusItemProps {
  icon: string;
  label: string;
  value: string;
  isActive: boolean;
  isDark: boolean;
  isSpecial?: boolean;
}

const StatusItem = ({
  icon,
  label,
  value,
  isActive,
  isDark,
  isSpecial,
}: StatusItemProps) => {
  const iconColor = isDark ? "#FFFFFF" : "#A67C52";
  const getValueColor = () => {
    if (isSpecial) {
      return isActive
        ? "text-secondary dark:text-secondary-dark"
        : "text-text-muted dark:text-text-muted-dark";
    }
    return isActive
      ? "text-status-active dark:text-status-active-dark"
      : "text-red-600";
  };

  return (
    <View className="flex flex-row items-center justify-between py-3">
      <View className="flex flex-row items-center gap-3">
        <FontAwesome5 name={icon} size={20} color={iconColor} />
        <Text className="text-lg font-rubik-medium text-text-primary dark:text-text-primary-dark">
          {label}
        </Text>
      </View>
      <Text className={`font-rubik-medium ${getValueColor()}`}>{value}</Text>
    </View>
  );
};

// History Item Component
interface HistoryItemProps {
  icon: string;
  label: string;
  value: string;
  isDark: boolean;
}

const HistoryItem = ({ icon, label, value, isDark }: HistoryItemProps) => {
  const iconColor = isDark ? "#FFFFFF" : "#A67C52";

  return (
    <View className="flex flex-row items-center justify-between py-3">
      <View className="flex flex-row items-center gap-3">
        <FontAwesome5 name={icon} size={20} color={iconColor} />
        <Text className="text-lg font-rubik-medium text-text-primary dark:text-text-primary-dark">
          {label}
        </Text>
      </View>
      <Text className="text-text-secondary dark:text-text-secondary-dark font-rubik-regular text-right flex-1 ml-2">
        {value}
      </Text>
    </View>
  );
};

export default UserProfile;
