import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import {
  CreateEmployeeFormData,
  UpdateEmployeeFormData,
} from '../schemas/employee-schemas';
import { EmployeeService } from '../services/employee-service';

/**
 * Hook for creating a new employee
 */
export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeFormData) => EmployeeService.createEmployee(data),
    onSuccess: (response) => {
      if (response.success || response.employee) {
        // Invalidate employees list to refresh data
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        Alert.alert(
          'Success',
          response.message || 'Employee created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to previous screen
                setTimeout(() => {
                  try {
                    router.back();
                  } catch (error) {
                    console.warn('Navigation failed after employee creation');
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
          : response.detail || response.message || 'Failed to create employee';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to create employee';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for updating an employee
 */
export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeId, data }: { employeeId: string | number; data: UpdateEmployeeFormData }) =>
      EmployeeService.updateEmployee(employeeId, data),
    onSuccess: (response, variables) => {
      if (response.success || response.employee) {
        // Invalidate employees list and specific employee to refresh data
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        queryClient.invalidateQueries({ queryKey: ['employee', variables.employeeId] });
        Alert.alert('Success', response.message || 'Employee updated successfully!');
      } else {
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to update employee';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to update employee';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for deleting an employee
 */
export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string | number) => EmployeeService.deleteEmployee(employeeId),
    onSuccess: (response, employeeId) => {
      if (response.success) {
        // Invalidate employees list to refresh data
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        queryClient.removeQueries({ queryKey: ['employee', employeeId] });
        Alert.alert('Success', response.message || 'Employee deleted successfully!');
      } else {
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to delete employee';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to delete employee';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for toggling employee status (activate/deactivate)
 */
export const useToggleEmployeeStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeId, isActive }: { employeeId: string | number; isActive: boolean }) =>
      EmployeeService.updateEmployee(employeeId, { is_active: isActive }),
    onSuccess: (response, variables) => {
      if (response.success || response.employee) {
        // Invalidate employees list and specific employee to refresh data
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        queryClient.invalidateQueries({ queryKey: ['employee', variables.employeeId] });
        const statusText = variables.isActive ? 'activated' : 'deactivated';
        Alert.alert('Success', `Employee ${statusText} successfully!`);
      } else {
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to update employee status';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to update employee status';
      Alert.alert('Error', errorMessage);
    },
  });
};