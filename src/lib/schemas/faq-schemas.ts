import { z } from "zod";

// Create FAQ schema (for POST /engagement/faq/)
export const createFAQSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional().default(""),
  priority: z.number().int().min(0).max(10).default(0),
  is_public: z.boolean().default(false),
});

// Update FAQ schema (for PUT /engagement/faq/{faq_id})
export const updateFAQSchema = z.object({
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .optional(),
  answer: z
    .string()
    .min(10, "Answer must be at least 10 characters")
    .optional(),
  category: z.string().min(1, "Category is required").optional(),
  tags: z.string().optional(),
  priority: z.number().int().min(0).max(10).optional(),
  is_public: z.boolean().optional(),
});

// Get FAQs query parameters schema (for GET /engagement/faq/)
export const getFAQsQuerySchema = z.object({
  skip: z
    .number()
    .int()
    .min(0, "Skip must be a non-negative number")
    .optional()
    .default(0),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .optional()
    .default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  is_active: z.boolean().optional(),
});

// Types
export type CreateFAQFormData = z.infer<typeof createFAQSchema>;
export type UpdateFAQFormData = z.infer<typeof updateFAQSchema>;
export type GetFAQsQueryParams = z.infer<typeof getFAQsQuerySchema>;

// FAQ response interfaces
export interface FAQResponse {
  question: string;
  answer: string;
  category: string;
  tags: string;
  priority: number;
  is_public: boolean;
  id: number;
  user_id: number;
  is_active: boolean;
  view_count: number;
  last_viewed_at: string;
  created_at: string;
  updated_at: string;
}

// Paginated FAQ list response
export interface FAQListResponse {
  faqs: FAQResponse[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
}

// API response types
export interface FAQApiResponse {
  success?: boolean;
  message?: string;
  faq?: FAQResponse;
  faqs?: FAQResponse[];
  total?: number;
  page?: number;
  limit?: number;
  has_next?: boolean;
  // Error response
  detail?: string | any[];
  error?: string;
}

// Single FAQ response (for GET /engagement/faq/{faq_id})
export interface SingleFAQApiResponse {
  success?: boolean;
  message?: string;
  faq?: FAQResponse;
  // Error response
  detail?: string | any[];
  error?: string;
}
