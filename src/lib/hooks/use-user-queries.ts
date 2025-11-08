import { useQuery } from '@tanstack/react-query';
import { GetUsersQueryParams } from '../schemas/user-schemas';
import { UserService } from '../services/user-service';
import { useAuth } from '../store/auth-store';

/**
 * Hook for fetching all users with optional pagination and search
 */
export const useUsers = (params?: GetUsersQueryParams) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['users', params],
    queryFn: () => UserService.getAllUsers(params),
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
 * Hook for fetching a specific user by ID
 */
export const useUser = (userId: string | number | undefined) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return UserService.getUserById(userId);
    },
    enabled: isAuthenticated && !!token && !!userId,
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
 * Hook for fetching users with search functionality
 * This is a specialized version of useUsers for search scenarios
 */
export const useSearchUsers = (searchTerm: string, limit: number = 20) => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ['users', 'search', searchTerm, limit],
    queryFn: () => UserService.getAllUsers({ search: searchTerm, limit, skip: 0 }),
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
 * Hook for fetching paginated users
 * This is a specialized version of useUsers for pagination scenarios
 */
export const usePaginatedUsers = (page: number = 0, limit: number = 10) => {
  const { isAuthenticated, token } = useAuth();
  const skip = page * limit;

  return useQuery({
    queryKey: ['users', 'paginated', page, limit],
    queryFn: () => UserService.getAllUsers({ skip, limit }),
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Note: keepPreviousData has been replaced with placeholderData in newer versions
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};