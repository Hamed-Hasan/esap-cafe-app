import {
  CreateShiftTypeFormData,
  UpdateShiftTypeFormData,
  GetShiftTypesQueryParams,
  AssignShiftFormData,
  ShiftTypeApiResponse,
  ShiftAssignmentApiResponse,
} from "../schemas/shift-schemas";
import { authApi } from "./auth-service";

export class ShiftService {
  /**
   * Create a new shift type
   * POST /hr/shift/types
   */
  static async createShiftType(data: CreateShiftTypeFormData): Promise<ShiftTypeApiResponse> {
    try {
      const response = await authApi.post("/hr/shift/types", data);

      // Check if response.data is a shift type object (has id field)
      if (response.data && response.data.id) {
        return {
          success: true,
          shift_type: response.data,
          message: "Shift type created successfully",
        };
      }

      // If response already has success/error structure, return as is
      return response.data;
    } catch (error: any) {
      console.error(
        "Shift type creation error:",
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
   * Get all shift types with optional filtering
   * GET /hr/shift/types
   */
  static async getShiftTypes(
    params?: GetShiftTypesQueryParams
  ): Promise<ShiftTypeApiResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.is_active !== undefined) {
        queryParams.append("is_active", params.is_active.toString());
      }

      const url = `/hr/shift/types${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await authApi.get(url);

      // Handle array response
      if (Array.isArray(response.data)) {
        return {
          success: true,
          shift_types: response.data,
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
        message: "Failed to fetch shift types",
        error: error.message,
      };
    }
  }

  /**
   * Update a shift type
   * PUT /hr/shift/types/{shift_type_id}
   */
  static async updateShiftType(
    shiftTypeId: string | number,
    data: UpdateShiftTypeFormData
  ): Promise<ShiftTypeApiResponse> {
    try {
      const response = await authApi.put(`/hr/shift/types/${shiftTypeId}`, data);

      // Check if response.data is a shift type object (has id field)
      if (response.data && response.data.id) {
        return {
          success: true,
          shift_type: response.data,
          message: "Shift type updated successfully",
        };
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "Shift type update error:",
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
   * Assign shift to employee
   * POST /hr/shift/assign
   */
  static async assignShift(data: AssignShiftFormData): Promise<ShiftAssignmentApiResponse> {
    try {
      const response = await authApi.post("/hr/shift/assign", data);

      // Check if response.data is a shift assignment object (has id field)
      if (response.data && response.data.id) {
        return {
          success: true,
          shift_assignment: response.data,
          message: "Shift assigned successfully",
        };
      }

      // If response already has success/error structure, return as is
      return response.data;
    } catch (error: any) {
      console.error(
        "Shift assignment error:",
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
   * Get current shift assignment for employee
   * GET /hr/shift/employee/{employee_id}/current
   */
  static async getCurrentShiftByEmployee(
    employeeId: string | number
  ): Promise<ShiftAssignmentApiResponse> {
    try {
      const response = await authApi.get(`/hr/shift/employee/${employeeId}/current`);

      // Check if response.data is a shift assignment object (has id field)
      if (response.data && response.data.id) {
        return {
          success: true,
          shift_assignment: response.data,
        };
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to fetch current shift assignment",
        error: error.message,
      };
    }
  }

  /**
   * Get shift assignment history for employee
   * GET /hr/shift/employee/{employee_id}/history
   */
  static async getShiftHistoryByEmployee(
    employeeId: string | number
  ): Promise<ShiftAssignmentApiResponse> {
    try {
      const response = await authApi.get(`/hr/shift/employee/${employeeId}/history`);

      // Handle array response
      if (Array.isArray(response.data)) {
        return {
          success: true,
          shift_assignments: response.data,
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
        message: "Failed to fetch shift assignment history",
        error: error.message,
      };
    }
  }

  /**
   * Get active shift types only
   */
  static async getActiveShiftTypes(): Promise<ShiftTypeApiResponse> {
    return this.getShiftTypes({ is_active: true });
  }
}