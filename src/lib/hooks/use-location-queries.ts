import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  GetLocationsQuery,
  LocationApiResponse,
  LocationArrayResponse,
  LocationResponse,
} from "../schemas/location-schemas";
import { LocationService } from "../services/location-service";
import { useAuth } from "../store/auth-store";
import { useCurrentUser } from "./use-auth-queries";

// Query keys
export const locationQueryKeys = {
  all: ["locations"] as const,
  lists: () => [...locationQueryKeys.all, "list"] as const,
  list: (params?: GetLocationsQuery) =>
    [...locationQueryKeys.lists(), params] as const,
  details: () => [...locationQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...locationQueryKeys.details(), id] as const,
  search: (searchTerm: string) =>
    [...locationQueryKeys.all, "search", searchTerm] as const,
  active: () => [...locationQueryKeys.all, "active"] as const,
  byType: (type: string) => [...locationQueryKeys.all, "type", type] as const,
  byCity: (city: string) => [...locationQueryKeys.all, "city", city] as const,
  // Branches
  branches: {
    all: ["branches"] as const,
    lists: () => [...locationQueryKeys.branches.all, "list"] as const,
    list: (params?: GetLocationsQuery) =>
      [...locationQueryKeys.branches.lists(), params] as const,
    active: () => [...locationQueryKeys.branches.all, "active"] as const,
  },
  // Warehouses
  warehouses: {
    all: ["warehouses"] as const,
    lists: () => [...locationQueryKeys.warehouses.all, "list"] as const,
    list: (params?: GetLocationsQuery) =>
      [...locationQueryKeys.warehouses.lists(), params] as const,
    active: () => [...locationQueryKeys.warehouses.all, "active"] as const,
  },
};

/**
 * Hook to fetch all locations with optional filtering
 */
export function useLocations(
  params?: GetLocationsQuery,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<LocationArrayResponse, Error> {
  const { data: currentUser } = useCurrentUser();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: locationQueryKeys.list(params),
    queryFn: () => LocationService.getLocations(params),
    enabled: options?.enabled !== false && !authLoading && isAuthenticated && !!currentUser,
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
}

/**
 * Hook to fetch a single location by ID
 */
export function useLocation(
  id: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<LocationResponse, Error> {
  const { data: currentUser } = useCurrentUser();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: locationQueryKeys.detail(id),
    queryFn: () => LocationService.getLocationById(id),
    enabled: options?.enabled !== false && !authLoading && isAuthenticated && !!currentUser && !!id,
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
}

/**
 * Hook to search locations
 */
export function useSearchLocations(
  searchTerm: string,
  params?: Omit<GetLocationsQuery, "search">,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<LocationArrayResponse, Error> {
  const { data: currentUser } = useCurrentUser();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: locationQueryKeys.search(searchTerm),
    queryFn: () => LocationService.searchLocations(searchTerm, params),
    enabled: options?.enabled !== false && !authLoading && isAuthenticated && !!currentUser && !!searchTerm.trim(),
    staleTime: options?.staleTime ?? 2 * 60 * 1000, // 2 minutes for search results
    gcTime: options?.gcTime ?? 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2; // Less retries for search
    },
  });
}

/**
 * Hook to fetch locations with pagination
 */
export function usePaginatedLocations(
  skip: number = 0,
  limit: number = 100,
  filters?: Omit<GetLocationsQuery, "skip" | "limit">,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<LocationArrayResponse, Error> {
  return useLocations({ skip, limit, ...filters }, options);
}

/**
 * Hook to fetch only active locations
 */
export function useActiveLocations(
  params?: Omit<GetLocationsQuery, "is_active">,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<LocationArrayResponse, Error> {
  const { data: currentUser } = useCurrentUser();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: locationQueryKeys.active(),
    queryFn: () => LocationService.getActiveLocations(params),
    enabled: options?.enabled !== false && !authLoading && isAuthenticated && !!currentUser,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// ===== BRANCHES QUERY HOOKS =====

/**
 * Hook to fetch all branches with optional filtering
 */
export function useBranches(
  params?: GetLocationsQuery,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<LocationArrayResponse, Error> {
  const { data: currentUser } = useCurrentUser();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: locationQueryKeys.branches.list(params),
    queryFn: () => LocationService.getBranches(params),
    enabled: options?.enabled !== false && !authLoading && isAuthenticated && !!currentUser,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch only active branches
 */
export function useActiveBranches(
  params?: Omit<GetLocationsQuery, "is_active">,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<LocationArrayResponse, Error> {
  const { data: currentUser } = useCurrentUser();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: locationQueryKeys.branches.active(),
    queryFn: () => LocationService.getActiveBranches(params),
    enabled: options?.enabled !== false && !authLoading && isAuthenticated && !!currentUser,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// ===== WAREHOUSES QUERY HOOKS =====

/**
 * Hook to fetch all warehouses with optional filtering
 */
export function useWarehouses(
  params?: GetLocationsQuery,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<LocationArrayResponse, Error> {
  const { data: currentUser } = useCurrentUser();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: locationQueryKeys.warehouses.list(params),
    queryFn: () => LocationService.getWarehouses(params),
    enabled: options?.enabled !== false && !authLoading && isAuthenticated && !!currentUser,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch only active warehouses
 */
export function useActiveWarehouses(
  params?: Omit<GetLocationsQuery, "is_active">,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<LocationArrayResponse, Error> {
  const { data: currentUser } = useCurrentUser();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: locationQueryKeys.warehouses.active(),
    queryFn: () => LocationService.getActiveWarehouses(params),
    enabled: options?.enabled !== false && !authLoading && isAuthenticated && !!currentUser,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch locations by type
 */
export function useLocationsByType(
  locationType: string,
  params?: Omit<GetLocationsQuery, "location_type">,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<LocationArrayResponse, Error> {
  const { data: currentUser } = useCurrentUser();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: locationQueryKeys.byType(locationType),
    queryFn: () => LocationService.getLocationsByType(locationType, params),
    enabled: options?.enabled !== false && !authLoading && isAuthenticated && !!currentUser && !!locationType,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch locations by city
 */
export function useLocationsByCity(
  city: string,
  params?: Omit<GetLocationsQuery, "city">,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
): UseQueryResult<LocationArrayResponse, Error> {
  const { data: currentUser } = useCurrentUser();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: locationQueryKeys.byCity(city),
    queryFn: () => LocationService.getLocationsByCity(city, params),
    enabled: options?.enabled !== false && !authLoading && isAuthenticated && !!currentUser && !!city,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
