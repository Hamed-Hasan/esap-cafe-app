import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import {
  CreateUserFormData,
  UpdateUserFormData
} from '../schemas/user-schemas';
import { UserService } from '../services/user-service';

/**
 * Hook for creating a new user
 */
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserFormData) => UserService.createUser(data),
    onSuccess: (response) => {
      if (response.success || response.user) {
        // Invalidate users list to refresh data
        queryClient.invalidateQueries({ queryKey: ['users'] });
        Alert.alert(
          'Success',
          response.message || 'User created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to previous screen
                setTimeout(() => {
                  try {
                    router.back();
                  } catch (error) {
                    console.warn('Navigation failed after user creation');
                  }
                }, 100);
              },
            },
          ]
        );
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to create user';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to create user';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for updating a user
 */
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string | number; data: UpdateUserFormData }) =>
      UserService.updateUser(userId, data),
    onSuccess: (response, variables) => {
      if (response.success || response.user) {
        // Invalidate users list and specific user query
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
        Alert.alert(
          'Success',
          response.message || 'User updated successfully!'
        );
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to update user';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to update user';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for deleting a user
 */
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string | number) => UserService.deleteUser(userId),
    onSuccess: (response, userId) => {
      if (response.success) {
        // Invalidate users list and remove specific user from cache
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.removeQueries({ queryKey: ['user', userId] });
        Alert.alert(
          'Success',
          response.message || 'User deleted successfully!'
        );
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to delete user';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to delete user';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for assigning a role to a user
 */
export const useAssignRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleName }: { userId: string | number; roleName: string }) =>
      UserService.assignRole(userId, roleName),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate users list and specific user query
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
        Alert.alert(
          'Success',
          response.message || 'Role assigned successfully!'
        );
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to assign role';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to assign role';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for removing a role from a user
 */
export const useRemoveRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleName }: { userId: string | number; roleName: string }) =>
      UserService.removeRole(userId, roleName),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate users list and specific user query
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
        Alert.alert(
          'Success',
          response.message || 'Role removed successfully!'
        );
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to remove role';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to remove role';
      Alert.alert('Error', errorMessage);
    },
  });
};