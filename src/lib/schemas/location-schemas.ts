import { z } from "zod";

// Create Location Schema
export const createLocationSchema = z.object({
  name: z.string().min(1, "Location name is required").max(255, "Location name must be less than 255 characters"),
  location_type: z.string().min(1, "Location type is required").max(100, "Location type must be less than 100 characters"),
  address: z.string().min(1, "Address is required").max(500, "Address must be less than 500 characters"),
  city: z.string().min(1, "City is required").max(100, "City must be less than 100 characters"),
  state: z.string().min(1, "State is required").max(100, "State must be less than 100 characters"),
  postal_code: z.string().min(1, "Postal code is required").max(20, "Postal code must be less than 20 characters"),
  country: z.string().min(1, "Country is required").max(100, "Country must be less than 100 characters"),
  latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90").optional(),
  longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180").optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
});

// Update Location Schema
export const updateLocationSchema = z.object({
  name: z.string().min(1, "Location name is required").max(255, "Location name must be less than 255 characters").optional(),
  location_type: z.string().min(1, "Location type is required").max(100, "Location type must be less than 100 characters").optional(),
  address: z.string().min(1, "Address is required").max(500, "Address must be less than 500 characters").optional(),
  city: z.string().min(1, "City is required").max(100, "City must be less than 100 characters").optional(),
  state: z.string().min(1, "State is required").max(100, "State must be less than 100 characters").optional(),
  postal_code: z.string().min(1, "Postal code is required").max(20, "Postal code must be less than 20 characters").optional(),
  country: z.string().min(1, "Country is required").max(100, "Country must be less than 100 characters").optional(),
  latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90").optional(),
  longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180").optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  is_active: z.boolean().optional(),
});

// Get Locations Query Schema
export const getLocationsQuerySchema = z.object({
  skip: z.number().int().min(0).optional().default(0),
  limit: z.number().int().min(1).max(1000).optional().default(100),
  location_type: z.string().optional(),
  city: z.string().optional(),
  is_active: z.boolean().optional(),
  search: z.string().optional(),
});

// TypeScript interfaces
export interface LocationResponse {
  id: string;
  name: string;
  location_type: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocationApiResponse {
  data: LocationResponse[];
  total: number;
  skip: number;
  limit: number;
}

// For direct array responses from the API
export type LocationArrayResponse = LocationResponse[];

// Type exports
export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
export type GetLocationsQuery = z.infer<typeof getLocationsQuerySchema>;