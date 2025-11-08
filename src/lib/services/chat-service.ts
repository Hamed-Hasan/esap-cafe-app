import {
  ChatMessage,
  mockRestaurantTasks,
  tableUtils,
} from "../../constants/constants";

// AI Response interface for future API integration
export interface AIResponse {
  message: string;
  confidence?: number;
  sources?: string[];
  suggestions?: string[];
  timestamp?: string;
  error?: string;
}

// Chat service for handling AI interactions
export class ChatService {
  private static baseUrl =
    process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
  private static apiKey = process.env.EXPO_PUBLIC_AI_API_KEY;

  /**
   * Generate AI response (currently mock, ready for API integration)
   */
  static async generateAIResponse(
    message: string,
    chatHistory?: ChatMessage[]
  ): Promise<AIResponse> {
    try {
      // Validate input
      if (!message || typeof message !== "string" || !message.trim()) {
        throw new Error("Invalid message: Message cannot be empty");
      }

      if (chatHistory && !Array.isArray(chatHistory)) {
        throw new Error("Invalid chat history: Must be an array");
      }

      // Simulate API delay
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );

      // For now, return mock responses based on message content
      // This can be easily replaced with actual API calls later
      const mockResponse = this.getMockAIResponse(message, chatHistory);

      if (!mockResponse) {
        throw new Error("Failed to generate AI response");
      }

      return {
        ...mockResponse,
        timestamp: new Date().toISOString(),
      };

      // Future API integration would look like:
      // const response = await fetch(`${this.baseUrl}/api/chat`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${this.apiKey}`,
      //   },
      //   body: JSON.stringify({
      //     message,
      //     history: chatHistory,
      //   }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`AI API error: ${response.status}`);
      // }
      //
      // return await response.json();
    } catch (error) {
      console.error("Failed to generate AI response:", error);

      // Return a fallback response instead of throwing
      return {
        message:
          "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        suggestions: [
          "Can you help me with restaurant recommendations?",
          "What are your operating hours?",
          "Do you have any special offers?",
        ],
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Mock AI response generator for development
   */
  private static getMockAIResponse(
    message: string,
    chatHistory?: ChatMessage[]
  ): AIResponse {
    const lowerMessage = message.toLowerCase();

    // Task management progressive flow responses with dynamic data
    if (
      lowerMessage.includes("task") ||
      lowerMessage.includes("pending") ||
      lowerMessage.includes("todo")
    ) {
      return this.generateTaskOverviewResponse();
    }

    if (lowerMessage.includes("more tasks")) {
      return this.generateMoreTasksResponse();
    }

    if (
      lowerMessage.includes("filter by kitchen") ||
      lowerMessage.includes("kitchen tasks")
    ) {
      return this.generateKitchenTasksResponse();
    }

    if (
      lowerMessage.includes("overdue") ||
      lowerMessage.includes("overdue tasks")
    ) {
      return this.generateOverdueTasksResponse();
    }

    if (
      lowerMessage.includes("show completed") ||
      lowerMessage.includes("completed tasks")
    ) {
      return this.generateCompletedTasksResponse();
    }

    // Restaurant-specific responses
    if (
      lowerMessage.includes("menu") ||
      lowerMessage.includes("food") ||
      lowerMessage.includes("dish")
    ) {
      return {
        message:
          "Our menu features a variety of delicious options! We have:\n\n**Main Courses:**\n- Grilled Salmon with herbs\n- Chicken Parmesan\n- Vegetarian Pasta Primavera\n\n**Appetizers:**\n- Bruschetta\n- Calamari Rings\n- Caesar Salad\n\n**Desserts:**\n- Tiramisu\n- Chocolate Lava Cake\n\nWould you like more details about any specific dish?",
        confidence: 0.95,
        suggestions: [
          "Tell me about the salmon",
          "What vegetarian options do you have?",
          "Show me dessert menu",
        ],
      };
    }

    if (
      lowerMessage.includes("hours") ||
      lowerMessage.includes("open") ||
      lowerMessage.includes("close")
    ) {
      return {
        message:
          "Our restaurant hours are:\n\n**Monday - Friday:** 7:00 AM - 9:00 PM\n**Saturday - Sunday:** 8:00 AM - 10:00 PM\n\nWe're open every day of the week! Kitchen closes 30 minutes before closing time.",
        confidence: 0.98,
        suggestions: [
          "Make a reservation",
          "What about holidays?",
          "Do you take walk-ins?",
        ],
      };
    }

    if (
      lowerMessage.includes("reservation") ||
      lowerMessage.includes("book") ||
      lowerMessage.includes("table")
    ) {
      return {
        message:
          "I'd be happy to help with reservations! \n\n**Reservation Options:**\n- Online booking through our website\n- Call us at (555) 123-4567\n- Walk-ins welcome (subject to availability)\n\n**Party Size:** We accommodate groups from 1-20 people\n**Special Events:** Private dining room available\n\nWhat size party and preferred time?",
        confidence: 0.92,
        suggestions: [
          "Book for 4 people tonight",
          "Private dining options",
          "Cancel my reservation",
        ],
      };
    }

    if (
      lowerMessage.includes("delivery") ||
      lowerMessage.includes("takeout") ||
      lowerMessage.includes("order")
    ) {
      return {
        message:
          "Yes, we offer both delivery and takeout! 🚚\n\n**Delivery:**\n- Free delivery on orders over $25\n- Delivery radius: 5 miles\n- Estimated time: 30-45 minutes\n\n**Takeout:**\n- Order online or by phone\n- Ready in 15-20 minutes\n- Curbside pickup available\n\n**Order Methods:**\n- Our website\n- Phone: (555) 123-4567\n- Third-party apps",
        confidence: 0.94,
        suggestions: [
          "Place an order now",
          "What's the delivery fee?",
          "Takeout menu",
        ],
      };
    }

    if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("expensive")
    ) {
      return {
        message:
          "Our pricing is very reasonable! 💰\n\n**Price Ranges:**\n- Appetizers: $8-15\n- Main Courses: $18-32\n- Desserts: $7-12\n- Beverages: $3-8\n\n**Special Offers:**\n- Happy Hour: 3-6 PM (20% off appetizers)\n- Sunday Brunch: $24.99 buffet\n- Student Discount: 10% with valid ID\n\nWe also have daily specials!",
        confidence: 0.89,
        suggestions: [
          "What are today's specials?",
          "Do you have a kids menu?",
          "Tell me about happy hour",
        ],
      };
    }

    if (
      lowerMessage.includes("vegetarian") ||
      lowerMessage.includes("vegan") ||
      lowerMessage.includes("gluten")
    ) {
      return {
        message:
          "We have excellent options for dietary restrictions! 🌱\n\n**Vegetarian Options:**\n- Vegetable Stir Fry\n- Margherita Pizza\n- Quinoa Buddha Bowl\n- Mushroom Risotto\n\n**Vegan Options:**\n- Vegan Burger with sweet potato fries\n- Mediterranean Salad (no cheese)\n- Coconut Curry with tofu\n\n**Gluten-Free:**\n- Grilled fish with vegetables\n- Gluten-free pasta available\n- Salads (specify dressing)\n\nAll dietary restrictions are clearly marked on our menu!",
        confidence: 0.96,
        suggestions: [
          "Show me vegan desserts",
          "Is the kitchen careful about cross-contamination?",
          "Nutritional information",
        ],
      };
    }

    if (
      lowerMessage.includes("location") ||
      lowerMessage.includes("address") ||
      lowerMessage.includes("where")
    ) {
      return {
        message:
          "You can find us at:\n\n📍 **Address:** 123 Main Street, Downtown\n🏙️ **City:** Your City, State 12345\n\n**Landmarks:**\n- Next to the Central Library\n- Across from City Park\n- 2 blocks from Metro Station\n\n**Parking:**\n- Street parking available\n- Public garage 1 block away\n- Valet service on weekends\n\nEasy to find and accessible by public transport!",
        confidence: 0.97,
        suggestions: [
          "Get directions",
          "Parking information",
          "Public transport options",
        ],
      };
    }

    // Default response for general queries
    return {
      message:
        "Hello! I'm your restaurant assistant. I can help you with:\n\n🍽️ **Menu & Food Questions**\n🕒 **Hours & Availability**\n📅 **Reservations & Bookings**\n🚚 **Delivery & Takeout**\n💰 **Pricing & Specials**\n🌱 **Dietary Restrictions**\n📍 **Location & Directions**\n\nWhat would you like to know about our restaurant?",
      confidence: 0.85,
      suggestions: [
        "Show me the menu",
        "What are your hours?",
        "Make a reservation",
        "Delivery options",
      ],
    };
  }

  /**
   * Get suggested follow-up questions based on chat context
   */
  static getSuggestedQuestions(chatHistory: ChatMessage[]): string[] {
    if (chatHistory.length === 0) {
      return [
        "Show me pending tasks",
        "What tasks are overdue?",
        "Filter by kitchen tasks",
        "What's on your menu today?",
        "What are your hours?",
        "Can I make a reservation?",
        "Do you deliver?",
        "Show completed tasks",
        "More tasks",
      ];
    }

    const lastMessage = chatHistory[chatHistory.length - 1];
    const messageContent = lastMessage.message.toLowerCase();

    if (messageContent.includes("menu")) {
      return [
        "Tell me about your specials",
        "What vegetarian options do you have?",
        "Show me dessert options",
        "What's your most popular dish?",
      ];
    }

    if (messageContent.includes("reservation")) {
      return [
        "What times are available tonight?",
        "Do you have private dining?",
        "Can I modify my reservation?",
        "What's your cancellation policy?",
      ];
    }

    if (messageContent.includes("delivery")) {
      return [
        "What's the minimum order?",
        "How long does delivery take?",
        "Do you deliver to my area?",
        "What are the delivery fees?",
      ];
    }

    // Default suggestions
    return [
      "Tell me more about this",
      "What else can you help with?",
      "Show me your contact info",
      "Any current promotions?",
    ];
  }

  /**
   * Validate message before sending
   */
  static validateMessage(message: string): {
    isValid: boolean;
    error?: string;
  } {
    try {
      if (!message || typeof message !== "string") {
        return { isValid: false, error: "Message must be a non-empty string" };
      }

      const trimmedMessage = message.trim();

      if (trimmedMessage.length === 0) {
        return { isValid: false, error: "Message cannot be empty" };
      }

      if (trimmedMessage.length > 1000) {
        return {
          isValid: false,
          error: "Message is too long (maximum 1000 characters)",
        };
      }

      // Check for potentially harmful content (basic validation)
      const suspiciousPatterns = [/<script/i, /javascript:/i, /on\w+=/i];
      if (suspiciousPatterns.some((pattern) => pattern.test(trimmedMessage))) {
        return { isValid: false, error: "Message contains invalid content" };
      }

      // Check for potentially harmful content (basic filter)
      const prohibitedWords = ["spam", "hack", "virus"];
      const lowerMessage = trimmedMessage.toLowerCase();

      for (const word of prohibitedWords) {
        if (lowerMessage.includes(word)) {
          return {
            isValid: false,
            error: "Message contains prohibited content",
          };
        }
      }

      return { isValid: true };
    } catch (error) {
      console.error("Error validating message:", error);
      return { isValid: false, error: "Failed to validate message" };
    }
  }

  /**
   * Format timestamp for chat messages
   */
  static formatTimestamp(date: Date | string = new Date()): string {
    try {
      if (!date) {
        return "Unknown time";
      }

      const dateObj = new Date(date);

      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        console.warn("Invalid timestamp provided:", date);
        return "Invalid time";
      }

      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - dateObj.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      if (diffInMinutes < 10080)
        return `${Math.floor(diffInMinutes / 1440)}d ago`;

      return dateObj.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Unknown time";
    }
  }

  /**
   * Generate dynamic task overview response using real data
   */
  private static generateTaskOverviewResponse(): AIResponse {
    const urgentTasks = tableUtils
      .filterTasks(mockRestaurantTasks, { priority: "urgent" })
      .slice(0, 8);
    const overdueTasks = tableUtils.filterTasks(mockRestaurantTasks, {
      status: "overdue",
    });
    const stats = tableUtils.getTaskStats(mockRestaurantTasks);

    const headers = ["Priority", "Task", "Assigned To", "Due Time", "Location"];
    const rows = urgentTasks.map((task) => [
      task.status === "overdue" ? "🔴 **OVERDUE**" : "🟡 **URGENT**",
      task.title,
      task.assignedTo,
      task.dueTime,
      task.location,
    ]);

    const table = tableUtils.generateTable(headers, rows, [
      "center",
      "left",
      "left",
      "center",
      "left",
    ]);

    const message = `**📋 Task Overview**

You have **${stats.total} pending tasks** across all departments. Here are the **${urgentTasks.length} most urgent ones** that need immediate attention:

${table}

### 🚨 **Critical Alert**
**${overdueTasks.length} tasks are overdue** - would you like to see those first?

---

### 💬 **What would you like to do next?**
- Say **"more tasks"** to see additional pending items
- Say **"filter by kitchen"** to see only kitchen tasks
- Say **"show completed"** to view finished tasks
- Say **"overdue tasks"** to focus on urgent items`;

    return {
      message,
      confidence: 0.95,
      suggestions: [
        "more tasks",
        "filter by kitchen",
        "show completed",
        "overdue tasks",
      ],
    };
  }

  /**
   * Generate more tasks response with real data
   */
  private static generateMoreTasksResponse(): AIResponse {
    const highPriorityTasks = tableUtils
      .filterTasks(mockRestaurantTasks, { priority: "high" })
      .slice(0, 12);
    const stats = tableUtils.getTaskStats(mockRestaurantTasks);

    const headers = [
      "Priority",
      "Task",
      "Department",
      "Assigned To",
      "Due Time",
    ];
    const rows = highPriorityTasks.map((task) => [
      "🟠 **HIGH**",
      task.title,
      task.category.charAt(0).toUpperCase() + task.category.slice(1),
      task.assignedTo,
      task.dueTime,
    ]);

    const table = tableUtils.generateTable(headers, rows, [
      "center",
      "left",
      "center",
      "left",
      "center",
    ]);

    const message = `**📋 Additional Tasks (9-20)**

Here are the next **${
      highPriorityTasks.length
    } high-priority tasks** in your queue:

${table}

**Remaining tasks:** ${
      stats.total - 8 - highPriorityTasks.length
    } more items in queue

### 🎯 **Quick Actions:**
- **"filter by [department]"** - Focus on specific area
- **"show overdue"** - See all overdue items
- **"assign to [person]"** - View tasks by staff member`;

    return {
      message,
      confidence: 0.92,
      suggestions: [
        "filter by kitchen",
        "show overdue",
        "assign tasks",
        "view all tasks",
      ],
    };
  }

  /**
   * Generate kitchen tasks response with real data
   */
  private static generateKitchenTasksResponse(): AIResponse {
    const kitchenTasks = tableUtils.filterTasks(mockRestaurantTasks, {
      category: "kitchen",
    });
    const overdueKitchen = kitchenTasks.filter(
      (task) => task.status === "overdue"
    );
    const urgentKitchen = kitchenTasks.filter(
      (task) => task.priority === "urgent" && task.status !== "overdue"
    );

    const overdueHeaders = ["Task", "Assigned To", "Due Time", "Status"];
    const overdueRows = overdueKitchen.map((task) => [
      task.title,
      task.assignedTo,
      task.dueTime,
      "🔴 **Overdue**",
    ]);

    const urgentHeaders = ["Task", "Assigned To", "Due Time", "Duration"];
    const urgentRows = urgentKitchen
      .slice(0, 4)
      .map((task) => [
        task.title,
        task.assignedTo,
        task.dueTime,
        task.estimatedDuration,
      ]);

    const overdueTable = tableUtils.generateTable(overdueHeaders, overdueRows);
    const urgentTable = tableUtils.generateTable(urgentHeaders, urgentRows);

    // Get staff workload
    const staffWorkload = kitchenTasks.reduce((acc, task) => {
      acc[task.assignedTo] = (acc[task.assignedTo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const workloadText = Object.entries(staffWorkload)
      .map(([staff, count]) => `- ${staff}: ${count} tasks`)
      .join("\n");

    const message = `**🍳 Kitchen Department Tasks**

Filtered view: **${kitchenTasks.length} kitchen tasks** out of ${mockRestaurantTasks.length} total

### 🔴 **Overdue Kitchen Tasks (${overdueKitchen.length})**
${overdueTable}

### 🟡 **Urgent Kitchen Tasks (${urgentKitchen.length})**
${urgentTable}

**Kitchen Staff Workload:**
${workloadText}`;

    return {
      message,
      confidence: 0.94,
      suggestions: [
        "show all kitchen",
        "reassign overdue",
        "kitchen priorities",
        "back to overview",
      ],
    };
  }

  /**
   * Generate overdue tasks response with real data
   */
  private static generateOverdueTasksResponse(): AIResponse {
    const overdueTasks = tableUtils.filterTasks(mockRestaurantTasks, {
      status: "overdue",
    });
    const criticalOverdue = overdueTasks.slice(0, 3);

    const headers = ["Task", "Department", "Assigned To", "Due Time", "Impact"];
    const rows = criticalOverdue.map((task) => [
      task.title,
      task.category.charAt(0).toUpperCase() + task.category.slice(1),
      task.assignedTo,
      task.dueTime,
      task.category === "cleaning"
        ? "🧽 **Service impact**"
        : task.category === "kitchen"
        ? "🍽️ **Food safety risk**"
        : task.category === "delivery"
        ? "🚚 **Customer impact**"
        : "⚠️ **Operational risk**",
    ]);

    const table = tableUtils.generateTable(headers, rows, [
      "left",
      "center",
      "left",
      "center",
      "left",
    ]);

    const message = `**🚨 OVERDUE TASKS - IMMEDIATE ACTION REQUIRED**

**${overdueTasks.length} tasks are past their deadline** and need urgent attention:

### 🔴 **Critical Overdue Tasks**
${table}

### 🎯 **Recommended Actions:**
1. **Reassign** overloaded staff tasks to available team members
2. **Prioritize** food safety and customer-facing items
3. **Delegate** cleaning tasks to available staff

**Would you like me to suggest task reassignments?**`;

    return {
      message,
      confidence: 0.96,
      suggestions: [
        "reassign tasks",
        "prioritize by impact",
        "call in backup staff",
        "mark completed",
      ],
    };
  }

  /**
   * Generate completed tasks response with real data
   */
  private static generateCompletedTasksResponse(): AIResponse {
    const completedTasks = tableUtils.filterTasks(mockRestaurantTasks, {
      status: "completed",
    });
    const recentCompleted = completedTasks.slice(0, 3);

    const headers = ["Task", "Completed By", "Time", "Duration"];
    const rows = recentCompleted.map((task) => [
      `✅ ${task.title}`,
      task.assignedTo,
      task.dueTime,
      task.estimatedDuration,
    ]);

    const table = tableUtils.generateTable(headers, rows);

    // Calculate staff performance
    const staffPerformance = completedTasks.reduce((acc, task) => {
      acc[task.assignedTo] = (acc[task.assignedTo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPerformers = Object.entries(staffPerformance)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([staff, count]) => `- **${staff}**: ${count} tasks completed`)
      .join("\n");

    const message = `**✅ COMPLETED TASKS TODAY**

**${completedTasks.length} tasks completed** out of ${mockRestaurantTasks.length} total assigned today. Great progress!

### 🏆 **Recent Completions**
${table}

### 🌟 **Top Performers Today**
${topPerformers}

**Productivity Trend:** 📈 **+15%** vs yesterday`;

    return {
      message,
      confidence: 0.93,
      suggestions: [
        "view pending tasks",
        "performance report",
        "assign new tasks",
        "team recognition",
      ],
    };
  }
}
