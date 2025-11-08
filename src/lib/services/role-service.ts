import axios, { AxiosHeaders } from "axios";
import {
  CreateRoleFormData,
  GetRolesQueryParams,
  PermissionsApiResponse,
  RoleApiResponse,
  UpdateRoleFormData
} from "../schemas/role-schemas";

// Get base URL from environment - using the same URL as auth service
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://176.9.16.194:9105/api/v1";

const roleApi = axios.create({
  baseURL: `${API_BASE_URL}`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let authToken: string | null = null;

// Function to set auth token
export const setRoleAuthToken = (token: string | null) => {
  authToken = token;
  // console.log("Role auth token updated:", token ? "[TOKEN_SET]" : "[TOKEN_CLEARED]");
};

// Add request interceptor to include auth token
roleApi.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = new AxiosHeaders({
        "Content-Type": "application/json",
      });
    }

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    } else {
      console.log(`Role API Request to ${config.url} without token`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let logoutCallback: (() => void) | null = null;

export const setRoleLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// Add response interceptor for error handling
roleApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setRoleAuthToken(null);
      if (logoutCallback) {
        logoutCallback();
      }
    }
    return Promise.reject(error);
  }
);

export class RoleService {
  /**
   * Create a new role
   * POST /roles
   */
  static async createRole(data: CreateRoleFormData): Promise<RoleApiResponse> {
    try {
      const response = await roleApi.post("/roles", data);

      // Check if response.data is a role object (has id field)
      if (response.data && response.data.id) {
        return {
          success: true,
          role: response.data,
          message: "Role created successfully",
        };
      }

      // If response already has success/error structure, return as is
      return response.data;
    } catch (error: any) {
      console.error(
        "Role creation error:",
        error.response?.data || error.message
      );
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
   * Get all roles with optional pagination and search
   * GET /roles
   */
  static async getAllRoles(params?: GetRolesQueryParams): Promise<RoleApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.skip !== undefined) {
        queryParams.append('skip', params.skip.toString());
      }
      if (params?.limit !== undefined) {
        queryParams.append('limit', params.limit.toString());
      }
      if (params?.search) {
        queryParams.append('search', params.search);
      }

      const url = `/roles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await roleApi.get(url);
      
      // Handle both array response and paginated response
      if (Array.isArray(response.data)) {
        return {
          success: true,
          roles: response.data,
          total: response.data.length,
        };
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to fetch roles",
        error: error.message,
      };
    }
  }

  /**
   * Get role by ID
   * GET /roles/{role_id}
   */
  static async getRoleById(roleId: string | number): Promise<RoleApiResponse> {
    try {
      const response = await roleApi.get(`/roles/${roleId}`);
      
      // Check if response.data is a role object (has id field)
      if (response.data && response.data.id) {
        return {
          success: true,
          role: response.data,
        };
      }

      // If response already has success/error structure, return as is
      return response.data;
    } catch (error: any) {
      console.error(
        "Role fetch error:",
        error.response?.data || error.message
      );
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to fetch role",
        error: error.message,
      };
    }
  }

  /**
   * Update role
   * PUT /roles/{role_id}
   */
  static async updateRole(
    roleId: string | number,
    data: UpdateRoleFormData
  ): Promise<RoleApiResponse> {
    try {
      const response = await roleApi.put(`/roles/${roleId}`, data);
      
      // Check if response.data is a role object (has id field)
      if (response.data && response.data.id) {
        return {
          success: true,
          message: "Role updated successfully",
          role: response.data,
        };
      }

      // If response already has success/error structure, return as is
      return response.data;
    } catch (error: any) {
      console.error(
        "Role update error:",
        error.response?.data || error.message
      );
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to update role",
        error: error.message,
      };
    }
  }

  /**
   * Delete role
   * DELETE /roles/{role_id}
   */
  static async deleteRole(roleId: string | number): Promise<RoleApiResponse> {
    try {
      const response = await roleApi.delete(`/roles/${roleId}`);
      
      return {
        success: true,
        message: "Role deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "Role deletion error:",
        error.response?.data || error.message
      );
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to delete role",
        error: error.message,
      };
    }
  }

  /**
   * Get all available permissions
   * GET /permissions
   */
  static async getAllPermissions(): Promise<PermissionsApiResponse> {
    try {
      const response = await roleApi.get("/permissions");
      
      // Handle both array response and structured response
      if (Array.isArray(response.data)) {
        return {
          success: true,
          permissions: response.data,
        };
      }
      
      // If response already has success/error structure, return as is
      return response.data;
    } catch (error: any) {
      console.error(
        "Permissions fetch error:",
        error.response?.data || error.message
      );
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to fetch permissions",
        error: error.message,
      };
    }
  }
}