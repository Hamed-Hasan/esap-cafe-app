import {
  CreateUserFormData,
  GetUsersQueryParams,
  RoleOperationResponse,
  UpdateUserFormData,
  UserApiResponse
} from "../schemas/user-schemas";
import { authApi } from "./auth-service";

export class UserService {
  /**
   * Create a new user
   * POST /users
   */
  static async createUser(data: CreateUserFormData): Promise<UserApiResponse> {
    try {
      const response = await authApi.post("/users", data);

      // Check if response.data is a user object (has id field)
      if (response.data && response.data.id) {
        return {
          success: true,
          user: response.data,
          message: "User created successfully",
        };
      }

      // If response already has success/error structure, return as is
      return response.data;
    } catch (error: any) {
      console.error(
        "User creation error:",
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
   * Get all users with optional pagination and search
   * GET /users
   */
  static async getAllUsers(
    params?: GetUsersQueryParams
  ): Promise<UserApiResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.skip !== undefined) {
        queryParams.append("skip", params.skip.toString());
      }
      if (params?.limit !== undefined) {
        queryParams.append("limit", params.limit.toString());
      }
      if (params?.search) {
        queryParams.append("search", params.search);
      }

      const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await authApi.get(url);

      // Handle both array response and paginated response
      if (Array.isArray(response.data)) {
        return {
          success: true,
          users: response.data,
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
        message: "Failed to fetch users",
        error: error.message,
      };
    }
  }

  /**
   * Get user by ID
   * GET /users/{user_id}
   */
  static async getUserById(userId: string | number): Promise<UserApiResponse> {
    try {
      const response = await authApi.get(`/users/${userId}`);
      return {
        success: true,
        user: response.data,
      };
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to fetch user",
        error: error.message,
      };
    }
  }

  /**
   * Update user
   * PUT /users/{user_id}
   */
  static async updateUser(
    userId: string | number,
    data: UpdateUserFormData
  ): Promise<UserApiResponse> {
    try {
      const response = await authApi.put(`/users/${userId}`, data);
      return {
        success: true,
        user: response.data,
        message: "User updated successfully",
      };
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to update user",
        error: error.message,
      };
    }
  }

  /**
   * Delete user
   * DELETE /users/{user_id}
   */
  static async deleteUser(userId: string | number): Promise<UserApiResponse> {
    try {
      const response = await authApi.delete(`/users/${userId}`);
      return {
        success: true,
        message: "User deleted successfully",
      };
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to delete user",
        error: error.message,
      };
    }
  }

  /**
   * Assign role to user
   * POST /users/{user_id}/assign-role?role_name={role_name}
   */
  static async assignRole(
    userId: string | number,
    roleName: string
  ): Promise<RoleOperationResponse> {
    try {
      const response = await authApi.post(`/users/${userId}/assign-role?role_name=${encodeURIComponent(roleName)}`);
      return {
        success: true,
        message: "Role assigned successfully",
        user: response.data.user,
      };
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to assign role",
        error: error.message,
      };
    }
  }

  /**
   * Remove role from user
   * DELETE /users/{user_id}/remove-role?role_name={role_name}
   */
  static async removeRole(
    userId: string | number,
    roleName: string
  ): Promise<RoleOperationResponse> {
    try {
      const response = await authApi.delete(`/users/${userId}/remove-role?role_name=${encodeURIComponent(roleName)}`);
      return {
        success: true,
        message: "Role removed successfully",
        user: response.data.user,
      };
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to remove role",
        error: error.message,
      };
    }
  }
}
