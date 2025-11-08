import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  RegisterFormData,
  registerSchema,
  useAuth,
  useRegisterMutation,
} from "../../lib";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import UserIcon from "../../components/icons/user";
import MessageIcon from "../../components/icons/message";
import PasswordIcon from "../../components/icons/password";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function SignUp() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    full_name: "",
    phone: "",
    address: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useRegisterMutation();

  // Redirect authenticated users to home
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading]);

  const handleInputChange =
    (field: keyof RegisterFormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validateForm = (): boolean => {
    console.log(formData);
    try {
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      if (error.issues) {
        error.issues.forEach((issue: any) => {
          if (issue.path?.length > 0) {
            fieldErrors[issue.path[0] as keyof RegisterFormData] =
              issue.message;
          }
        });
      }
      console.log(fieldErrors);
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors and try again.");
      return;
    }

    registerMutation.mutate(formData);
  };

  const handleSignIn = () => {
    router.push("/(auth)/sign-in");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ImageBackground
        source={require("../../assets/bg-signup.png")}
        className="flex-1 bg-bg-light dark:bg-bg-dark"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1">
          <View className="flex-1 justify-end">
            {/* Header copy over coffee image */}
            <View className="items-center mt-16 mb-8">
              <Text className="text-text-primary dark:text-text-primary-dark text-[26px] font-open-sauce-two-semibold">
                Hello,
              </Text>
              <Text className="text-text-primary dark:text-text-primary-dark text-[26px] font-open-sauce-two-semibold">
                Welcome digital space
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
            borderColor: isDark ? "#414548" : "#ffffff",
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
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View className="py-6 px-4 mb-4 border-b border-black/[3%] dark:border-white/[3%]">
                <Text className="font-open-sauce-two-semibold text-text-primary dark:text-text-primary-dark text-lg font-semibold text-center mb-2">
                  Create account
                </Text>

                <View className="flex-row items-center justify-center">
                  <Text className="text-text-muted dark:text-white/[48%] text-sm mr-1">
                    Already have an account?
                  </Text>
                  <TouchableOpacity onPress={handleSignIn} activeOpacity={0.8}>
                    <Text className="text-warning text-sm font-bold">
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="py-4 px-4">
                {/* Username */}
                <View className="bg-[#ededed] dark:bg-[#F2F2F4]/5 rounded-full px-4 h-14 flex-row justify-center items-center mb-4">
                  <UserIcon
                    width={16}
                    height={16}
                    fill="#8C929C"
                    fillOpacity={1}
                  />
                  <TextInput
                    value={formData.username}
                    onChangeText={handleInputChange("username")}
                    placeholder="Enter your username"
                    placeholderTextColor="#8C929C"
                    autoCapitalize="none"
                    className="ml-3 flex-1 leading-5 text-base text-text-primary dark:text-text-primary-dark"
                  />
                </View>
                {errors.username ? (
                  <Text className="text-red-500 text-sm -mt-2 mb-2">
                    {errors.username}
                  </Text>
                ) : null}

                {/* Full Name */}
                <View className="bg-[#ededed] dark:bg-[#F2F2F4]/5 rounded-full px-4 h-14 flex-row justify-center items-center mb-4">
                  <UserIcon
                    width={16}
                    height={16}
                    fill="#8C929C"
                    fillOpacity={1}
                  />
                  <TextInput
                    value={formData.full_name}
                    onChangeText={handleInputChange("full_name")}
                    placeholder="Enter your full name"
                    placeholderTextColor="#8C929C"
                    autoCapitalize="words"
                    className="ml-3 flex-1 leading-5 text-base text-text-primary dark:text-text-primary-dark"
                  />
                </View>
                {errors.full_name ? (
                  <Text className="text-red-500 text-sm -mt-2 mb-2">
                    {errors.full_name}
                  </Text>
                ) : null}

                {/* Email */}
                <View className="bg-[#ededed] dark:bg-[#F2F2F4]/5 rounded-full px-4 h-14 flex-row justify-center items-center mb-4">
                  <MessageIcon
                    width={16}
                    height={16}
                    fill="#8C929C"
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

                {/* Phone */}
                <View className="bg-[#ededed] dark:bg-[#F2F2F4]/5 rounded-full px-4 h-14 flex-row justify-center items-center mb-4">
                  <FontAwesome5 name="phone-alt" size={16} color="#8C929C" />
                  <TextInput
                    value={formData.phone}
                    onChangeText={handleInputChange("phone")}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#8C929C"
                    keyboardType="phone-pad"
                    className="ml-3 flex-1 leading-5 text-base text-text-primary dark:text-text-primary-dark"
                  />
                </View>
                {errors.phone ? (
                  <Text className="text-red-500 text-sm -mt-2 mb-2">
                    {errors.phone}
                  </Text>
                ) : null}

                {/* Address */}
                <View className="bg-[#ededed] dark:bg-[#F2F2F4]/5 rounded-full px-4 h-14 flex-row justify-center items-center mb-4">
                  <FontAwesome5
                    name="map-marker-alt"
                    size={16}
                    color="#8C929C"
                  />
                  <TextInput
                    value={formData.address}
                    onChangeText={handleInputChange("address")}
                    placeholder="Enter your address (min 5 characters)"
                    placeholderTextColor="#8C929C"
                    autoCapitalize="words"
                    className="ml-3 flex-1 leading-5 text-base text-text-primary dark:text-text-primary-dark"
                  />
                </View>
                {errors.address ? (
                  <Text className="text-red-500 text-sm -mt-2 mb-2">
                    {errors.address}
                  </Text>
                ) : null}

                {/* Password */}
                <View className="bg-[#ededed] dark:bg-[#F2F2F4]/5 rounded-full px-4 h-14 flex-row justify-center items-center mb-4">
                  <PasswordIcon
                    width={16}
                    height={16}
                    fill="#8C929C"
                    fillOpacity={1}
                  />
                  <TextInput
                    value={formData.password}
                    onChangeText={handleInputChange("password")}
                    placeholder="Enter your password"
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
                  <Text className="text-red-500 text-sm -mt-2 mb-2">
                    {errors.password}
                  </Text>
                ) : null}

                {/* Confirm Password */}
                <View className="bg-[#ededed] dark:bg-[#F2F2F4]/5 rounded-full px-4 h-14 flex-row justify-center items-center mb-4">
                  <PasswordIcon
                    width={16}
                    height={16}
                    fill="#8C929C"
                    fillOpacity={1}
                  />
                  <TextInput
                    value={formData.confirm_password}
                    onChangeText={handleInputChange("confirm_password")}
                    placeholder="Confirm your password"
                    placeholderTextColor="#8C929C"
                    secureTextEntry={!showConfirmPassword}
                    className="ml-3 flex-1 text-base text-text-primary dark:text-text-primary-dark"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword((s) => !s)}
                    activeOpacity={0.8}
                  >
                    <FontAwesome5
                      name={showConfirmPassword ? "eye" : "eye-slash"}
                      size={16}
                      color="#8C929C"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirm_password ? (
                  <Text className="text-red-500 text-sm -mt-2 mb-2">
                    {errors.confirm_password}
                  </Text>
                ) : null}
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={registerMutation.isPending}
                className="mt-2 rounded-full bg-warning/15 flex-col justify-center items-center h-14 mx-4"
              >
                {registerMutation.isPending ? (
                  <ActivityIndicator size="small" color="#F4B85A" />
                ) : (
                  <Text className="text-warning text-base font-open-sauce-two-medium">
                    Sign Up
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </LinearGradient>
        </BlurView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
