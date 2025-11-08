import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import {
  CreateFAQFormData,
  FAQApiResponse,
  UpdateFAQFormData
} from "../schemas/faq-schemas";
import { FAQService } from "../services/faq-service";
import { faqQueryKeys } from "./use-faq-queries";

/**
 * Hook for creating a new FAQ
 */
export const useCreateFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFAQFormData) => FAQService.createFAQ(data),
    onSuccess: (response: FAQApiResponse) => {
      if (response.success) {
        // Invalidate and refetch FAQ queries
        queryClient.invalidateQueries({ queryKey: faqQueryKeys.all });

        Alert.alert("Success", response.message || "FAQ created successfully", [
          { text: "OK" },
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to create FAQ", [
          { text: "OK" },
        ]);
      }
    },
    onError: (error: Error) => {
      console.error("Create FAQ error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to create FAQ. Please try again.",
        [{ text: "OK" }]
      );
    },
  });
};

/**
 * Hook for updating an existing FAQ
 */
export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      faqId,
      data,
    }: {
      faqId: string | number;
      data: UpdateFAQFormData;
    }) => FAQService.updateFAQ(faqId, data),
    onSuccess: (response: FAQApiResponse, variables) => {
      if (response.success) {
        // Invalidate and refetch FAQ queries
        queryClient.invalidateQueries({ queryKey: faqQueryKeys.all });
        // Invalidate specific FAQ detail query
        queryClient.invalidateQueries({
          queryKey: faqQueryKeys.detail(variables.faqId),
        });

        Alert.alert("Success", response.message || "FAQ updated successfully", [
          { text: "OK" },
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to update FAQ", [
          { text: "OK" },
        ]);
      }
    },
    onError: (error: Error) => {
      console.error("Update FAQ error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to update FAQ. Please try again.",
        [{ text: "OK" }]
      );
    },
  });
};

/**
 * Hook for deleting a FAQ
 */
export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (faqId: string | number) => FAQService.deleteFAQ(faqId),
    onSuccess: (response: FAQApiResponse, faqId) => {
      if (response.success) {
        // Invalidate and refetch FAQ queries
        queryClient.invalidateQueries({ queryKey: faqQueryKeys.all });
        // Remove specific FAQ from cache
        queryClient.removeQueries({
          queryKey: faqQueryKeys.detail(faqId),
        });

        Alert.alert("Success", response.message || "FAQ deleted successfully", [
          { text: "OK" },
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to delete FAQ", [
          { text: "OK" },
        ]);
      }
    },
    onError: (error: Error) => {
      console.error("Delete FAQ error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to delete FAQ. Please try again.",
        [{ text: "OK" }]
      );
    },
  });
};

/**
 * Hook for creating a FAQ with custom success/error handling
 */
export const useCreateFAQWithCallback = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (response: FAQApiResponse) => void;
  onError?: (error: Error) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFAQFormData) => FAQService.createFAQ(data),
    onSuccess: (response: FAQApiResponse) => {
      if (response.success) {
        // Invalidate and refetch FAQ queries
        queryClient.invalidateQueries({ queryKey: faqQueryKeys.all });

        if (onSuccess) {
          onSuccess(response);
        } else {
          Alert.alert(
            "Success",
            response.message || "FAQ created successfully",
            [{ text: "OK" }]
          );
        }
      } else {
        const error = new Error(response.message || "Failed to create FAQ");
        if (onError) {
          onError(error);
        } else {
          Alert.alert("Error", response.message || "Failed to create FAQ", [
            { text: "OK" },
          ]);
        }
      }
    },
    onError: (error: Error) => {
      console.error("Create FAQ error:", error);
      if (onError) {
        onError(error);
      } else {
        Alert.alert(
          "Error",
          error.message || "Failed to create FAQ. Please try again.",
          [{ text: "OK" }]
        );
      }
    },
  });
};

/**
 * Hook for updating a FAQ with custom success/error handling
 */
export const useUpdateFAQWithCallback = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    response: FAQApiResponse,
    variables: { faqId: string | number; data: UpdateFAQFormData }
  ) => void;
  onError?: (error: Error) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      faqId,
      data,
    }: {
      faqId: string | number;
      data: UpdateFAQFormData;
    }) => FAQService.updateFAQ(faqId, data),
    onSuccess: (response: FAQApiResponse, variables) => {
      if (response.success) {
        // Invalidate and refetch FAQ queries
        queryClient.invalidateQueries({ queryKey: faqQueryKeys.all });
        // Invalidate specific FAQ detail query
        queryClient.invalidateQueries({
          queryKey: faqQueryKeys.detail(variables.faqId),
        });

        if (onSuccess) {
          onSuccess(response, variables);
        } else {
          Alert.alert(
            "Success",
            response.message || "FAQ updated successfully",
            [{ text: "OK" }]
          );
        }
      } else {
        const error = new Error(response.message || "Failed to update FAQ");
        if (onError) {
          onError(error);
        } else {
          Alert.alert("Error", response.message || "Failed to update FAQ", [
            { text: "OK" },
          ]);
        }
      }
    },
    onError: (error: Error) => {
      console.error("Update FAQ error:", error);
      if (onError) {
        onError(error);
      } else {
        Alert.alert(
          "Error",
          error.message || "Failed to update FAQ. Please try again.",
          [{ text: "OK" }]
        );
      }
    },
  });
};

/**
 * Hook for deleting a FAQ with custom success/error handling
 */
export const useDeleteFAQWithCallback = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (response: FAQApiResponse, faqId: string | number) => void;
  onError?: (error: Error) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (faqId: string | number) => FAQService.deleteFAQ(faqId),
    onSuccess: (response: FAQApiResponse, faqId) => {
      if (response.success) {
        // Invalidate and refetch FAQ queries
        queryClient.invalidateQueries({ queryKey: faqQueryKeys.all });
        // Remove specific FAQ from cache
        queryClient.removeQueries({
          queryKey: faqQueryKeys.detail(faqId),
        });

        if (onSuccess) {
          onSuccess(response, faqId);
        } else {
          Alert.alert(
            "Success",
            response.message || "FAQ deleted successfully",
            [{ text: "OK" }]
          );
        }
      } else {
        const error = new Error(response.message || "Failed to delete FAQ");
        if (onError) {
          onError(error);
        } else {
          Alert.alert("Error", response.message || "Failed to delete FAQ", [
            { text: "OK" },
          ]);
        }
      }
    },
    onError: (error: Error) => {
      console.error("Delete FAQ error:", error);
      if (onError) {
        onError(error);
      } else {
        Alert.alert(
          "Error",
          error.message || "Failed to delete FAQ. Please try again.",
          [{ text: "OK" }]
        );
      }
    },
  });
};
