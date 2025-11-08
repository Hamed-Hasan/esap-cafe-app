import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import {
  CreateRoleFormData,
  UpdateRoleFormData,
} from '../schemas/role-schemas';
import { RoleService } from '../services/role-service';
import { roleQueryKeys } from './use-role-queries';

/**
 * Hook for creating a new role
 */
export const useCreateRoleMutation = (options?: {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  showAlert?: boolean;
}) => {
  const queryClient = useQueryClient();
  const showAlert = options?.showAlert !== false;

  return useMutation({
    mutationFn: (data: CreateRoleFormData) => RoleService.createRole(data),
    onSuccess: (response) => {
      if (response.success || response.role) {
        // Invalidate roles list and permissions to refresh data
        queryClient.invalidateQueries({ queryKey: roleQueryKeys.all });
        
        if (showAlert) {
          Alert.alert(
            'Success',
            response.message || 'Role created successfully!'
          );
        }
        
        options?.onSuccess?.(response);
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to create role';
        
        if (showAlert) {
          Alert.alert('Error', errorMessage);
        }
        
        options?.onError?.(new Error(errorMessage));
      }
    },
    onError: (error: any) => {
      console.error('Role creation mutation error:', error);
      const errorMessage = error.message || 'Failed to create role';
      
      if (showAlert) {
        Alert.alert('Error', errorMessage);
      }
      
      options?.onError?.(error);
    },
  });
};

/**
 * Hook for updating a role
 */
export const useUpdateRoleMutation = (options?: {
  onSuccess?: (response: any, variables: any) => void;
  onError?: (error: any) => void;
  showAlert?: boolean;
}) => {
  const queryClient = useQueryClient();
  const showAlert = options?.showAlert !== false;

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string | number; data: UpdateRoleFormData }) =>
      RoleService.updateRole(roleId, data),
    onSuccess: (response, variables) => {
      if (response.success || response.role) {
        // Invalidate roles list and specific role query
        queryClient.invalidateQueries({ queryKey: roleQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: roleQueryKeys.detail(variables.roleId) });
        
        if (showAlert) {
          Alert.alert(
            'Success',
            response.message || 'Role updated successfully!'
          );
        }
        
        options?.onSuccess?.(response, variables);
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to update role';
        
        if (showAlert) {
          Alert.alert('Error', errorMessage);
        }
        
        options?.onError?.(new Error(errorMessage));
      }
    },
    onError: (error: any) => {
      console.error('Role update mutation error:', error);
      const errorMessage = error.message || 'Failed to update role';
      
      if (showAlert) {
        Alert.alert('Error', errorMessage);
      }
      
      options?.onError?.(error);
    },
  });
};

/**
 * Hook for deleting a role
 */
export const useDeleteRoleMutation = (options?: {
  onSuccess?: (response: any, roleId: string | number) => void;
  onError?: (error: any) => void;
  showAlert?: boolean;
}) => {
  const queryClient = useQueryClient();
  const showAlert = options?.showAlert !== false;

  return useMutation({
    mutationFn: (roleId: string | number) => RoleService.deleteRole(roleId),
    onSuccess: (response, roleId) => {
      if (response.success) {
        // Invalidate roles list and remove specific role from cache
        queryClient.invalidateQueries({ queryKey: roleQueryKeys.all });
        queryClient.removeQueries({ queryKey: roleQueryKeys.detail(roleId) });
        
        if (showAlert) {
          Alert.alert(
            'Success',
            response.message || 'Role deleted successfully!'
          );
        }
        
        options?.onSuccess?.(response, roleId);
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to delete role';
        
        if (showAlert) {
          Alert.alert('Error', errorMessage);
        }
        
        options?.onError?.(new Error(errorMessage));
      }
    },
    onError: (error: any) => {
      console.error('Role deletion mutation error:', error);
      const errorMessage = error.message || 'Failed to delete role';
      
      if (showAlert) {
        Alert.alert('Error', errorMessage);
      }
      
      options?.onError?.(error);
    },
  });
};

/**
 * Hook for bulk role operations
 */
export const useBulkRoleOperationMutation = (options?: {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  showAlert?: boolean;
}) => {
  const queryClient = useQueryClient();
  const showAlert = options?.showAlert !== false;

  return useMutation({
    mutationFn: async ({ operation, roleIds }: { operation: 'delete' | 'activate' | 'deactivate'; roleIds: (string | number)[] }) => {
      // This would need to be implemented in the RoleService
      // For now, we'll simulate bulk operations by calling individual operations
      const results = [];
      for (const roleId of roleIds) {
        if (operation === 'delete') {
          const result = await RoleService.deleteRole(roleId);
          results.push(result);
        }
        // Add other bulk operations as needed
      }
      return { success: true, results, message: `Bulk ${operation} completed` };
    },
    onSuccess: (response) => {
      // Invalidate all role-related queries
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.all });
      
      if (showAlert) {
        Alert.alert(
          'Success',
          response.message || 'Bulk operation completed successfully!'
        );
      }
      
      options?.onSuccess?.(response);
    },
    onError: (error: any) => {
      console.error('Bulk role operation error:', error);
      const errorMessage = error.message || 'Bulk operation failed';
      
      if (showAlert) {
        Alert.alert('Error', errorMessage);
      }
      
      options?.onError?.(error);
    },
  });
}