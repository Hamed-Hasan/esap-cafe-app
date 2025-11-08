import {
  CreateDepartmentFormData,
  UpdateDepartmentFormData,
  GetDepartmentsQueryParams,
  DepartmentApiResponse,
} from "../schemas/department-schemas";
import { authApi } from "./auth-service";

export class DepartmentService {
  /**
   * Create a new department
   * POST /api/v1/organization/department/
   */
  static async createDepartment(data: CreateDepartmentFormData): Promise<DepartmentApiResponse> {
    try {
      const response = await authApi.post("/organization/department/", data);

      // Check if response.data is a department object (has id field)
      if (response.data && response.data.id) {
        return {
          success: true,
          department: response.data,
          message: "Department created successfully",
        };
      }

      // If response already has success/error structure, return as is
      return response.data;
    } catch (error: any) {
      console.error(
        "Department creation error:",
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
   * Get all departments with optional pagination and search
   * GET /api/v1/organization/department/
   */
  static async getAllDepartments(
    params?: GetDepartmentsQueryParams
  ): Promise<DepartmentApiResponse> {
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
      if (params?.is_active !== undefined) {
        queryParams.append("is_active", params.is_active.toString());
      }

      const url = `/organization/department/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await authApi.get(url);

      // Handle both array response and paginated response
      if (Array.isArray(response.data)) {
        return {
          success: true,
          departments: response.data,
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
        message: "Failed to fetch departments",
        error: error.message,
      };
    }
  }

  /**
   * Get department by ID
   * GET /api/v1/organization/department/{department_id}
   */
  static async getDepartmentById(departmentId: string | number): Promise<DepartmentApiResponse> {
    try {
      const response = await authApi.get(`/organization/department/${departmentId}`);
      return {
        success: true,
        department: response.data,
      };
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to fetch department",
        error: error.message,
      };
    }
  }

  /**
   * Update department
   * PUT /api/v1/organization/department/{department_id}
   */
  static async updateDepartment(
    departmentId: string | number,
    data: UpdateDepartmentFormData
  ): Promise<DepartmentApiResponse> {
    try {
      const response = await authApi.put(`/organization/department/${departmentId}`, data);
      return {
        success: true,
        department: response.data,
        message: "Department updated successfully",
      };
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to update department",
        error: error.message,
      };
    }
  }

  /**
   * Delete department
   * DELETE /api/v1/organization/department/{department_id}
   */
  static async deleteDepartment(departmentId: string | number): Promise<DepartmentApiResponse> {
    try {
      const response = await authApi.delete(`/organization/department/${departmentId}`);
      return {
        success: true,
        message: "Department deleted successfully",
      };
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to delete department",
        error: error.message,
      };
    }
  }
}