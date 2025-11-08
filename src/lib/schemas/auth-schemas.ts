import { z } from "zod";

// Register schema
export const registerSchema = z
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

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// API response types
export interface AuthResponse {
  success?: boolean;
  message?: string;
  // Registration response (direct user object)
  id?: number;
  email?: string;
  username?: string;
  full_name?: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
  is_verified?: boolean;
  is_superuser?: boolean;
  created_at?: string;
  updated_at?: string | null;
  last_login?: string | null;
  roles?: any[];
  // Login response
  user?: {
    id: number;
    email: string;
    username: string;
    full_name: string;
    phone: string;
    address: string;
    is_active: boolean;
    is_verified: boolean;
    is_superuser: boolean;
    created_at: string;
    updated_at: string | null;
    last_login: string | null;
    roles: any[];
  };
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  // Error response
  detail?: string | any[];
  error?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  phone: string;
  address: string;
  is_active: boolean;
  is_verified: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string | null;
  last_login: string | null;
  profile_image: string | null;
  password_reset_token: string | null;
  password_reset_expires: string | null;
  verification_token: string | null;
  verification_expires: string | null;
  is_deleted: boolean;
  hashed_password: string;
  failed_login_attempts: number;
  locked_until: string | null;
}

// Current user response from /auth/me endpoint
export interface CurrentUserResponse {
  user: User;
  roles: any[];
  permissions: any[];
}
