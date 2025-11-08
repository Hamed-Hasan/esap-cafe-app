import MessageIcon from "../../components/icons/message";
import PasswordIcon from "../../components/icons/password";
import { useLoginMutation } from "../../lib/hooks/use-auth-mutations";
import { LoginFormData, loginSchema } from "../../lib/schemas/auth-schemas";
import { useAuth } from "../../lib/store/auth-store";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function SignIn() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLoginMutation();

  // Redirect authenticated users to home
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading]);

  const handleInputChange = (field: keyof LoginFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      if (error.issues) {
        error.issues.forEach((issue: any) => {
          if (issue.path?.length > 0) {
            fieldErrors[issue.path[0] as keyof LoginFormData] = issue.message;
          }
        });
      }
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors and try again.");
      return;
    }

    loginMutation.mutate(formData);
  };

  const handleCreateAccount = () => {
    router.push("/(auth)/sign-up");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ImageBackground
        source={require("../../assets/bg-sign-in.png")}
        className="flex-1 bg-bg-light dark:bg-bg-dark"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1">
          <View className="flex-1 justify-end">
            {/* Header copy over coffee image */}
            <View className="flex-col justify-center items-center mt-16 mb-8">
              <Text className="text-text-primary dark:text-text-primary-dark text-[26px] font-open-sauce-two-semibold">
                Hello
              </Text>
              <Text className="text-text-primary dark:text-text-primary-dark text-[26px] font-open-sauce-two-semibold">
                Welcome back
              </Text>
            </View>
          </View>
        </SafeAreaView>
        {/* Card positioned at bottom */}
        <BlurView
          intensity={isDark ? 24 : 12}
          tint="dark"
          style={{
            flex: 1,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: isDark ? "#414548" : "rgba(255, 255, 255, 0.7)",
            overflow: "hidden",
            minHeight: 200,
          }}
        >
          <LinearGradient
            colors={
              isDark
                ? ["rgba(63, 67, 70, 0.3)", "rgba(76, 81, 85, 0.3)"]
                : ["rgba(255, 255, 255, 0.7)", "rgba(255, 255, 255, 1)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0.5558, 0.9752]}
            style={{
              flex: 1,
              paddingHorizontal: 12,
              paddingVertical: 16,
            }}
          >
            <View className="py-6 px-4 mb-4 border-b border-black/[3%] dark:border-white/[3%]">
              <Text className="font-open-sauce-two-semibold text-text-primary dark:text-text-primary-dark text-lg font-semibold text-center mb-2">
                Login account
              </Text>

              <View className="flex-row items-center justify-center">
                <Text className="text-text-muted dark:text-white/[48%] text-sm mr-1">
                  Haven&apos;t an account?
                </Text>
                <TouchableOpacity
                  onPress={handleCreateAccount}
                  activeOpacity={0.8}
                >
                  <Text className="text-warning text-sm font-bold">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="py-4 px-4">
              {/* Email */}
              <View className="bg-[#ededed] dark:bg-[#F2F2F4]/5 rounded-full px-4 h-14 flex-row justify-center items-center mb-4">
                <MessageIcon
                  width={16}
                  height={16}
                  fill="#9CA3AF"
                  fillOpacity={1}
                />
                <TextInput
                  value={formData.email}
                  onChangeText={handleInputChange("email")}
                  placeholder="youremail@domain.com"
                  placeholderTextColor="#8C929C"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="ml-3 flex-1 leading-5 text-base text-text-primary dark:text-text-primary-dark"
                />
              </View>
              {errors.email ? (
                <Text className="text-red-500 text-sm -mt-2 mb-2">
                  {errors.email}
                </Text>
              ) : null}

              {/* Password */}
              <View className="bg-[#ededed] dark:bg-[#F2F2F4]/5 rounded-full px-4 h-14 flex-row justify-center items-center">
                <PasswordIcon
                  width={16}
                  height={16}
                  fill="#9CA3AF"
                  fillOpacity={1}
                />
                <TextInput
                  value={formData.password}
                  onChangeText={handleInputChange("password")}
                  placeholder="************"
                  placeholderTextColor="#8C929C"
                  secureTextEntry={!showPassword}
                  className="ml-3 flex-1 text-base text-text-primary dark:text-text-primary-dark"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((s) => !s)}
                  activeOpacity={0.8}
                >
                  <FontAwesome5
                    name={showPassword ? "eye" : "eye-slash"}
                    size={16}
                    color="#8C929C"
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text className="text-red-500 text-sm mt-2">
                  {errors.password}
                </Text>
              ) : null}
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loginMutation.isPending}
              // activeOpacity={0.9}
              className="mt-6 rounded-full bg-warning/15 flex-col justify-center items-center h-14 mx-4"
            >
              {loginMutation.isPending ? (
                <ActivityIndicator size="small" color="#F4B85A" />
              ) : (
                <Text className="text-warning text-base font-open-sauce-two-medium w-full text-center">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </BlurView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
