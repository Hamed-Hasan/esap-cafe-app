import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  FAQApiResponse,
  GetFAQsQueryParams,
  SingleFAQApiResponse
} from "../schemas/faq-schemas";
import { FAQService } from "../services/faq-service";
import { useAuth } from "../store/auth-store";

// Query keys
export const faqQueryKeys = {
  all: ["faqs"] as const,
  lists: () => [...faqQueryKeys.all, "list"] as const,
  list: (params?: GetFAQsQueryParams) =>
    [...faqQueryKeys.lists(), params] as const,
  details: () => [...faqQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...faqQueryKeys.details(), id] as const,
  search: (searchTerm: string) =>
    [...faqQueryKeys.all, "search", searchTerm] as const,
  active: () => [...faqQueryKeys.all, "active"] as const,
  byCategory: (category: string) =>
    [...faqQueryKeys.all, "category", category] as const,
};

/**
 * Hook for fetching all FAQs with optional filtering and pagination
 */
export const useFAQs = (
  params?: GetFAQsQueryParams
): UseQueryResult<FAQApiResponse, Error> => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: faqQueryKeys.list(params),
    queryFn: () => FAQService.getFAQs(params),
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
 * Hook for fetching a single FAQ by ID
 */
export const useFAQ = (
  faqId: string | number | null
): UseQueryResult<SingleFAQApiResponse, Error> => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: faqQueryKeys.detail(faqId!),
    queryFn: () => FAQService.getFAQById(faqId!),
    enabled: isAuthenticated && !!token && !!faqId,
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
 * Hook for searching FAQs
 */
export const useSearchFAQs = (
  searchTerm: string,
  params?: Omit<GetFAQsQueryParams, "search">
): UseQueryResult<FAQApiResponse, Error> => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: faqQueryKeys.search(searchTerm),
    queryFn: () => FAQService.searchFAQs(searchTerm, params),
    enabled:
      isAuthenticated && !!token && !!searchTerm && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for search results)
    gcTime: 5 * 60 * 1000, // 5 minutes
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
 * Hook for fetching FAQs by category
 */
export const useFAQsByCategory = (
  category: string,
  params?: Omit<GetFAQsQueryParams, "category">
): UseQueryResult<FAQApiResponse, Error> => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: faqQueryKeys.byCategory(category),
    queryFn: () => FAQService.getFAQsByCategory(category, params),
    enabled: isAuthenticated && !!token && !!category,
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
 * Hook for fetching active FAQs only
 */
export const useActiveFAQs = (
  params?: Omit<GetFAQsQueryParams, "is_active">
): UseQueryResult<FAQApiResponse, Error> => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: faqQueryKeys.active(),
    queryFn: () => FAQService.getActiveFAQs(params),
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
 * Hook for fetching paginated FAQs with infinite scroll support
 */
export const usePaginatedFAQs = (
  initialParams?: GetFAQsQueryParams
): UseQueryResult<FAQApiResponse, Error> => {
  const { isAuthenticated, token } = useAuth();

  const params = {
    skip: 0,
    limit: 20,
    ...initialParams,
  };

  return useQuery({
    queryKey: faqQueryKeys.list(params),
    queryFn: () => FAQService.getFAQs(params),
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
