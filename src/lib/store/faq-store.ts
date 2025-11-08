import { FAQItem, sampleFAQs } from "../../constants/faq-data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// FAQ state interface
interface FAQState {
  // State
  faqs: FAQItem[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;

  // Actions
  loadFAQs: () => Promise<void>;
  addFAQ: (
    faq: Omit<FAQItem, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateFAQ: (
    id: string,
    updates: Partial<Omit<FAQItem, "id" | "createdAt">>
  ) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  getFAQById: (id: string) => FAQItem | undefined;
  getFilteredFAQs: () => FAQItem[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initializeWithSampleData: () => Promise<void>;
}

// Helper function to generate unique FAQ ID
const generateFAQId = (): string => {
  return `faq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to get current timestamp
const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Create the FAQ store with persistence
export const useFAQStore = create<FAQState>()(
  persist(
    (set, get) => ({
      // Initial state
      faqs: [],
      isLoading: false,
      error: null,
      searchQuery: "",
      selectedCategory: null,

      // Load FAQs from storage or initialize with sample data
      loadFAQs: async () => {
        try {
          set({ isLoading: true, error: null });

          const storedFAQs = await AsyncStorage.getItem("faqs");
          if (storedFAQs) {
            const parsedFAQs = JSON.parse(storedFAQs);
            // Check if stored data has the new structure (title/prompt) or old structure (question/answer)
            const hasNewStructure =
              parsedFAQs.length > 0 && parsedFAQs[0].title !== undefined;
            if (hasNewStructure) {
              set({ faqs: parsedFAQs, isLoading: false });
            } else {
              // Clear old data and initialize with new structure
              await AsyncStorage.removeItem("faqs");
              await get().initializeWithSampleData();
            }
          } else {
            // Initialize with sample data if no stored data exists
            await get().initializeWithSampleData();
          }
        } catch (error) {
          console.error("Error loading FAQs:", error);
          set({
            error: "Failed to load FAQs",
            isLoading: false,
          });
        }
      },

      // Initialize with sample data
      initializeWithSampleData: async () => {
        try {
          set({ isLoading: true, error: null });

          const faqsWithTimestamps = sampleFAQs.map((faq) => ({
            ...faq,
            createdAt: getCurrentTimestamp(),
            updatedAt: getCurrentTimestamp(),
          }));

          await AsyncStorage.setItem(
            "faqs",
            JSON.stringify(faqsWithTimestamps)
          );
          set({ faqs: faqsWithTimestamps, isLoading: false });
        } catch (error) {
          console.error("Error initializing sample data:", error);
          set({
            error: "Failed to initialize FAQ data",
            isLoading: false,
          });
        }
      },

      // Add new FAQ
      addFAQ: async (
        faqData: Omit<FAQItem, "id" | "createdAt" | "updatedAt">
      ) => {
        try {
          set({ isLoading: true, error: null });

          const newFAQ: FAQItem = {
            ...faqData,
            id: generateFAQId(),
            createdAt: getCurrentTimestamp(),
            updatedAt: getCurrentTimestamp(),
          };

          const updatedFAQs = [...get().faqs, newFAQ];
          await AsyncStorage.setItem("faqs", JSON.stringify(updatedFAQs));

          set({ faqs: updatedFAQs, isLoading: false });
        } catch (error) {
          console.error("Error adding FAQ:", error);
          set({
            error: "Failed to add FAQ",
            isLoading: false,
          });
        }
      },

      // Update existing FAQ
      updateFAQ: async (
        id: string,
        updates: Partial<Omit<FAQItem, "id" | "createdAt">>
      ) => {
        try {
          set({ isLoading: true, error: null });

          const updatedFAQs = get().faqs.map((faq) =>
            faq.id === id
              ? { ...faq, ...updates, updatedAt: getCurrentTimestamp() }
              : faq
          );

          await AsyncStorage.setItem("faqs", JSON.stringify(updatedFAQs));
          set({ faqs: updatedFAQs, isLoading: false });
        } catch (error) {
          console.error("Error updating FAQ:", error);
          set({
            error: "Failed to update FAQ",
            isLoading: false,
          });
        }
      },

      // Delete FAQ
      deleteFAQ: async (id: string) => {
        try {
          set({ isLoading: true, error: null });

          const updatedFAQs = get().faqs.filter((faq) => faq.id !== id);
          await AsyncStorage.setItem("faqs", JSON.stringify(updatedFAQs));

          set({ faqs: updatedFAQs, isLoading: false });
        } catch (error) {
          console.error("Error deleting FAQ:", error);
          set({
            error: "Failed to delete FAQ",
            isLoading: false,
          });
        }
      },

      // Get FAQ by ID
      getFAQById: (id: string) => {
        return get().faqs.find((faq) => faq.id === id);
      },

      // Filter prompt templates based on search query and selected category
      getFilteredFAQs: () => {
        const { faqs, searchQuery, selectedCategory } = get();

        return faqs.filter((faq) => {
          const matchesSearch =
            !searchQuery ||
            faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            faq.category.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesCategory =
            !selectedCategory || faq.category === selectedCategory;

          return matchesSearch && matchesCategory;
        });
      },

      // Set search query
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      // Set selected category
      setSelectedCategory: (category: string | null) => {
        set({ selectedCategory: category });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Set error state
      setError: (error: string | null) => {
        set({ error });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "faq-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        faqs: state.faqs,
      }),
    }
  )
);
