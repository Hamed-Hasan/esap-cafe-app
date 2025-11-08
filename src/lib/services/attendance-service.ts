import axios from "axios";
import {
  MarkAttendanceFormData,
  GetAttendanceQueryParams,
  GetAttendanceSummaryQueryParams,
  AttendanceApiResponse,
  ProcessDailyResponse,
} from "../schemas/attendance-schemas";

// Get base URL from environment
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://176.9.16.194:9105/api/v1";

// Create axios instance for attendance APIs (no authentication required)
const attendanceApi = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export class AttendanceService {
  /**
   * Mark attendance
   * POST /hr/attendance/mark
   */
  static async markAttendance(data: MarkAttendanceFormData): Promise<AttendanceApiResponse> {
    try {
      const response = await attendanceApi.post("/hr/attendance/mark", data);

      // Check if response.data is an attendance object (has id field)
      if (response.data && response.data.id) {
        return {
          success: true,
          attendance: response.data,
          message: "Attendance marked successfully",
        };
      }

      // If response already has success/error structure, return as is
      return response.data;
    } catch (error: any) {
      console.error(
        "Mark attendance error:",
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
   * Get attendance records with optional filtering
   * GET /hr/attendance/
   */
  static async getAttendance(
    params?: GetAttendanceQueryParams
  ): Promise<AttendanceApiResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.employee_id !== undefined) {
        queryParams.append("employee_id", params.employee_id.toString());
      }
      if (params?.start_date) {
        queryParams.append("start_date", params.start_date);
      }
      if (params?.end_date) {
        queryParams.append("end_date", params.end_date);
      }
      if (params?.status) {
        queryParams.append("status", params.status);
      }
      if (params?.skip !== undefined) {
        queryParams.append("skip", params.skip.toString());
      }
      if (params?.limit !== undefined) {
        queryParams.append("limit", params.limit.toString());
      }

      const url = `/hr/attendance/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await attendanceApi.get(url);

      // Handle both array response and paginated response
      if (Array.isArray(response.data)) {
        return {
          success: true,
          attendances: response.data,
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
        message: "Failed to fetch attendance records",
        error: error.message,
      };
    }
  }

  /**
   * Get attendance summary for an employee
   * GET /hr/attendance/employee/{employee_id}/summary
   */
  static async getAttendanceSummary(
    employeeId: number,
    params: GetAttendanceSummaryQueryParams
  ): Promise<AttendanceApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("month", params.month.toString());
      queryParams.append("year", params.year.toString());

      const url = `/hr/attendance/employee/${employeeId}/summary?${queryParams.toString()}`;
      const response = await attendanceApi.get(url);

      // Check if response.data has summary structure
      if (response.data && typeof response.data.employee_id === 'number') {
        return {
          success: true,
          summary: response.data,
          message: "Attendance summary retrieved successfully",
        };
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Failed to fetch attendance summary",
        error: error.message,
      };
    }
  }

  /**
   * Process daily attendance
   * POST /hr/attendance/process-daily
   */
  static async processDailyAttendance(processDate: string): Promise<ProcessDailyResponse> {
    try {
      const response = await attendanceApi.post<ProcessDailyResponse>(
        `/hr/attendance/process-daily?process_date=${processDate}`
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Process daily attendance error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

export { attendanceApi };