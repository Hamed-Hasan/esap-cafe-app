import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { CreateLocationInput, LocationResponse, UpdateLocationInput } from '../schemas/location-schemas';
import { LocationService } from '../services/location-service';
import { locationQueryKeys } from './use-location-queries';

/**
 * Hook for creating a new location
 */
export function useCreateLocationMutation(): UseMutationResult<
  LocationResponse,
  Error,
  CreateLocationInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLocationInput) => LocationService.createLocation(data),
    onSuccess: (data) => {
      // Invalidate and refetch location queries
      queryClient.invalidateQueries({ queryKey: locationQueryKeys.all });
      
      // Show success message
      Alert.alert(
        'Success',
        'Location created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back or to location list
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push('/(tabs)/(root)/locations' as any);
              }
            },
          },
        ]
      );
    },
    onError: (error: any) => {
      console.error('Create location error:', error);
      
      let errorMessage = 'Failed to create location. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 404) {
          errorMessage = 'Location API endpoint not found. Please check your server configuration.';
        } else if (status === 401) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to create locations.';
        } else if (status === 422 && data?.detail) {
          // Validation errors
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map((err: any) => err.msg || err.message || err).join(', ');
          } else {
            errorMessage = data.detail;
          }
        } else if (data?.detail) {
          errorMessage = data.detail;
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    },
  });
}

/**
 * Hook for updating an existing location
 */
export function useUpdateLocationMutation(): UseMutationResult<
  LocationResponse,
  Error,
  { id: string; data: UpdateLocationInput }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLocationInput }) =>
      LocationService.updateLocation(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch location queries
      queryClient.invalidateQueries({ queryKey: locationQueryKeys.all });
      
      // Update the specific location in cache
      queryClient.setQueryData(
        locationQueryKeys.detail(variables.id),
        data
      );
      
      // Show success message
      Alert.alert(
        'Success',
        'Location updated successfully!',
        [{ text: 'OK' }]
      );
    },
    onError: (error) => {
      Alert.alert(
        'Error',
        error.message || 'Failed to update location. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });
}

/**
 * Hook for deleting a location
 */
export function useDeleteLocationMutation(): UseMutationResult<
  void,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => LocationService.deleteLocation(id),
    onSuccess: (_, locationId) => {
      // Invalidate and refetch location queries
      queryClient.invalidateQueries({ queryKey: locationQueryKeys.all });
      
      // Remove the specific location from cache
      queryClient.removeQueries({ queryKey: locationQueryKeys.detail(locationId) });
      
      // Show success message
      Alert.alert(
        'Success',
        'Location deleted successfully!',
        [{ text: 'OK' }]
      );
    },
    onError: (error) => {
      Alert.alert(
        'Error',
        error.message || 'Failed to delete location. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });
}

/**
 * Hook for toggling location active status
 */
export function useToggleLocationStatusMutation(): UseMutationResult<
  LocationResponse,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => LocationService.toggleLocationStatus(id),
    onSuccess: (data, locationId) => {
      // Invalidate and refetch location queries
      queryClient.invalidateQueries({ queryKey: locationQueryKeys.all });
      
      // Update the specific location in cache
      queryClient.setQueryData(
        locationQueryKeys.detail(locationId),
        data
      );
      
      // Show success message
      const statusText = data.is_active ? 'activated' : 'deactivated';
      Alert.alert(
        'Success',
        `Location ${statusText} successfully!`,
        [{ text: 'OK' }]
      );
    },
    onError: (error) => {
      Alert.alert(
        'Error',
        error.message || 'Failed to update location status. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });
}

/**
 * Hook for bulk operations on locations
 */
export function useBulkLocationOperationMutation(): UseMutationResult<
  void,
  Error,
  {
    operation: 'activate' | 'deactivate' | 'delete';
    locationIds: string[];
  }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ operation, locationIds }) => {
      const promises = locationIds.map((id) => {
        switch (operation) {
          case 'activate':
            return LocationService.updateLocation(id, { is_active: true });
          case 'deactivate':
            return LocationService.updateLocation(id, { is_active: false });
          case 'delete':
            return LocationService.deleteLocation(id);
          default:
            throw new Error('Invalid operation');
        }
      });
      
      await Promise.all(promises);
    },
    onSuccess: (_, { operation, locationIds }) => {
      // Invalidate and refetch location queries
      queryClient.invalidateQueries({ queryKey: locationQueryKeys.all });
      
      // Remove deleted locations from cache
      if (operation === 'delete') {
        locationIds.forEach((id) => {
          queryClient.removeQueries({ queryKey: locationQueryKeys.detail(id) });
        });
      }
      
      // Show success message
      const operationText = {
        activate: 'activated',
        deactivate: 'deactivated',
        delete: 'deleted',
      }[operation];
      
      Alert.alert(
        'Success',
        `${locationIds.length} location(s) ${operationText} successfully!`,
        [{ text: 'OK' }]
      );
    },
    onError: (error) => {
      Alert.alert(
        'Error',
        error.message || 'Failed to perform bulk operation. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });
}