import { z } from "zod";

// Create shift type schema (for POST /hr/shift/types)
export const createShiftTypeSchema = z.object({
  name: z.string().min(2, "Shift type name must be at least 2 characters"),
  start_time: z.string().regex(/^\d{2}:\d{2}:\d{2}\.\d{3}Z$/, "Start time must be in HH:MM:SS.sssZ format"),
  end_time: z.string().regex(/^\d{2}:\d{2}:\d{2}\.\d{3}Z$/, "End time must be in HH:MM:SS.sssZ format"),
  break_duration_minutes: z.number().min(0, "Break duration must be a non-negative number"),
  late_grace_minutes: z.number().min(0, "Late grace minutes must be a non-negative number").default(15),
});

// Update shift type schema (for PUT /hr/shift/types/{shift_type_id})
export const updateShiftTypeSchema = z.object({
  name: z.string().min(2, "Shift type name must be at least 2 characters").optional(),
  start_time: z.string().regex(/^\d{2}:\d{2}:\d{2}\.\d{3}Z$/, "Start time must be in HH:MM:SS.sssZ format").optional(),
  end_time: z.string().regex(/^\d{2}:\d{2}:\d{2}\.\d{3}Z$/, "End time must be in HH:MM:SS.sssZ format").optional(),
  break_duration_minutes: z.number().min(0, "Break duration must be a non-negative number").optional(),
  late_grace_minutes: z.number().min(0, "Late grace minutes must be a non-negative number").optional(),
  is_active: z.boolean().optional(),
});

// Get shift types query parameters schema
export const getShiftTypesQuerySchema = z.object({
  is_active: z.boolean().optional(),
});

// Assign shift schema (for POST /hr/shift/assign)
export const assignShiftSchema = z.object({
  employee_id: z.number().min(0, "Employee ID must be a non-negative number"),
  shift_type_id: z.number().min(0, "Shift type ID must be a non-negative number"),
  effective_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Effective date must be in YYYY-MM-DD format"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
});

// Types
export type CreateShiftTypeFormData = z.infer<typeof createShiftTypeSchema>;
export type UpdateShiftTypeFormData = z.infer<typeof updateShiftTypeSchema>;
export type GetShiftTypesQueryParams = z.infer<typeof getShiftTypesQuerySchema>;
export type AssignShiftFormData = z.infer<typeof assignShiftSchema>;

// Shift type response interface
export interface ShiftTypeResponse {
  name: string;
  start_time: string;
  end_time: string;
  break_duration_minutes: number;
  late_grace_minutes: number;
  id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Shift assignment response interface
export interface ShiftAssignmentResponse {
  employee_id: number;
  shift_type_id: number;
  effective_date: string;
  end_date: string;
  id: number;
  shift_type: ShiftTypeResponse;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API response types
export interface ShiftTypeApiResponse {
  success?: boolean;
  message?: string;
  shift_type?: ShiftTypeResponse;
  shift_types?: ShiftTypeResponse[];
  total?: number;
  // Error response
  detail?: string | any[];
  error?: string;
}

export interface ShiftAssignmentApiResponse {
  success?: boolean;
  message?: string;
  shift_assignment?: ShiftAssignmentResponse;
  shift_assignments?: ShiftAssignmentResponse[];
  total?: number;
  // Error response
  detail?: string | any[];
  error?: string;
}