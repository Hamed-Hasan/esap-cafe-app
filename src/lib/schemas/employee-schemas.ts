import { z } from "zod";

// Create employee schema (for POST /hr/employee)
export const createEmployeeSchema = z.object({
  user_id: z.number().min(0, "User ID must be a non-negative number"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  hire_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  department_id: z.number().min(0, "Department ID must be a non-negative number"),
  location_id: z.number().min(0, "Location ID must be a non-negative number"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  basic_salary: z.string().min(1, "Basic salary is required"),
  housing_allowance: z.string().min(1, "Housing allowance is required"),
  transport_allowance: z.string().min(1, "Transport allowance is required"),
  is_manager: z.boolean(),
  bio_id: z.string().min(1, "Bio ID is required"),
  profile_image: z.string().optional(),
  emergency_contact: z.string().min(2, "Emergency contact must be at least 2 characters"),
  emergency_phone: z.string().min(10, "Emergency phone must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  is_fingerprint_registered: z.boolean().optional(),
});

// Update employee schema (for PUT /hr/employee/{employee_id})
export const updateEmployeeSchema = z.object({
  user_id: z.number().min(0, "User ID must be a non-negative number").optional(),
  first_name: z.string().min(2, "First name must be at least 2 characters").optional(),
  last_name: z.string().min(2, "Last name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 characters").optional(),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
  hire_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
  department_id: z.number().min(0, "Department ID must be a non-negative number").optional(),
  location_id: z.number().min(0, "Location ID must be a non-negative number").optional(),
  position: z.string().min(2, "Position must be at least 2 characters").optional(),
  basic_salary: z.string().min(1, "Basic salary is required").optional(),
  housing_allowance: z.string().min(1, "Housing allowance is required").optional(),
  transport_allowance: z.string().min(1, "Transport allowance is required").optional(),
  is_manager: z.boolean().optional(),
  bio_id: z.string().min(1, "Bio ID is required").optional(),
  profile_image: z.string().optional(),
  emergency_contact: z.string().min(2, "Emergency contact must be at least 2 characters").optional(),
  emergency_phone: z.string().min(10, "Emergency phone must be at least 10 characters").optional(),
  address: z.string().min(5, "Address must be at least 5 characters").optional(),
  is_fingerprint_registered: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

// Get all employees query parameters schema
export const getEmployeesQuerySchema = z.object({
  skip: z.number().min(0, "Skip must be a non-negative number").optional(),
  limit: z.number().min(1, "Limit must be at least 1").max(1000, "Limit cannot exceed 1000").optional(),
  department_id: z.string().optional(),
  location_id: z.string().optional(),
  is_manager: z.string().optional(),
  is_active: z.string().optional(),
  search: z.string().optional(),
  user_id: z.string().optional(),
});

// Types
export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;
export type GetEmployeesQueryParams = z.infer<typeof getEmployeesQuerySchema>;

// Department and Location interfaces for nested objects
export interface DepartmentInfo {
  id: number;
  name: string;
}

export interface LocationInfo {
  id: number;
  name: string;
  location_type: string;
  city: string;
  latitude: string;
  longitude: string;
}

// Employee response interface
export interface EmployeeResponse {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  hire_date: string;
  department_id: number;
  location_id: number;
  position: string;
  basic_salary: string;
  housing_allowance: string;
  transport_allowance: string;
  is_manager: boolean;
  bio_id: string;
  profile_image: string;
  emergency_contact: string;
  emergency_phone: string;
  address: string;
  id: number;
  employee_id: string;
  is_fingerprint_registered: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  department: DepartmentInfo;
  location: LocationInfo;
}

// API response types
export interface EmployeeApiResponse {
  success?: boolean;
  message?: string;
  employee?: EmployeeResponse;
  employees?: EmployeeResponse[];
  total?: number;
  // Error response
  detail?: string | any[];
  error?: string;
}