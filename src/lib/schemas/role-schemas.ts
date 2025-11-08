import { z } from "zod";

// Create role schema (for POST /roles)
export const createRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  permissions: z.array(z.string()).optional(),
});

// Update role schema (for PUT /roles/{role_id})
export const updateRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters").optional(),
  description: z.string().min(5, "Description must be at least 5 characters").optional(),
  permissions: z.array(z.string()).optional(),
});

// Get all roles query parameters schema
export const getRolesQuerySchema = z.object({
  skip: z.number().min(0, "Skip must be a non-negative number").optional(),
  limit: z.number().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100").optional(),
  search: z.string().optional(),
});

// Types
export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
export type GetRolesQueryParams = z.infer<typeof getRolesQuerySchema>;

// Role response interfaces
export interface RoleResponse {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
  users_count?: number;
}

// API response types
export interface RoleApiResponse {
  success?: boolean;
  message?: string;
  role?: RoleResponse;
  roles?: RoleResponse[];
  total?: number;
  // Error response
  detail?: string | any[];
  error?: string;
}

// Permission interface
export interface Permission {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
}

// Permissions response
export interface PermissionsApiResponse {
  success?: boolean;
  message?: string;
  permissions?: Permission[];
  // Error response
  detail?: string | any[];
  error?: string;
}