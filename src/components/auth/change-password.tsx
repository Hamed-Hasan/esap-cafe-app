import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useChangePasswordMutation } from '../../lib/hooks/use-auth-mutations';
import { ChangePasswordFormData, changePasswordSchema } from '../../lib/schemas/auth-schemas';
import { CoffeeIcon, CustomButton, CustomInput } from '../index';

const ChangePassword = () => {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordFormData, string>>>({});
  
  const changePasswordMutation = useChangePasswordMutation();

  const handleInputChange = (field: keyof ChangePasswordFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      changePasswordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Partial<Record<keyof ChangePasswordFormData, string>> = {};
      if (error.issues) {
        error.issues.forEach((issue: any) => {
          if (issue.path?.length > 0) {
            fieldErrors[issue.path[0] as keyof ChangePasswordFormData] = issue.message;
          }
        });
      }
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again.');
      return;
    }

    changePasswordMutation.mutate(formData);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-light">
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Coffee Icon */}
        <View className="items-center mt-8 mb-12">
          <CoffeeIcon size={100} />
        </View>

        {/* Change Password Form */}
        <View className="bg-white rounded-3xl px-6 py-8 shadow-sm">
          {/* Title */}
          <Text className="text-primary text-3xl font-bold mb-2">Change Password</Text>
          <Text className="text-neutral text-base mb-8 leading-6">
            Update your password to keep your{"\n"}
            account secure.
          </Text>

          {/* Form Fields */}
          <CustomInput
            label="Current Password"
            placeholder="Enter current password"
            value={formData.currentPassword}
            onChangeText={handleInputChange('currentPassword')}
            secureTextEntry
            error={errors.currentPassword}
          />

          <CustomInput
            label="New Password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChangeText={handleInputChange('newPassword')}
            secureTextEntry
            error={errors.newPassword}
          />

          <CustomInput
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChangeText={handleInputChange('confirmPassword')}
            secureTextEntry
            error={errors.confirmPassword}
          />

          {/* Submit Button */}
          <CustomButton
            title="CHANGE PASSWORD"
            onPress={handleSubmit}
            loading={changePasswordMutation.isPending}
            className="mt-4 mb-6"
          />

          {/* Cancel Button */}
          <CustomButton
            title="CANCEL"
            onPress={handleCancel}
            variant="primary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;