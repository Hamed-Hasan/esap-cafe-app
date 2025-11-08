import { useQuery } from '@tanstack/react-query';
import { GetEmployeesQueryParams } from '../schemas/employee-schemas';
import { EmployeeService } from '../services/employee-service';
import { useAuth } from '../store/auth-store';

/**
 * Hook for fetching all employees with optional pagination and filtering
 */
export const useEmployees = (params?: GetEmployeesQueryParams) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => EmployeeService.getAllEmployees(params),
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
 * Hook for fetching a specific employee by ID
 */
export const useEmployee = (employeeId: string | number | undefined) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => {
      if (!employeeId) {
        throw new Error('Employee ID is required');
      }
      return EmployeeService.getEmployeeById(employeeId);
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
 * Hook for fetching employee data by user ID
 */
export const useEmployeeByUserId = (userId: string | number | undefined) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['employee', 'user', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return EmployeeService.getEmployeeByUserId(userId);
    },
    enabled: isAuthenticated && !!token && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes (longer cache for employee data)
    gcTime: 15 * 60 * 1000, // 15 minutes
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
 * Hook for fetching current user's employee data
 */
export const useCurrentUserEmployee = () => {
  const { user, isAuthenticated, token } = useAuth();
  
  return useEmployeeByUserId(user?.id);
};

/**
 * Hook for getting cached employee data from auth store
 * This provides immediate access to employee data without API calls
 * Use this for attendance operations and other real-time features
 */
export const useCachedEmployee = () => {
  const { employee, employeeLoading, employeeError } = useAuth();
  
  return {
    employee,
    isLoading: employeeLoading,
    error: employeeError,
    isAvailable: !!employee?.id,
  };
};

/**
 * Hook for searching employees with a search term
 */
export const useSearchEmployees = (searchTerm: string, limit: number = 20) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['employees', 'search', searchTerm, limit],
    queryFn: () => EmployeeService.getAllEmployees({ search: searchTerm, limit }),
    enabled: isAuthenticated && !!token && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for search results)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Hook for fetching paginated employees
 */
export const usePaginatedEmployees = (page: number = 0, limit: number = 10) => {
  const { isAuthenticated, token } = useAuth();
  const skip = page * limit;

  return useQuery({
    queryKey: ['employees', 'paginated', page, limit],
    queryFn: () => EmployeeService.getAllEmployees({ skip, limit }),
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
 * Hook for fetching employees by department
 */
export const useEmployeesByDepartment = (departmentId: string | number | undefined) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['employees', 'department', departmentId],
    queryFn: () => {
      if (!departmentId) {
        throw new Error('Department ID is required');
      }
      return EmployeeService.getAllEmployees({ department_id: departmentId.toString() });
    },
    enabled: isAuthenticated && !!token && !!departmentId,
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
 * Hook for fetching employees by location
 */
export const useEmployeesByLocation = (locationId: string | number | undefined) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['employees', 'location', locationId],
    queryFn: () => {
      if (!locationId) {
        throw new Error('Location ID is required');
      }
      return EmployeeService.getAllEmployees({ location_id: locationId.toString() });
    },
    enabled: isAuthenticated && !!token && !!locationId,
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
 * Hook for fetching active employees only
 * Useful for dropdowns and selection components
 */
export const useActiveEmployees = () => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['employees', 'active'],
    queryFn: () => EmployeeService.getAllEmployees({ is_active: 'true' }),
    enabled: isAuthenticated && !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes (longer for active employees)
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

/**
 * Hook for fetching managers only
 */
export const useManagers = () => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['employees', 'managers'],
    queryFn: () => EmployeeService.getAllEmployees({ is_manager: 'true', is_active: 'true' }),
    enabled: isAuthenticated && !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching managers from the dedicated managers endpoint
 * with optional location filtering
 */
export const useManagersEndpoint = (locationId?: string | number) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['managers', 'endpoint', locationId],
    queryFn: () => EmployeeService.getManagers(locationId),
    enabled: isAuthenticated && !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};