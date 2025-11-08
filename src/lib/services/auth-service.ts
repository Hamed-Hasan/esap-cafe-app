import axios, { AxiosHeaders } from "axios";
import {
  AuthResponse,
  ChangePasswordFormData,
  CurrentUserResponse,
  LoginFormData,
  RegisterFormData,
} from "../schemas/auth-schemas";
import { setFAQAuthToken } from "./faq-service";
import { setLocationAuthToken } from "./location-service";

// Get base URL from environment
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://176.9.16.194:9105/api/v1";

// Create axios instance
const authApi = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log(BASE_URL);
console.log(authApi.defaults.baseURL);
let authToken: string | null = null;

// Function to set auth token
export const setAuthToken = (token: string | null) => {
  authToken = token;
  // Also set token for other services that require authentication
  setLocationAuthToken(token);
  setFAQAuthToken(token);
};

authApi.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = new AxiosHeaders({
        "Content-Type": "application/json",
      });
    }

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    } else {
      console.log(`API Request to ${config.url} without token`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      if (logoutCallback) {
        logoutCallback();
      }
    }
    return Promise.reject(error);
  }
);

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterFormData): Promise<AuthResponse> {
    try {
      const response = await authApi.post("/register/register", data);
      console.log(response.data);
      console.log(data);
      console.log(authApi.defaults.baseURL);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Network error occurred",
        error: error.message,
      };
    }
  }

  /**
   * Login user
   */
  static async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await authApi.post("/auth/login", data);
      if (response.data.success && response.data.access_token) {
        setAuthToken(response.data.access_token);
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Network error occurred",
        error: error.message,
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<AuthResponse> {
    try {
      const response = await authApi.post("/auth/logout");
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Network error occurred",
        error: error.message,
      };
    }
  }

  /**
   * Logout from all sessions
   */
  static async logoutAll(): Promise<AuthResponse> {
    try {
      const response = await authApi.post("/auth/logout-all");
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Network error occurred",
        error: error.message,
      };
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await authApi.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      if (response.data.success && response.data.access_token) {
        setAuthToken(response.data.access_token);
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Token refresh failed",
        error: error.message,
      };
    }
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(
    data: ChangePasswordFormData
  ): Promise<AuthResponse> {
    try {
      const response = await authApi.post("/auth/change-password", data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Password change failed",
        error: error.message,
      };
    }
  }

  /**
   * Get current authenticated user information
   */
  static async getCurrentUser(): Promise<CurrentUserResponse | AuthResponse> {
    try {
      const response = await authApi.get("/auth/me");
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to fetch user information",
        error: error.message,
      };
    }
  }
}

export { authApi };
