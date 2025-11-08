import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../services/auth-service";
import { useAuth } from "../store/auth-store";

/**
 * Hook for fetching current authenticated user information
 */
export const useCurrentUser = () => {
  const { isAuthenticated, token } = useAuth();

  return useQuery({
    queryKey: ["user", "current"],
    queryFn: () => AuthService.getCurrentUser(),
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
 * Hook to refresh authentication token
 */
export const useRefreshToken = (refreshToken?: string) => {
  const { login, logout, token } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["refresh-token", refreshToken],
    queryFn: async () => {
      const tokenToUse = refreshToken || token;
      if (!tokenToUse) {
        throw new Error("No refresh token available");
      }

      try {
        const response = await AuthService.refreshToken(tokenToUse);
        if (response.access_token && response.user) {
          // Map the response user to match the full User interface
          const fullUser = {
            ...response.user,
            profile_image: null,
            password_reset_token: null,
            password_reset_expires: null,
            verification_token: null,
            verification_expires: null,
            is_deleted: false,
            hashed_password: "",
            failed_login_attempts: 0,
            locked_until: null,
          };
          login(fullUser, response.access_token);
          return response;
        }
        throw new Error("Token refresh failed");
      } catch {
        logout();
        queryClient.clear();
        throw new Error("Token refresh failed");
      }
    },
    enabled: false, // Only run when manually triggered
    retry: false,
    staleTime: 0,
  });
};
