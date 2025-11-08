import { useQuery } from '@tanstack/react-query';
import { GetShiftTypesQueryParams } from '../schemas/shift-schemas';
import { ShiftService } from '../services/shift-service';
import { useAuth } from '../store/auth-store';

/**
 * Hook for fetching all shift types with optional filtering
 */
export const useShiftTypes = (params?: GetShiftTypesQueryParams) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['shift-types', params],
    queryFn: () => ShiftService.getShiftTypes(params),
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching only active shift types
 */
export const useActiveShiftTypes = () => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['shift-types', 'active'],
    queryFn: () => ShiftService.getActiveShiftTypes(),
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching current shift assignment for a specific employee
 */
export const useCurrentShiftByEmployee = (employeeId: string | number | undefined) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['shift-assignment', 'current', employeeId],
    queryFn: () => {
      if (!employeeId) {
        throw new Error('Employee ID is required');
      }
      return ShiftService.getCurrentShiftByEmployee(employeeId);
    },
    enabled: isAuthenticated && !!token && !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 or 404 errors
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching shift assignment history for a specific employee
 */
export const useShiftHistoryByEmployee = (employeeId: string | number | undefined) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['shift-assignment', 'history', employeeId],
    queryFn: () => {
      if (!employeeId) {
        throw new Error('Employee ID is required');
      }
      return ShiftService.getShiftHistoryByEmployee(employeeId);
    },
    enabled: isAuthenticated && !!token && !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 or 404 errors
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching all shift types (both active and inactive)
 */
export const useAllShiftTypes = () => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['shift-types', 'all'],
    queryFn: () => ShiftService.getShiftTypes(),
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching inactive shift types only
 */
export const useInactiveShiftTypes = () => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['shift-types', 'inactive'],
    queryFn: () => ShiftService.getShiftTypes({ is_active: false }),
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};