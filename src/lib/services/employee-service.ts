import {
  CreateEmployeeFormData,
  UpdateEmployeeFormData,
  GetEmployeesQueryParams,
  EmployeeApiResponse,
} from "../schemas/employee-schemas";
import { authApi } from "./auth-service";

export class EmployeeService {
  /**
   * Create a new employee
   * POST /hr/employee
   */
  static async createEmployee(data: CreateEmployeeFormData): Promise<EmployeeApiResponse> {
    try {
      const response = await authApi.post("/hr/employee/", data);

      // Check if response.data is an employee object (has id field)
      if (response.data && response.data.id) {
        return {
          success: true,
          employee: response.data,
          message: "Employee created successfully",
        };
      }

      // If response already has success/error structure, return as is
      return response.data;
    } catch (error: any) {
      console.error(
        "Employee creation error:",
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
   * Get all employees with optional pagination and filtering
   * GET /hr/employee
   */
  static async getAllEmployees(
    params?: GetEmployeesQueryParams
  ): Promise<EmployeeApiResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.skip !== undefined) {
        queryParams.append("skip", params.skip.toString());
      }
      if (params?.limit !== undefined) {
        queryParams.append("limit", params.limit.toString());
      }
      if (params?.department_id) {
        queryParams.append("department_id", params.department_id);
      }
      if (params?.location_id) {
        queryParams.append("location_id", params.location_id);
      }
      if (params?.is_manager) {
        queryParams.append("is_manager", params.is_manager);
      }
      if (params?.is_active) {
        queryParams.append("is_active", params.is_active);
      }
      if (params?.search) {
        queryParams.append("search", params.search);
      }

      const url = `/hr/employee/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await authApi.get(url);

      // Handle both array response and paginated response
      if (Array.isArray(response.data)) {
        return {
          success: true,
          employees: response.data,
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
        message: "Failed to fetch employees",
        error: error.message,
      };
    }
  }

  /**
   * Get employee by ID
   * GET /hr/employee/{employee_id}
   */
  static async getEmployeeById(employeeId: string | number): Promise<EmployeeApiResponse> {
    try {
      const response = await authApi.get(`/hr/employee/${employeeId}/`);
      return {
        success: true,
        employee: response.data,
      };
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to fetch employee",
        error: error.message,
      };
    }
  }

  /**
   * Get employee by user ID
   * GET /hr/employee/{user_id}
   */
  static async getEmployeeByUserId(userId: string | number): Promise<EmployeeApiResponse> {
    try {
      const response = await authApi.get(`/hr/employee/${userId}`);
      
      // Handle direct employee response
      if (response.data && response.data.id) {
        return {
          success: true,
          employee: response.data,
        };
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to fetch employee by user ID",
        error: error.message,
      };
    }
  }

  /**
   * Update employee
   * PUT /hr/employee/{employee_id}
   */
  static async updateEmployee(
    employeeId: string | number,
    data: UpdateEmployeeFormData
  ): Promise<EmployeeApiResponse> {
    try {
      const response = await authApi.put(`/hr/employee/${employeeId}/`, data);
      return {
        success: true,
        employee: response.data,
        message: "Employee updated successfully",
      };
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to update employee",
        error: error.message,
      };
    }
  }

  /**
   * Delete employee
   * DELETE /hr/employee/{employee_id}
   */
  static async deleteEmployee(employeeId: string | number): Promise<EmployeeApiResponse> {
    try {
      const response = await authApi.delete(`/hr/employee/${employeeId}/`);
      return {
        success: true,
        message: "Employee deleted successfully",
      };
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to delete employee",
        error: error.message,
      };
    }
  }

  /**
   * Get all managers with optional location filtering
   * GET /hr/employee/managers
   */
  static async getManagers(locationId?: string | number): Promise<EmployeeApiResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (locationId !== undefined) {
        queryParams.append("location_id", locationId.toString());
      }

      const url = `/hr/employee/managers/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await authApi.get(url);

      // Handle array response
      if (Array.isArray(response.data)) {
        return {
          success: true,
          employees: response.data,
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
        message: "Failed to fetch managers",
        error: error.message,
      };
    }
  }
}