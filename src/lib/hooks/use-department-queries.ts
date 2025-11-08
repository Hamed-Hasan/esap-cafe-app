import { useQuery } from '@tanstack/react-query';
import { GetDepartmentsQueryParams } from '../schemas/department-schemas';
import { DepartmentService } from '../services/department-service';
import { useAuth } from '../store/auth-store';

/**
 * Hook for fetching all departments with optional pagination and search
 */
export const useDepartments = (params?: GetDepartmentsQueryParams) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['departments', params],
    queryFn: () => DepartmentService.getAllDepartments(params),
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
 * Hook for fetching a specific department by ID
 */
export const useDepartment = (departmentId: string | number | undefined) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['department', departmentId],
    queryFn: () => {
      if (!departmentId) {
        throw new Error('Department ID is required');
      }
      return DepartmentService.getDepartmentById(departmentId);
    },
    enabled: isAuthenticated && !!token && !!departmentId,
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
 * Hook for fetching departments with search functionality
 * This is a specialized version of useDepartments for search scenarios
 */
export const useSearchDepartments = (searchTerm: string, limit: number = 20) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['departments', 'search', searchTerm, limit],
    queryFn: () => DepartmentService.getAllDepartments({ search: searchTerm, limit, skip: 0 }),
    enabled: isAuthenticated && !!token && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for search results)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2; // Fewer retries for search
    },
  });
};

/**
 * Hook for fetching paginated departments
 * This is a specialized version of useDepartments for pagination scenarios
 */
export const usePaginatedDepartments = (page: number = 0, limit: number = 10) => {
  const { isAuthenticated, token } = useAuth();
  const skip = page * limit;

  return useQuery({
    queryKey: ['departments', 'paginated', page, limit],
    queryFn: () => DepartmentService.getAllDepartments({ skip, limit }),
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
 * Hook for fetching active departments only
 * Useful for dropdowns and selection components
 */
export const useActiveDepartments = () => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['departments', 'active'],
    queryFn: () => DepartmentService.getAllDepartments({ is_active: true }),
    enabled: isAuthenticated && !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes (longer for active departments)
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};