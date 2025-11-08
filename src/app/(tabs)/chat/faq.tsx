import {
  FAQItem,
  FAQ_CATEGORIES,
  categoryIcons,
} from "../../../constants/faq-data";
import { useChatStore } from "../../../lib/store/chat-store";
import {
  useFAQs,
  useCreateFAQ,
  useUpdateFAQ,
  useDeleteFAQ,
} from "../../../lib";
import {
  CreateFAQFormData,
  UpdateFAQFormData,
  FAQResponse,
} from "../../../lib";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function FAQ() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  // Local state for search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // API hooks
  const {
    data: faqsData,
    isLoading,
    error,
    refetch,
  } = useFAQs({
    skip: 0,
    limit: 100,
    search: searchQuery || undefined,
    category: selectedCategory || undefined,
    is_active: true,
  });

  const createFAQMutation = useCreateFAQ();
  const updateFAQMutation = useUpdateFAQ();
  const deleteFAQMutation = useDeleteFAQ();

  const faqs = faqsData?.faqs || [];

  const { createNewChat, addMessageToChat, setCurrentChatId } = useChatStore();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    prompt: "",
    description: "",
    category: "GENERAL",
    icon: "info-circle",
  });

  // No need for manual loading - React Query handles this automatically

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error.message || "An error occurred", [
        { text: "OK", onPress: () => {} },
      ]);
    }
  }, [error]);

  const handleCreateFAQ = async () => {
    if (!formData.title.trim() || !formData.prompt.trim()) {
      Alert.alert("Error", "Please fill in title and prompt fields");
      return;
    }

    const createData: CreateFAQFormData = {
      question: formData.title.trim(),
      answer: formData.prompt.trim(),
      category: formData.category,
      tags: formData.description.trim(),
      priority: 1,
      is_public: true,
    };

    try {
      await createFAQMutation.mutateAsync(createData);
      setFormData({
        title: "",
        prompt: "",
        description: "",
        category: "GENERAL",
        icon: "info-circle",
      });
      setIsCreateModalVisible(false);
    } catch (error) {
      // Error handling is done by the mutation hook
    }
  };

  const handleEditFAQ = async () => {
    if (!editingFAQ || !formData.title.trim() || !formData.prompt.trim()) {
      Alert.alert("Error", "Please fill in title and prompt fields");
      return;
    }

    const updateData: UpdateFAQFormData = {
      question: formData.title.trim(),
      answer: formData.prompt.trim(),
      category: formData.category,
      tags: formData.description.trim(),
      priority: 1,
      is_public: true,
    };

    try {
      await updateFAQMutation.mutateAsync({
        faqId: editingFAQ.id,
        data: updateData,
      });
      setFormData({
        title: "",
        prompt: "",
        description: "",
        category: "GENERAL",
        icon: "info-circle",
      });
      setEditingFAQ(null);
      setIsEditModalVisible(false);
    } catch (error) {
      // Error handling is done by the mutation hook
    }
  };

  const handleDeleteFAQ = (faq: FAQResponse) => {
    Alert.alert(
      "Delete Template",
      `Are you sure you want to delete "${faq.question}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFAQMutation.mutateAsync(faq.id.toString());
            } catch (error) {
              // Error handling is done by the mutation hook
            }
          },
        },
      ]
    );
  };

  const openEditModal = (faq: FAQResponse) => {
    setEditingFAQ(faq as any);
    setFormData({
      title: faq.question,
      prompt: faq.answer,
      description: faq.tags || "",
      category: faq.category,
      icon:
        categoryIcons[faq.category as keyof typeof categoryIcons] ||
        "info-circle",
    });
    setIsEditModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      prompt: "",
      description: "",
      category: "GENERAL",
      icon: "info-circle",
    });
    setEditingFAQ(null);
  };

  const handleUsePrompt = (faq: FAQResponse) => {
    try {
      // Create a new chat with the prompt template title
      const newChatId = createNewChat(faq.question);

      // Add the prompt as the first message
      addMessageToChat(newChatId, {
        id: `msg_${Date.now()}`,
        message: faq.answer,
        timestamp: new Date().toISOString(),
        role: "user",
      });

      // Set as current chat and navigate to chat screen
      setCurrentChatId(newChatId);
      router.push("/(tabs)/chat");
    } catch (error) {
      Alert.alert("Error", "Failed to use prompt template");
    }
  };

  // Helper function to convert FAQResponse to FAQItem for compatibility
  const convertToFAQItem = (faq: FAQResponse): FAQItem => {
    return {
      id: faq.id.toString(),
      title: faq.question,
      prompt: faq.answer,
      description: faq.tags,
      category: faq.category,
      icon:
        categoryIcons[faq.category as keyof typeof categoryIcons] ||
        "info-circle",
      createdAt: faq.created_at,
      updatedAt: faq.updated_at,
    };
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      GENERAL: "#A67C52",
      BUSINESS: "#FF6B6B",
      CREATIVE: "#4ECDC4",
      TECHNICAL: "#45B7D1",
      EDUCATIONAL: "#96CEB4",
      PERSONAL: "#DDA0DD",
      MARKETING: "#FFEAA7",
      ANALYSIS: "#FFB6C1",
    };
    return colors[category] || "#A67C52";
  };

  // Filter FAQs locally based on search and category
  const filteredFAQs = faqs.filter((faq: FAQResponse) => {
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.tags && faq.tags.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      !selectedCategory || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const renderFAQForm = () => (
    <View className="p-6">
      <Text
        className={`text-lg font-semibold mb-4 ${
          isDark ? "text-text-secondary-dark" : "text-text-secondary"
        }`}
      >
        {editingFAQ ? "Edit Prompt Template" : "Create New Prompt Template"}
      </Text>

      {/* Title Input */}
      <Text
        className={`text-sm font-medium mb-2 ${
          isDark ? "text-text-secondary-dark" : "text-text-secondary"
        }`}
      >
        Title *
      </Text>
      <TextInput
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
        placeholder="Enter prompt template title"
        placeholderTextColor={isDark ? "#767577" : "#989898"}
        className={`p-3 rounded-lg border mb-4 ${
          isDark
            ? "bg-bg-dark border-border-dark text-text-secondary-dark"
            : "bg-bg-light border-border-light text-text-secondary"
        }`}
        multiline
      />

      {/* Prompt Input */}
      <Text
        className={`text-sm font-medium mb-2 ${
          isDark ? "text-text-secondary-dark" : "text-text-secondary"
        }`}
      >
        Prompt *
      </Text>
      <TextInput
        value={formData.prompt}
        onChangeText={(text) => setFormData({ ...formData, prompt: text })}
        placeholder="Enter AI prompt template (use [PLACEHOLDER] for variables)"
        placeholderTextColor={isDark ? "#767577" : "#989898"}
        className={`p-3 rounded-lg border mb-4 min-h-[100px] ${
          isDark
            ? "bg-bg-dark border-border-dark text-text-secondary-dark"
            : "bg-bg-light border-border-light text-text-secondary"
        }`}
        multiline
        textAlignVertical="top"
      />

      {/* Description Input */}
      <Text
        className={`text-sm font-medium mb-2 ${
          isDark ? "text-text-secondary-dark" : "text-text-secondary"
        }`}
      >
        Description (Optional)
      </Text>
      <TextInput
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        placeholder="Brief description of what this prompt does"
        placeholderTextColor={isDark ? "#767577" : "#989898"}
        className={`p-3 rounded-lg border mb-4 ${
          isDark
            ? "bg-bg-dark border-border-dark text-text-secondary-dark"
            : "bg-bg-light border-border-light text-text-secondary"
        }`}
        multiline
      />

      {/* Category Selection */}
      <Text
        className={`text-sm font-medium mb-2 ${
          isDark ? "text-text-secondary-dark" : "text-text-secondary"
        }`}
      >
        Category
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        <View className="flex-row">
          {FAQ_CATEGORIES.map((category) => {
            const isSelected = formData.category === category;
            return (
              <TouchableOpacity
                key={category}
                onPress={() =>
                  setFormData({
                    ...formData,
                    category,
                    icon: categoryIcons[category],
                  })
                }
                className={`px-3 py-2 rounded-full mr-2 border ${
                  isSelected
                    ? isDark
                      ? "bg-secondary-dark border-secondary-dark"
                      : "bg-secondary border-secondary"
                    : isDark
                    ? "bg-bg-dark border-border-dark"
                    : "bg-bg-light border-border-light"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    isSelected
                      ? "text-white"
                      : isDark
                      ? "text-text-secondary-dark"
                      : "text-text-secondary"
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="flex-row justify-end space-x-3">
        <TouchableOpacity
          onPress={() => {
            resetForm();
            setIsCreateModalVisible(false);
            setIsEditModalVisible(false);
          }}
          className={`px-4 py-2 rounded-lg border ${
            isDark ? "border-border-dark" : "border-border-light"
          }`}
        >
          <Text
            className={`font-medium ${
              isDark ? "text-text-secondary-dark" : "text-text-secondary"
            }`}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={editingFAQ ? handleEditFAQ : handleCreateFAQ}
          disabled={createFAQMutation.isPending || updateFAQMutation.isPending}
          className={`px-4 py-2 rounded-lg ml-3 ${
            isDark ? "bg-secondary-dark" : "bg-secondary"
          }`}
        >
          {createFAQMutation.isPending || updateFAQMutation.isPending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-medium">
              {editingFAQ ? "Update" : "Create"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-bg-dark" : "bg-bg-light"}`}>
      {/* Header */}
      <View
        className={`px-4 py-3 border-b ${
          isDark ? "border-border-dark" : "border-border-light"
        }`}
      >
        <View className="flex-row items-center justify-between">
          <Text
            className={`text-xl font-bold ${
              isDark ? "text-text-secondary-dark" : "text-text-secondary"
            }`}
          >
            AI Prompt Templates
          </Text>
          <TouchableOpacity
            onPress={() => setIsCreateModalVisible(true)}
            className={`p-2 rounded-lg ${
              isDark ? "bg-secondary-dark" : "bg-secondary"
            }`}
          >
            <FontAwesome5 name="magic" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Filter */}
      <View className="p-4">
        {/* Search Bar */}
        <View
          className={`flex-row items-center p-3 rounded-lg border mb-3 ${
            isDark
              ? "bg-bg-dark border-border-dark"
              : "bg-bg-light border-border-light"
          }`}
        >
          <FontAwesome5
            name="search"
            size={16}
            color={isDark ? "#767577" : "#989898"}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search AI prompt templates..."
            placeholderTextColor={isDark ? "#767577" : "#989898"}
            className={`flex-1 ml-3 ${
              isDark ? "text-text-secondary-dark" : "text-text-secondary"
            }`}
          />
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              className={`px-3 py-2 rounded-full mr-2 border ${
                !selectedCategory
                  ? isDark
                    ? "bg-secondary-dark border-secondary-dark"
                    : "bg-secondary border-secondary"
                  : isDark
                  ? "bg-bg-dark border-border-dark"
                  : "bg-bg-light border-border-light"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  !selectedCategory
                    ? "text-white"
                    : isDark
                    ? "text-text-secondary-dark"
                    : "text-text-secondary"
                }`}
              >
                ALL
              </Text>
            </TouchableOpacity>
            {FAQ_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() =>
                    setSelectedCategory(isSelected ? null : category)
                  }
                  className={`px-3 py-2 rounded-full mr-2 border ${
                    isSelected
                      ? isDark
                        ? "bg-secondary-dark border-secondary-dark"
                        : "bg-secondary border-secondary"
                      : isDark
                      ? "bg-bg-dark border-border-dark"
                      : "bg-bg-light border-border-light"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      isSelected
                        ? "text-white"
                        : isDark
                        ? "text-text-secondary-dark"
                        : "text-text-secondary"
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* FAQ List */}
      <ScrollView className="flex-1 px-4">
        {isLoading && faqs.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator
              size="large"
              color={isDark ? "#4EBD7C" : "#4EBD7C"}
            />
            <Text
              className={`mt-2 ${
                isDark ? "text-text-secondary-dark" : "text-text-secondary"
              }`}
            >
              Loading templates...
            </Text>
          </View>
        ) : filteredFAQs.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <FontAwesome5
              name="robot"
              size={48}
              color={isDark ? "#767577" : "#989898"}
            />
            <Text
              className={`mt-4 text-lg font-medium ${
                isDark ? "text-text-secondary-dark" : "text-text-secondary"
              }`}
            >
              {searchQuery || selectedCategory
                ? "No AI templates found"
                : "No AI templates yet"}
            </Text>
            <Text
              className={`mt-2 text-center ${
                isDark ? "text-text-muted-dark" : "text-text-muted"
              }`}
            >
              {searchQuery || selectedCategory
                ? "Try adjusting your search or filter"
                : "Create your first AI prompt template to get started"}
            </Text>
          </View>
        ) : (
          filteredFAQs.map((faq) => {
            const isExpanded = expandedFAQ === faq.id.toString();
            return (
              <View
                key={faq.id}
                className={`mb-3 rounded-xl border ${
                  isDark
                    ? "bg-bg-header-dark border-border-dark"
                    : "bg-bg-header-light border-border-light"
                }`}
                style={{
                  shadowColor: isDark ? "#000" : "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                {/* FAQ Header */}
                <TouchableOpacity
                  onPress={() =>
                    setExpandedFAQ(isExpanded ? null : faq.id.toString())
                  }
                  className="p-4"
                >
                  <View className="flex-row items-start">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3 mt-1"
                      style={{
                        backgroundColor: getCategoryColor(faq.category) + "20",
                      }}
                    >
                      <FontAwesome5
                        name={
                          categoryIcons[
                            faq.category as keyof typeof categoryIcons
                          ] || "info-circle"
                        }
                        size={16}
                        color={getCategoryColor(faq.category)}
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        <Text
                          className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{
                            backgroundColor:
                              getCategoryColor(faq.category) + "20",
                            color: getCategoryColor(faq.category),
                          }}
                        >
                          {faq.category}
                        </Text>
                      </View>
                      <Text
                        className={`text-base font-medium ${
                          isDark
                            ? "text-text-secondary-dark"
                            : "text-text-secondary"
                        }`}
                      >
                        {faq.question}
                      </Text>
                      {faq.tags && (
                        <Text
                          className={`text-sm mt-1 ${
                            isDark
                              ? "text-text-secondary-dark"
                              : "text-text-secondary"
                          }`}
                        >
                          {faq.tags}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row items-center ml-2">
                      <TouchableOpacity
                        onPress={() => handleUsePrompt(faq)}
                        className={`px-3 py-2 mr-2 rounded-lg flex-row items-center ${
                          isDark ? "bg-secondary-dark" : "bg-secondary"
                        }`}
                      >
                        <FontAwesome5 name="magic" size={10} color="white" />
                        <Text className="text-white text-xs font-medium ml-1">
                          Use
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => openEditModal(faq)}
                        className="p-2 mr-1"
                      >
                        <FontAwesome5
                          name="edit"
                          size={14}
                          color={isDark ? "#989898" : "#A67C52"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteFAQ(faq)}
                        className="p-2 mr-1"
                      >
                        <FontAwesome5 name="trash" size={14} color="#FF6B6B" />
                      </TouchableOpacity>
                      <FontAwesome5
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={12}
                        color={isDark ? "#989898" : "#A67C52"}
                      />
                    </View>
                  </View>
                </TouchableOpacity>

                {/* FAQ Answer */}
                {isExpanded && (
                  <View
                    className={`px-4 pb-4 border-t ${
                      isDark ? "border-border-dark" : "border-border-light"
                    }`}
                  >
                    <View
                      className={`mt-3 p-3 rounded-lg ${
                        isDark ? "bg-bg-dark" : "bg-gray-50"
                      }`}
                    >
                      <View className="flex-row items-center mb-2">
                        <FontAwesome5
                          name="code"
                          size={12}
                          color={isDark ? "#4EBD7C" : "#4EBD7C"}
                        />
                        <Text
                          className={`ml-2 text-xs font-medium ${
                            isDark ? "text-secondary-dark" : "text-secondary"
                          }`}
                        >
                          AI Prompt Template
                        </Text>
                      </View>
                      <Text
                        className={`leading-6 font-mono text-sm ${
                          isDark
                            ? "text-text-secondary-dark"
                            : "text-text-secondary"
                        }`}
                      >
                        {faq.answer}
                      </Text>
                    </View>
                    {faq.updated_at && (
                      <Text
                        className={`mt-2 text-xs ${
                          isDark ? "text-text-muted-dark" : "text-text-muted"
                        }`}
                      >
                        Last updated:{" "}
                        {new Date(faq.updated_at).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Create FAQ Modal */}
      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className={`flex-1 ${isDark ? "bg-bg-dark" : "bg-bg-light"}`}>
          <SafeAreaView className="flex-1">{renderFAQForm()}</SafeAreaView>
        </View>
      </Modal>

      {/* Edit FAQ Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className={`flex-1 ${isDark ? "bg-bg-dark" : "bg-bg-light"}`}>
          <SafeAreaView className="flex-1">{renderFAQForm()}</SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
