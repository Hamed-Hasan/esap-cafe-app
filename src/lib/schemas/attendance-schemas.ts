import { z } from "zod";

// Mark attendance schema (for POST /hr/attendance/mark)
export const markAttendanceSchema = z.object({
  employee_id: z.number().min(0, "Employee ID must be a non-negative number"),
  attendance_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  check_in_time: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, "Check-in time must be in ISO format"),
  check_out_time: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, "Check-out time must be in ISO format").optional(),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90").optional(),
  longitude: z.number().min(-180).max(180, "Longitude must be between -180 and 180").optional(),
  bio_check_in: z.boolean(),
  bio_check_out: z.boolean(),
  remarks: z.string().optional(),
});

// Get attendance query parameters schema (for GET /hr/attendance/)
export const getAttendanceQuerySchema = z.object({
  employee_id: z.number().min(0, "Employee ID must be a non-negative number").optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format").optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format").optional(),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY"]).optional(),
  skip: z.number().min(0, "Skip must be a non-negative number").optional(),
  limit: z.number().min(1, "Limit must be at least 1").max(1000, "Limit cannot exceed 1000").optional(),
});

// Get attendance summary query parameters schema (for GET /hr/attendance/employee/{employee_id}/summary)
export const getAttendanceSummaryQuerySchema = z.object({
  month: z.number().min(1, "Month must be at least 1").max(12, "Month cannot exceed 12"),
  year: z.number().min(2020, "Year must be at least 2020"),
});

// Types
export type MarkAttendanceFormData = z.infer<typeof markAttendanceSchema>;
export type GetAttendanceQueryParams = z.infer<typeof getAttendanceQuerySchema>;
export type GetAttendanceSummaryQueryParams = z.infer<typeof getAttendanceSummaryQuerySchema>;

// Employee info interface for nested objects
export interface EmployeeInfo {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
}

// Attendance response interface
export interface AttendanceResponse {
  employee_id: number;
  attendance_date: string;
  check_in_time: string;
  check_out_time: string;
  id: number;
  employee: EmployeeInfo;
  total_hours: string;
  overtime_hours: string;
  late_minutes: number;
  early_leave_minutes: number;
  status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY";
  bio_check_in: boolean;
  bio_check_out: boolean;
  remarks: string;
  is_holiday: boolean;
  created_at: string;
  updated_at: string;
}

// Attendance summary response interface
export interface AttendanceSummaryResponse {
  employee_id: number;
  month: number;
  year: number;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  total_working_hours: number;
  total_overtime_hours: number;
  attendance_percentage: number;
}

// API response types
export interface AttendanceApiResponse {
  success?: boolean;
  message?: string;
  attendance?: AttendanceResponse;
  attendances?: AttendanceResponse[];
  summary?: AttendanceSummaryResponse;
  total?: number;
  // Error response
  detail?: string | any[];
  error?: string;
}

// Process daily attendance request schema (for POST /hr/attendance/process-daily)
export const processDailyAttendanceSchema = z.object({
  process_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
});

export type ProcessDailyAttendanceData = z.infer<typeof processDailyAttendanceSchema>;

// Process daily attendance response (for POST /hr/attendance/process-daily)
export interface ProcessDailyResponse {
  date: string;
  total_employees: number;
  absent_marked: number;
  message: string;
}