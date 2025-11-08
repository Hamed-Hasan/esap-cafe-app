import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { GetRolesQueryParams, RoleApiResponse, RoleResponse, PermissionsApiResponse } from '../schemas/role-schemas';
import { RoleService } from '../services/role-service';
import { useAuth } from '../store/auth-store';

// Query keys
export const roleQueryKeys = {
  all: ['roles'] as const,
  lists: () => [...roleQueryKeys.all, 'list'] as const,
  list: (params?: GetRolesQueryParams) => [...roleQueryKeys.lists(), params] as const,
  details: () => [...roleQueryKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...roleQueryKeys.details(), id] as const,
  permissions: () => [...roleQueryKeys.all, 'permissions'] as const,
};

/**
 * Hook for fetching all roles with optional pagination and search
 */
export const useRoles = (
  params?: GetRolesQueryParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<RoleApiResponse, Error> => {
  const { isAuthenticated, token, isLoading } = useAuth();

  return useQuery({
    queryKey: roleQueryKeys.list(params),
    queryFn: () => RoleService.getAllRoles(params),
    enabled: options?.enabled !== false && !isLoading && isAuthenticated && !!token,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403 errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching a specific role by ID
 */
export const useRole = (
  roleId: string | number,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<RoleApiResponse, Error> => {
  const { isAuthenticated, token, isLoading } = useAuth();

  return useQuery({
    queryKey: roleQueryKeys.detail(roleId),
    queryFn: () => RoleService.getRoleById(roleId),
    enabled: options?.enabled !== false && !isLoading && isAuthenticated && !!token && !!roleId,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403/404 errors
      if ([401, 403, 404].includes(error?.response?.status)) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching all available permissions
 */
export const usePermissions = (
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<PermissionsApiResponse, Error> => {
  const { isAuthenticated, token, isLoading } = useAuth();

  return useQuery({
    queryKey: roleQueryKeys.permissions(),
    queryFn: () => RoleService.getAllPermissions(),
    enabled: options?.enabled !== false && !isLoading && isAuthenticated && !!token,
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes (permissions don't change often)
    gcTime: options?.gcTime ?? 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403 errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook to get roles with search functionality
 */
export function useRoleSearch(
  searchTerm: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<RoleApiResponse, Error> {
  const { isAuthenticated, token, isLoading } = useAuth();

  return useQuery({
    queryKey: roleQueryKeys.list({ search: searchTerm }),
    queryFn: () => RoleService.getAllRoles({ search: searchTerm }),
    enabled: options?.enabled !== false && !isLoading && isAuthenticated && !!token && !!searchTerm,
    staleTime: options?.staleTime ?? 2 * 60 * 1000, // 2 minutes for search results
    gcTime: options?.gcTime ?? 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}