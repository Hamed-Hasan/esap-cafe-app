import axios, { AxiosHeaders } from "axios";
import {
  CreateFAQFormData,
  FAQApiResponse,
  GetFAQsQueryParams,
  SingleFAQApiResponse,
  UpdateFAQFormData,
} from "../schemas/faq-schemas";

// Get base URL from environment - using the same URL as auth service
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://176.9.16.194:9105/api/v1";

const faqApi = axios.create({
  baseURL: `${API_BASE_URL}/engagement/faq`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let authToken: string | null = null;

// Function to set auth token
export const setFAQAuthToken = (token: string | null) => {
  authToken = token;
};

// Add request interceptor to include auth token
faqApi.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = new AxiosHeaders({
        "Content-Type": "application/json",
      });
    }

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    } else {
      console.log(`FAQ API Request to ${config.url} without token`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
faqApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log("FAQ API: Unauthorized access detected");
      // You can add logout logic here if needed
    }
    return Promise.reject(error);
  }
);

export class FAQService {
  /**
   * Create a new FAQ
   * POST /engagement/faq/
   */
  static async createFAQ(data: CreateFAQFormData): Promise<FAQApiResponse> {
    try {
      console.log("Creating FAQ with data:", data);
      console.log("API endpoint:", `${API_BASE_URL}/engagement/faq/`);

      const response = await faqApi.post<FAQApiResponse>("/", data);
      console.log("FAQ created successfully:", response.data);

      // Check if response.data is a FAQ object (has id field)
      if (
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data
      ) {
        return {
          success: true,
          faq: response.data as any,
          message: "FAQ created successfully",
        };
      }

      return response.data;
    } catch (error: any) {
      console.error("FAQService.createFAQ error:", {
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
        throw new Error(
          "FAQ API endpoint not found. Please check server configuration."
        );
      }
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      if (error.response?.status === 403) {
        throw new Error("You do not have permission to create FAQs.");
      }
      throw new Error(error.message || "Failed to create FAQ");
    }
  }

  /**
   * Get all FAQs with optional filtering and pagination
   * GET /engagement/faq/
   */
  static async getFAQs(params?: GetFAQsQueryParams): Promise<FAQApiResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.skip !== undefined) {
        queryParams.append("skip", params.skip.toString());
      }
      if (params?.limit !== undefined) {
        queryParams.append("limit", params.limit.toString());
      }
      if (params?.search) {
        queryParams.append("search", params.search);
      }
      if (params?.category) {
        queryParams.append("category", params.category);
      }
      if (params?.is_active !== undefined) {
        queryParams.append("is_active", params.is_active.toString());
      }

      const url = `/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await faqApi.get<FAQApiResponse>(url);

      // Handle paginated response structure
      if (response.data && typeof response.data === "object") {
        if ("faqs" in response.data && Array.isArray(response.data.faqs)) {
          return {
            success: true,
            ...response.data,
          };
        }
        // Handle direct array response
        if (Array.isArray(response.data)) {
          return {
            success: true,
            faqs: response.data,
            total: response.data.length,
            page: Math.floor((params?.skip || 0) / (params?.limit || 20)),
            limit: params?.limit || 20,
            has_next: false,
          };
        }
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "FAQService.getFAQs error:",
        error.response?.data || error.message
      );
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      throw new Error("Failed to fetch FAQs");
    }
  }

  /**
   * Get a single FAQ by ID
   * GET /engagement/faq/{faq_id}
   */
  static async getFAQById(
    faqId: string | number
  ): Promise<SingleFAQApiResponse> {
    try {
      const response = await faqApi.get<SingleFAQApiResponse>(`/${faqId}`);

      // Check if response.data is a FAQ object (has id field)
      if (
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data
      ) {
        return {
          success: true,
          faq: response.data as any,
          message: "FAQ retrieved successfully",
        };
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "FAQService.getFAQById error:",
        error.response?.data || error.message
      );
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.response?.status === 404) {
        throw new Error("FAQ not found.");
      }
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      throw new Error("Failed to fetch FAQ");
    }
  }

  /**
   * Update an existing FAQ
   * PUT /engagement/faq/{faq_id}
   */
  static async updateFAQ(
    faqId: string | number,
    data: UpdateFAQFormData
  ): Promise<FAQApiResponse> {
    try {
      console.log("Updating FAQ:", faqId, "with data:", data);

      const response = await faqApi.put<FAQApiResponse>(`/${faqId}`, data);
      console.log("FAQ updated successfully:", response.data);

      // Check if response.data is a FAQ object (has id field)
      if (
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data
      ) {
        return {
          success: true,
          faq: response.data as any,
          message: "FAQ updated successfully",
        };
      }

      return response.data;
    } catch (error: any) {
      console.error("FAQService.updateFAQ error:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        faqId,
      });

      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 404) {
        throw new Error("FAQ not found.");
      }
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      if (error.response?.status === 403) {
        throw new Error("You do not have permission to update this FAQ.");
      }
      throw new Error(error.message || "Failed to update FAQ");
    }
  }

  /**
   * Delete a FAQ by ID
   * DELETE /engagement/faq/{faq_id}
   */
  static async deleteFAQ(faqId: string | number): Promise<FAQApiResponse> {
    try {
      console.log("Deleting FAQ:", faqId);

      const response = await faqApi.delete<FAQApiResponse>(`/${faqId}`);
      console.log("FAQ deleted successfully:", response.data);

      return {
        success: true,
        message: "FAQ deleted successfully",
        ...response.data,
      };
    } catch (error: any) {
      console.error("FAQService.deleteFAQ error:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        faqId,
      });

      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 404) {
        throw new Error("FAQ not found.");
      }
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      if (error.response?.status === 403) {
        throw new Error("You do not have permission to delete this FAQ.");
      }
      throw new Error(error.message || "Failed to delete FAQ");
    }
  }

  /**
   * Search FAQs by text
   */
  static async searchFAQs(
    searchTerm: string,
    params?: Omit<GetFAQsQueryParams, "search">
  ): Promise<FAQApiResponse> {
    return this.getFAQs({
      skip: 0,
      limit: 20,
      ...params,
      search: searchTerm,
    });
  }

  /**
   * Get FAQs by category
   */
  static async getFAQsByCategory(
    category: string,
    params?: Omit<GetFAQsQueryParams, "category">
  ): Promise<FAQApiResponse> {
    return this.getFAQs({
      skip: 0,
      limit: 20,
      ...params,
      category,
    });
  }

  /**
   * Get active FAQs only
   */
  static async getActiveFAQs(
    params?: Omit<GetFAQsQueryParams, "is_active">
  ): Promise<FAQApiResponse> {
    return this.getFAQs({
      skip: 0,
      limit: 20,
      ...params,
      is_active: true,
    });
  }
}
