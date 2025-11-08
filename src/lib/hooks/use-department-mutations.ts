import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import {
  CreateDepartmentFormData,
  UpdateDepartmentFormData,
} from '../schemas/department-schemas';
import { DepartmentService } from '../services/department-service';

/**
 * Hook for creating a new department
 */
export const useCreateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentFormData) => DepartmentService.createDepartment(data),
    onSuccess: (response) => {
      if (response.success || response.department) {
        // Invalidate departments list to refresh data
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        Alert.alert(
          'Success',
          response.message || 'Department created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to previous screen
                setTimeout(() => {
                  try {
                    router.back();
                  } catch (error) {
                    console.warn('Navigation failed after department creation');
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
          : response.detail || response.message || 'Failed to create department';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to create department';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for updating a department
 */
export const useUpdateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, data }: { departmentId: string | number; data: UpdateDepartmentFormData }) =>
      DepartmentService.updateDepartment(departmentId, data),
    onSuccess: (response, variables) => {
      if (response.success || response.department) {
        // Invalidate departments list and specific department query
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        queryClient.invalidateQueries({ queryKey: ['department', variables.departmentId] });
        Alert.alert(
          'Success',
          response.message || 'Department updated successfully!'
        );
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to update department';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to update department';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for deleting a department
 */
export const useDeleteDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: string | number) => DepartmentService.deleteDepartment(departmentId),
    onSuccess: (response, departmentId) => {
      if (response.success) {
        // Invalidate departments list and specific department query
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        queryClient.invalidateQueries({ queryKey: ['department', departmentId] });
        Alert.alert(
          'Success',
          response.message || 'Department deleted successfully!'
        );
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to delete department';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to delete department';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for toggling department active status
 * This is a specialized update mutation for toggling is_active field
 */
export const useToggleDepartmentStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, isActive }: { departmentId: string | number; isActive: boolean }) =>
      DepartmentService.updateDepartment(departmentId, { is_active: isActive }),
    onSuccess: (response, variables) => {
      if (response.success || response.department) {
        // Invalidate departments list and specific department query
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        queryClient.invalidateQueries({ queryKey: ['department', variables.departmentId] });
        const statusText = variables.isActive ? 'activated' : 'deactivated';
        Alert.alert(
          'Success',
          response.message || `Department ${statusText} successfully!`
        );
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to update department status';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to update department status';
      Alert.alert('Error', errorMessage);
    },
  });
};