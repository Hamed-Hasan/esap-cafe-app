import { z } from "zod";

// Create user schema (for POST /users)
export const createUserSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirm_password: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

// Update user schema (for PUT /users/{user_id})
export const updateUserSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 characters").optional(),
  address: z.string().min(5, "Address must be at least 5 characters").optional(),
  profile_image: z.string().url("Profile image must be a valid URL").optional(),
});

// Get all users query parameters schema
export const getUsersQuerySchema = z.object({
  skip: z.number().min(0, "Skip must be a non-negative number").optional(),
  limit: z.number().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100").optional(),
  search: z.string().optional(),
});

// Assign role schema (for POST /users/{user_id}/assign-role)
export const assignRoleSchema = z.object({
  user_id: z.union([z.string(), z.number()]),
  role_name: z.string().min(1, "Role name is required"),
});

// Remove role schema (for DELETE /users/{user_id}/remove-role)
export const removeRoleSchema = z.object({
  user_id: z.union([z.string(), z.number()]),
  role_name: z.string().min(1, "Role name is required"),
});

// Types
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type GetUsersQueryParams = z.infer<typeof getUsersQuerySchema>;
export type AssignRoleFormData = z.infer<typeof assignRoleSchema>;
export type RemoveRoleFormData = z.infer<typeof removeRoleSchema>;

// User response interfaces
export interface UserResponse {
  email: string;
  username: string;
  full_name: string;
  phone: string;
  address: string;
  id: number;
  is_active: boolean;
  is_verified: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  roles: any[];
  profile_image?: string;
}

// API response types
export interface UserApiResponse {
  success?: boolean;
  message?: string;
  user?: UserResponse;
  users?: UserResponse[];
  total?: number;
  // Error response
  detail?: string | any[];
  error?: string;
}

// Role operation response
export interface RoleOperationResponse {
  success: boolean;
  message: string;
  user?: UserResponse;
  // Error response
  detail?: string | any[];
  error?: string;
}