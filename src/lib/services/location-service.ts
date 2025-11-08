import axios, { AxiosHeaders } from "axios";
import {
  CreateLocationInput,
  GetLocationsQuery,
  LocationArrayResponse,
  LocationResponse,
  UpdateLocationInput
} from "../schemas/location-schemas";

// Get base URL from environment - using the same URL as auth service
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://176.9.16.194:9105/api/v1";

const locationApi = axios.create({
  baseURL: `${API_BASE_URL}/organization/location`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let authToken: string | null = null;

// Function to set auth token
export const setLocationAuthToken = (token: string | null) => {
  authToken = token;
  // console.log("Location auth token updated:", token ? "[TOKEN_SET]" : "[TOKEN_CLEARED]");
};

// Add request interceptor to include auth token
locationApi.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = new AxiosHeaders({
        "Content-Type": "application/json",
      });
    }

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    } else {
      console.log(`Location API Request to ${config.url} without token`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let logoutCallback: (() => void) | null = null;

export const setLocationLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// Add response interceptor for error handling
locationApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setLocationAuthToken(null);
      if (logoutCallback) {
        logoutCallback();
      }
    }
    return Promise.reject(error);
  }
);

export class LocationService {
  /**
   * Create a new location
   */
  static async createLocation(
    data: CreateLocationInput
  ): Promise<LocationResponse> {
    try {
      console.log('Creating location with data:', data);
      console.log('API endpoint:', `${API_BASE_URL}/organization/location/`);
      
      const response = await locationApi.post<LocationResponse>("/", data);
      console.log('Location created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('LocationService.createLocation error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
      });
      
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 404) {
        throw new Error('Location API endpoint not found. Please check server configuration.');
      }
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to create locations.');
      }
      throw new Error(error.message || "Failed to create location");
    }
  }

  /**
   * Get all locations with optional filtering
   */
  static async getLocations(
    params?: GetLocationsQuery
  ): Promise<LocationArrayResponse> {
    try {
      const response = await locationApi.get<LocationArrayResponse>("/", {
        params,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Failed to fetch locations");
    }
  }

  /**
   * Get location by ID
   */
  static async getLocationById(id: string): Promise<LocationResponse> {
    try {
      const response = await locationApi.get<LocationResponse>(`/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Location not found");
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Failed to fetch location");
    }
  }

  /**
   * Update location by ID
   */
  static async updateLocation(
    id: string,
    data: UpdateLocationInput
  ): Promise<LocationResponse> {
    try {
      const response = await locationApi.put<LocationResponse>(`/${id}`, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Location not found");
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Failed to update location");
    }
  }

  /**
   * Delete location by ID
   */
  static async deleteLocation(id: string): Promise<void> {
    try {
      await locationApi.delete(`/${id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Location not found");
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Failed to delete location");
    }
  }

  /**
   * Get active locations only
   */
  static async getActiveLocations(
    params?: Omit<GetLocationsQuery, "is_active">
  ): Promise<LocationArrayResponse> {
    return this.getLocations({
      skip: 0,
      limit: 100,
      ...params,
      is_active: true,
    });
  }

  /**
   * Get locations by type
   */
  static async getLocationsByType(
    locationType: string,
    params?: Omit<GetLocationsQuery, "location_type">
  ): Promise<LocationArrayResponse> {
    return this.getLocations({
      skip: 0,
      limit: 100,
      ...params,
      location_type: locationType,
    });
  }

  /**
   * Get locations by city
   */
  static async getLocationsByCity(
    city: string,
    params?: Omit<GetLocationsQuery, "city">
  ): Promise<LocationArrayResponse> {
    return this.getLocations({ skip: 0, limit: 100, ...params, city });
  }

  /**
   * Search locations
   */
  static async searchLocations(
    searchTerm: string,
    params?: Omit<GetLocationsQuery, "search">
  ): Promise<LocationArrayResponse> {
    return this.getLocations({
      skip: 0,
      limit: 100,
      ...params,
      search: searchTerm,
    });
  }

  /**
   * Toggle location active status
   */
  static async toggleLocationStatus(id: string): Promise<LocationResponse> {
    try {
      // First get the current location to know its status
      const currentLocation = await this.getLocationById(id);
      // Then update with opposite status
      return await this.updateLocation(id, {
        is_active: !currentLocation.is_active,
      });
    } catch (error: any) {
      throw new Error("Failed to toggle location status");
    }
  }

  // ===== BRANCHES API METHODS =====

  /**
   * Get all branches with optional filtering
   */
  static async getBranches(
    params?: GetLocationsQuery
  ): Promise<LocationArrayResponse> {
    try {
      const response = await locationApi.get<LocationArrayResponse>("/branches", {
        params,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Failed to fetch branches");
    }
  }

  /**
   * Get active branches only
   */
  static async getActiveBranches(
    params?: Omit<GetLocationsQuery, "is_active">
  ): Promise<LocationArrayResponse> {
    return this.getBranches({
      skip: 0,
      limit: 100,
      ...params,
      is_active: true,
    });
  }

  // ===== WAREHOUSES API METHODS =====

  /**
   * Get all warehouses with optional filtering
   */
  static async getWarehouses(
    params?: GetLocationsQuery
  ): Promise<LocationArrayResponse> {
    try {
      const response = await locationApi.get<LocationArrayResponse>(
        "/warehouses",
        { params }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Failed to fetch warehouses");
    }
  }

  /**
   * Get active warehouses only
   */
  static async getActiveWarehouses(
    params?: Omit<GetLocationsQuery, "is_active">
  ): Promise<LocationArrayResponse> {
    return this.getWarehouses({
      skip: 0,
      limit: 100,
      ...params,
      is_active: true,
    });
  }
}
