import { z } from "zod";

// Create department schema (for POST /api/v1/organization/department/)
export const createDepartmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

// Update department schema (for PUT /api/v1/organization/department/{department_id})
export const updateDepartmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters").optional(),
  description: z.string().min(5, "Description must be at least 5 characters").optional(),
  is_active: z.boolean().optional(),
});

// Get all departments query parameters schema
export const getDepartmentsQuerySchema = z.object({
  skip: z.number().min(0, "Skip must be a non-negative number").optional(),
  limit: z.number().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100").optional(),
  search: z.string().optional(),
  is_active: z.boolean().optional(),
});

// Types
export type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentFormData = z.infer<typeof updateDepartmentSchema>;
export type GetDepartmentsQueryParams = z.infer<typeof getDepartmentsQuerySchema>;

// Department response interfaces
export interface DepartmentResponse {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API response types
export interface DepartmentApiResponse {
  success?: boolean;
  message?: string;
  department?: DepartmentResponse;
  departments?: DepartmentResponse[];
  total?: number;
  // Error response
  detail?: string | any[];
  error?: string;
}