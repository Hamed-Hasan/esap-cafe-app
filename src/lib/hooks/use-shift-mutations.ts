import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import {
  CreateShiftTypeFormData,
  UpdateShiftTypeFormData,
  AssignShiftFormData,
} from '../schemas/shift-schemas';
import { ShiftService } from '../services/shift-service';

/**
 * Hook for creating a new shift type
 */
export const useCreateShiftTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShiftTypeFormData) => ShiftService.createShiftType(data),
    onSuccess: (response) => {
      if (response.success || response.shift_type) {
        // Invalidate shift types list to refresh data
        queryClient.invalidateQueries({ queryKey: ['shift-types'] });
        Alert.alert(
          'Success',
          response.message || 'Shift type created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to previous screen
                setTimeout(() => {
                  try {
                    router.back();
                  } catch (error) {
                    console.warn('Navigation failed after shift type creation');
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
          : response.detail || response.message || 'Failed to create shift type';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to create shift type';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for updating a shift type
 */
export const useUpdateShiftTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shiftTypeId, data }: { shiftTypeId: string | number; data: UpdateShiftTypeFormData }) =>
      ShiftService.updateShiftType(shiftTypeId, data),
    onSuccess: (response, variables) => {
      if (response.success || response.shift_type) {
        // Invalidate shift types list to refresh data
        queryClient.invalidateQueries({ queryKey: ['shift-types'] });
        Alert.alert('Success', response.message || 'Shift type updated successfully!');
      } else {
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to update shift type';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to update shift type';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for assigning shift to employee
 */
export const useAssignShiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignShiftFormData) => ShiftService.assignShift(data),
    onSuccess: (response, variables) => {
      if (response.success || response.shift_assignment) {
        // Invalidate shift assignment queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['shift-assignment'] });
        queryClient.invalidateQueries({ queryKey: ['shift-assignment', 'current', variables.employee_id] });
        queryClient.invalidateQueries({ queryKey: ['shift-assignment', 'history', variables.employee_id] });
        Alert.alert(
          'Success',
          response.message || 'Shift assigned successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to previous screen
                setTimeout(() => {
                  try {
                    router.back();
                  } catch (error) {
                    console.warn('Navigation failed after shift assignment');
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
          : response.detail || response.message || 'Failed to assign shift';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to assign shift';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for toggling shift type status (activate/deactivate)
 */
export const useToggleShiftTypeStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shiftTypeId, isActive }: { shiftTypeId: string | number; isActive: boolean }) =>
      ShiftService.updateShiftType(shiftTypeId, { is_active: isActive }),
    onSuccess: (response, variables) => {
      if (response.success || response.shift_type) {
        // Invalidate shift types list to refresh data
        queryClient.invalidateQueries({ queryKey: ['shift-types'] });
        const statusText = variables.isActive ? 'activated' : 'deactivated';
        Alert.alert('Success', `Shift type ${statusText} successfully!`);
      } else {
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to update shift type status';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to update shift type status';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for bulk operations on shift types
 */
export const useBulkShiftTypeOperationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ shiftTypeIds, operation }: { shiftTypeIds: (string | number)[]; operation: 'activate' | 'deactivate' }) => {
      const promises = shiftTypeIds.map(id => 
        ShiftService.updateShiftType(id, { is_active: operation === 'activate' })
      );
      return Promise.all(promises);
    },
    onSuccess: (responses, variables) => {
      const successCount = responses.filter(response => response.success || response.shift_type).length;
      const totalCount = responses.length;
      
      // Invalidate shift types list to refresh data
      queryClient.invalidateQueries({ queryKey: ['shift-types'] });
      
      if (successCount === totalCount) {
        const operationText = variables.operation === 'activate' ? 'activated' : 'deactivated';
        Alert.alert('Success', `${successCount} shift type(s) ${operationText} successfully!`);
      } else {
        Alert.alert(
          'Partial Success',
          `${successCount} out of ${totalCount} shift types were updated successfully.`
        );
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to perform bulk operation';
      Alert.alert('Error', errorMessage);
    },
  });
};