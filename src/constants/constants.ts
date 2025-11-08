// Message type definition
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  message: string;
  timestamp?: string;
}

// Chat history item type
export interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  category: string;
  icon: string;
  messages?: ChatMessage[];
}

// Restaurant FAQ data
export const restaurantFAQs = [
  {
    id: "1",
    icon: "clock",
    category: "HOURS",
    question: "What are your operating hours?",
    answer: "We are open Monday-Friday 7AM-9PM, Saturday-Sunday 8AM-10PM",
  },
  {
    id: "2",
    icon: "truck",
    category: "DELIVERY",
    question: "Do you offer delivery services?",
    answer: "Yes! We deliver within 5 miles. Free delivery on orders over $25.",
  },
  {
    id: "3",
    icon: "utensils",
    category: "MENU",
    question: "Do you have vegetarian options?",
    answer:
      "Absolutely! We have a wide variety of vegetarian and vegan dishes.",
  },
  {
    id: "4",
    icon: "calendar-check",
    category: "RESERVATIONS",
    question: "Can I make a reservation?",
    answer: "Yes, you can book a table online or call us at (555) 123-4567.",
  },
  {
    id: "5",
    icon: "wifi",
    category: "AMENITIES",
    question: "Do you have free WiFi?",
    answer: "Yes, we offer complimentary WiFi for all our customers.",
  },
  {
    id: "6",
    icon: "credit-card",
    category: "PAYMENT",
    question: "What payment methods do you accept?",
    answer: "We accept cash, all major credit cards, and mobile payments.",
  },
];

// Restaurant chat history data with actual messages
export const restaurantChatHistory = [
  {
    id: "1",
    title: "Weekend Brunch Menu",
    // preview: "Asked about weekend specials and brunch options",
    // timestamp: "2 hours ago",
    // category: "Menu",
    // icon: "utensils",
    messages: [
      {
        id: "1-1",
        role: "user" as const,
        message: "What special brunch items do you have on weekends?",
      },
      {
        id: "1-2",
        role: "assistant" as const,
        message:
          "Our **weekend brunch** features:\n\n- **Eggs Benedict** with smoked salmon\n- Fluffy pancakes with seasonal berries\n- Avocado toast with poached eggs\n- Our signature breakfast burrito\n\nWe also have `bottomless mimosas`!",
      },
      {
        id: "1-3",
        role: "user" as const,
        message: "What time does brunch start on Saturday?",
      },
      {
        id: "1-4",
        role: "assistant" as const,
        message:
          "Weekend brunch starts at 9 AM and runs until 3 PM on both Saturday and Sunday. I recommend making a reservation as we get quite busy!",
      },
    ],
  },
  {
    id: "2",
    title: "Birthday Party Reservation",
    preview: "Discussed private dining for 12 people",
    timestamp: "1 day ago",
    category: "Reservations",
    icon: "calendar-alt",
    messages: [
      {
        id: "2-1",
        role: "user" as const,
        message:
          "I need to book a table for my daughter's birthday party. We'll be 12 people including 4 kids.",
      },
      {
        id: "2-2",
        role: "assistant" as const,
        message:
          "**Perfect!** We have a private dining area that can accommodate **12 guests**.\n\n### Birthday Package Includes:\n- Special decorations\n- Complimentary dessert for the birthday girl\n- Private dining space\n\nWhen are you planning to celebrate?",
      },
      {
        id: "2-3",
        role: "user" as const,
        message: "Next Saturday at 6 PM. Do you have a kids menu?",
      },
      {
        id: "2-4",
        role: "assistant" as const,
        message:
          "Yes, we have a dedicated kids menu with favorites like mac and cheese, chicken tenders, and mini pizzas. I've reserved our private dining room for Saturday at 6 PM. Would you like me to arrange the birthday decorations?",
      },
    ],
  },
  {
    id: "3",
    title: "Catering Services",
    preview: "Inquired about office catering options",
    timestamp: "2 days ago",
    category: "Catering",
    icon: "concierge-bell",
    messages: [
      {
        id: "3-1",
        role: "user" as const,
        message:
          "Do you provide catering for corporate events? We need lunch for about 30 people.",
      },
      {
        id: "3-2",
        role: "assistant" as const,
        message:
          "**Absolutely!** We offer comprehensive catering services.\n\n### Executive Lunch Package (30 people):\n```\n✓ Sandwich platters\n✓ Salad bowls  \n✓ Dessert options\n✓ Setup service\n✓ Cleanup service\n```\n\n*Perfect for corporate events!*",
      },
      {
        id: "3-3",
        role: "user" as const,
        message: "What's the price range and how much notice do you need?",
      },
      {
        id: "3-4",
        role: "assistant" as const,
        message:
          "Our executive packages start at $18 per person. We typically need 48 hours notice for orders over 20 people. I can email you our full catering menu with pricing. What's your preferred contact?",
      },
    ],
  },
  {
    id: "4",
    title: "Dietary Restrictions",
    preview: "Asked about gluten-free and vegan options",
    timestamp: "3 days ago",
    category: "Menu",
    icon: "leaf",
    messages: [
      {
        id: "4-1",
        role: "user" as const,
        message:
          "I have celiac disease and my friend is vegan. Do you have options for both of us?",
      },
      {
        id: "4-2",
        role: "assistant" as const,
        message:
          "**Yes!** We accommodate both dietary needs:\n\n## Gluten-Free Options:\n- Pasta dishes\n- Fresh salads\n- Gluten-free bread\n\n## Vegan Options:\n- Quinoa bowls\n- Plant-based burgers\n- Dairy-free desserts\n\n> All items are clearly marked on our menu for easy identification.",
      },
      {
        id: "4-3",
        role: "user" as const,
        message:
          "How do you prevent cross-contamination for gluten-free items?",
      },
      {
        id: "4-4",
        role: "assistant" as const,
        message:
          "We take allergies very seriously. Our gluten-free items are prepared in a separate area with dedicated utensils and cookware. Our staff is trained on proper handling procedures to prevent cross-contamination.",
      },
    ],
  },
  {
    id: "5",
    title: "Delivery Area",
    preview: "Checked if delivery is available to my location",
    timestamp: "1 week ago",
    category: "Delivery",
    icon: "truck",
    messages: [
      {
        id: "5-1",
        role: "user" as const,
        message:
          "Do you deliver to the downtown area? I'm at 5th and Main Street.",
      },
      {
        id: "5-2",
        role: "assistant" as const,
        message:
          "Yes, we deliver to downtown! 5th and Main is well within our delivery zone. Delivery typically takes 30-45 minutes, and it's free for orders over $25.",
      },
      {
        id: "5-3",
        role: "user" as const,
        message: "What are your most popular delivery items?",
      },
      {
        id: "5-4",
        role: "assistant" as const,
        message:
          "### Top Delivery Favorites:\n\n1. **Gourmet Burgers** 🍔\n2. **Thai Curry Bowls** 🍛\n3. **Wood-fired Pizzas** 🍕\n\n*And for dessert:*\n- `Chocolate Lava Cake` - *always a hit!*\n\nWould you like me to recommend a combo?",
      },
    ],
  },
];

// Category colors for consistent theming
export const categoryColors = {
  HOURS: "#FF6B6B",
  DELIVERY: "#4ECDC4",
  MENU: "#45B7D1",
  RESERVATIONS: "#96CEB4",
  AMENITIES: "#FFEAA7",
  PAYMENT: "#DDA0DD",
  Menu: "#45B7D1",
  Reservations: "#96CEB4",
  Catering: "#FFEAA7",
  Delivery: "#4ECDC4",
};

// ============================================================================
// COMPREHENSIVE MARKDOWN TABLE DEMONSTRATIONS
// ============================================================================

/**
 * 1. BASIC TABLE - Simple rows and columns
 * Standard table with headers and data rows
 *
 * | Name | Age | City |
 * |------|-----|------|
 * | John | 25  | NYC  |
 * | Jane | 30  | LA   |
 * | Bob  | 35  | Chicago |
 */
export const basicTableExample = `
| Name | Age | City |
|------|-----|------|
| John | 25  | NYC  |
| Jane | 30  | LA   |
| Bob  | 35  | Chicago |
`;

/**
 * 2. TABLE WITH ALIGNMENT CONTROLS
 * Left, center, and right alignment using colons in separator row
 * :--- = left align, :---: = center align, ---: = right align
 *
 * | Product | Price | Rating | Status |
 * |:--------|:-----:|-------:|:------:|
 * | iPhone  | $999  | 4.5/5  | Available |
 * | Samsung | $799  | 4.2/5  | Limited |
 * | Google  | $699  | 4.0/5  | Sold Out |
 */
export const alignmentTableExample = `
| Product | Price | Rating | Status |
|:--------|:-----:|-------:|:------:|
| iPhone  | $999  | 4.5/5  | Available |
| Samsung | $799  | 4.2/5  | Limited |
| Google  | $699  | 4.0/5  | Sold Out |
`;

/**
 * 3. TABLE WITH SPECIAL CHARACTERS AND FORMATTING
 * Includes markdown formatting, emojis, code blocks, and special characters
 * Note: Markdown tables don't support true cell merging, but we can simulate it
 *
 * | Feature | Description | Example | Status |
 * |---------|-------------|---------|--------|
 * | **Bold** | `Strong emphasis` | **Important** | ✅ Active |
 * | *Italic* | _Emphasis text_ | *Highlighted* | ⚠️ Warning |
 * | `Code` | Inline code blocks | `console.log()` | 🔧 Dev |
 * | Links | [Link text](url) | [GitHub](https://github.com) | 🌐 Live |
 * | Emoji | Unicode symbols | 🚀 🎉 💡 | 🎯 Ready |
 */
export const formattedTableExample = `
| Feature | Description | Example | Status |
|---------|-------------|---------|--------|
| **Bold** | \`Strong emphasis\` | **Important** | ✅ Active |
| *Italic* | _Emphasis text_ | *Highlighted* | ⚠️ Warning |
| \`Code\` | Inline code blocks | \`console.log()\` | 🔧 Dev |
| Links | [Link text](url) | [GitHub](https://github.com) | 🌐 Live |
| Emoji | Unicode symbols | 🚀 🎉 💡 | 🎯 Ready |
`;

/**
 * 4. COMPLEX TABLE WITH NESTED CONTENT
 * Demonstrates tables with lists, multiple lines, and complex formatting
 *
 * | Component | Technologies | Features | Complexity |
 * |-----------|--------------|----------|------------|
 * | Frontend | • React<br>• TypeScript<br>• Tailwind | - Responsive UI<br>- Dark mode<br>- Animations | ⭐⭐⭐ |
 * | Backend | • Node.js<br>• Express<br>• MongoDB | - REST API<br>- Authentication<br>- Real-time | ⭐⭐⭐⭐ |
 * | DevOps | • Docker<br>• AWS<br>• CI/CD | - Auto deploy<br>- Monitoring<br>- Scaling | ⭐⭐⭐⭐⭐ |
 */
export const complexTableExample = `
| Component | Technologies | Features | Complexity |
|-----------|--------------|----------|------------|
| Frontend | • React<br>• TypeScript<br>• Tailwind | - Responsive UI<br>- Dark mode<br>- Animations | ⭐⭐⭐ |
| Backend | • Node.js<br>• Express<br>• MongoDB | - REST API<br>- Authentication<br>- Real-time | ⭐⭐⭐⭐ |
| DevOps | • Docker<br>• AWS<br>• CI/CD | - Auto deploy<br>- Monitoring<br>- Scaling | ⭐⭐⭐⭐⭐ |
`;

/**
 * 5. AI DEVELOPMENT HISTORY TABLE
 * Comprehensive timeline of AI milestones with detailed information
 *
 * | Year | Milestone | Key Figures | Impact | Technology |
 * |:----:|-----------|-------------|:------:|------------|
 * | 1950 | Turing Test | Alan Turing | 🧠 Foundational | Theoretical Framework |
 * | 1956 | AI Term Coined | John McCarthy | 🎯 Defining | Dartmouth Conference |
 * | 1957 | Perceptron | Frank Rosenblatt | ⚡ Neural Networks | Single-layer NN |
 * | 1965 | ELIZA | Joseph Weizenbaum | 💬 NLP | Pattern Matching |
 * | 1975 | Backpropagation | Paul Werbos | 🔄 Learning | Multi-layer Training |
 * | 1997 | Deep Blue | IBM Team | 🏆 Games | Specialized Hardware |
 * | 2006 | Deep Learning | Geoffrey Hinton | 🚀 Renaissance | Deep Neural Networks |
 * | 2012 | AlexNet | Alex Krizhevsky | 👁️ Computer Vision | CNN Revolution |
 * | 2017 | Transformer | Google Research | 🔤 Language | Attention Mechanism |
 * | 2018 | GPT-1 | OpenAI | 📝 Generation | Generative Pre-training |
 * | 2019 | GPT-2 | OpenAI | 🎭 Creativity | 1.5B Parameters |
 * | 2020 | GPT-3 | OpenAI | 🌟 Breakthrough | 175B Parameters |
 * | 2022 | ChatGPT | OpenAI | 🌍 Mainstream | RLHF Training |
 * | 2023 | GPT-4 | OpenAI | 🎨 Multimodal | Vision + Language |
 */
export const aiHistoryTable = `
| Year | Milestone | Key Figures | Impact | Technology |
|:----:|-----------|-------------|:------:|------------|
| 1950 | Turing Test | Alan Turing | 🧠 Foundational | Theoretical Framework |
| 1956 | AI Term Coined | John McCarthy | 🎯 Defining | Dartmouth Conference |
| 1957 | Perceptron | Frank Rosenblatt | ⚡ Neural Networks | Single-layer NN |
| 1965 | ELIZA | Joseph Weizenbaum | 💬 NLP | Pattern Matching |
| 1975 | Backpropagation | Paul Werbos | 🔄 Learning | Multi-layer Training |
| 1997 | Deep Blue | IBM Team | 🏆 Games | Specialized Hardware |
| 2006 | Deep Learning | Geoffrey Hinton | 🚀 Renaissance | Deep Neural Networks |
| 2012 | AlexNet | Alex Krizhevsky | 👁️ Computer Vision | CNN Revolution |
| 2017 | Transformer | Google Research | 🔤 Language | Attention Mechanism |
| 2018 | GPT-1 | OpenAI | 📝 Generation | Generative Pre-training |
| 2019 | GPT-2 | OpenAI | 🎭 Creativity | 1.5B Parameters |
| 2020 | GPT-3 | OpenAI | 🌟 Breakthrough | 175B Parameters |
| 2022 | ChatGPT | OpenAI | 🌍 Mainstream | RLHF Training |
| 2023 | GPT-4 | OpenAI | 🎨 Multimodal | Vision + Language |
`;

/**
 * 6. COMPARISON TABLE WITH RATINGS
 * Demonstrates tables for comparing features, products, or technologies
 *
 * | AI Model | Parameters | Strengths | Weaknesses | Use Cases | Rating |
 * |:---------|:----------:|-----------|------------|-----------|:------:|
 * | GPT-4 | 1.76T | • Multimodal<br>• High accuracy<br>• Reasoning | • Expensive<br>• Slow inference | Creative writing, Analysis | ⭐⭐⭐⭐⭐ |
 * | Claude-3 | ~200B | • Safety focused<br>• Long context<br>• Helpful | • Limited availability<br>• Newer model | Research, Assistance | ⭐⭐⭐⭐ |
 * | Llama-2 | 70B | • Open source<br>• Customizable<br>• Fast | • Smaller scale<br>• Less capable | Development, Research | ⭐⭐⭐ |
 * | Gemini | ~540B | • Google integration<br>• Multimodal<br>• Fast | • Limited access<br>• New platform | Search, Productivity | ⭐⭐⭐⭐ |
 */
export const comparisonTableExample = `
| AI Model | Parameters | Strengths | Weaknesses | Use Cases | Rating |
|:---------|:----------:|-----------|------------|-----------|:------:|
| GPT-4 | 1.76T | • Multimodal<br>• High accuracy<br>• Reasoning | • Expensive<br>• Slow inference | Creative writing, Analysis | ⭐⭐⭐⭐⭐ |
| Claude-3 | ~200B | • Safety focused<br>• Long context<br>• Helpful | • Limited availability<br>• Newer model | Research, Assistance | ⭐⭐⭐⭐ |
| Llama-2 | 70B | • Open source<br>• Customizable<br>• Fast | • Smaller scale<br>• Less capable | Development, Research | ⭐⭐⭐ |
| Gemini | ~540B | • Google integration<br>• Multimodal<br>• Fast | • Limited access<br>• New platform | Search, Productivity | ⭐⭐⭐⭐ |
`;

/**
 * 7. DATA TABLE WITH STATISTICS
 * Numerical data with calculations and statistical information
 *
 * | Quarter | Revenue | Growth | Expenses | Profit | Margin |
 * |:-------:|--------:|:------:|---------:|-------:|:------:|
 * | Q1 2023 | $125,000 | +15% | $85,000 | $40,000 | 32% |
 * | Q2 2023 | $143,750 | +15% | $92,000 | $51,750 | 36% |
 * | Q3 2023 | $165,313 | +15% | $98,500 | $66,813 | 40% |
 * | Q4 2023 | $190,110 | +15% | $105,000 | $85,110 | 45% |
 * | **Total** | **$624,173** | **+60%** | **$380,500** | **$243,673** | **39%** |
 */
export const statisticsTableExample = `
| Quarter | Revenue | Growth | Expenses | Profit | Margin |
|:-------:|--------:|:------:|---------:|-------:|:------:|
| Q1 2023 | $125,000 | +15% | $85,000 | $40,000 | 32% |
| Q2 2023 | $143,750 | +15% | $92,000 | $51,750 | 36% |
| Q3 2023 | $165,313 | +15% | $98,500 | $66,813 | 40% |
| Q4 2023 | $190,110 | +15% | $105,000 | $85,110 | 45% |
| **Total** | **$624,173** | **+60%** | **$380,500** | **$243,673** | **39%** |
`;

/**
 * MARKDOWN TABLE LIMITATIONS AND NOTES:
 *
 * 1. Cell Merging: Standard Markdown doesn't support true cell merging.
 *    Workaround: Use HTML <br> tags for line breaks within cells.
 *
 * 2. Sorting/Filtering: Pure Markdown tables don't have interactive features.
 *    Workaround: Use JavaScript libraries like DataTables or implement custom sorting.
 *
 * 3. Complex Layouts: Limited to rectangular grid structure.
 *    Workaround: Use HTML tables for complex layouts when needed.
 *
 * 4. Styling: Limited visual customization in pure Markdown.
 *    Workaround: Combine with CSS or use extended Markdown flavors.
 *
 * 5. Large Tables: Can become unwieldy with many columns.
 *    Workaround: Break into multiple tables or use horizontal scrolling.
 */

// ============================================================================
// PROGRESSIVE TASK LOADING FLOW - MOCK DATA
// ============================================================================

// Task interface for restaurant operations
export interface RestaurantTask {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  category:
    | "kitchen"
    | "service"
    | "delivery"
    | "management"
    | "cleaning"
    | "inventory";
  status: "pending" | "in_progress" | "completed" | "overdue";
  assignedTo: string;
  dueTime: string;
  estimatedDuration: string;
  location: string;
}

// Comprehensive mock task data (50 tasks total)
export const mockRestaurantTasks: RestaurantTask[] = [
  // URGENT TASKS (8 most urgent ones for initial display)
  {
    id: "task-001",
    title: "Prep vegetables for dinner rush",
    description: "Chop onions, carrots, and celery for tonight's specials",
    priority: "urgent",
    category: "kitchen",
    status: "overdue",
    assignedTo: "Chef Maria",
    dueTime: "2:00 PM",
    estimatedDuration: "45 min",
    location: "Main Kitchen",
  },
  {
    id: "task-002",
    title: "Restock wine inventory",
    description: "Check wine cellar and reorder popular bottles",
    priority: "urgent",
    category: "inventory",
    status: "overdue",
    assignedTo: "Sommelier John",
    dueTime: "1:30 PM",
    estimatedDuration: "30 min",
    location: "Wine Cellar",
  },
  {
    id: "task-003",
    title: "Clean ice machine",
    description: "Deep clean and sanitize the ice machine",
    priority: "urgent",
    category: "cleaning",
    status: "overdue",
    assignedTo: "Maintenance Tom",
    dueTime: "12:00 PM",
    estimatedDuration: "60 min",
    location: "Bar Area",
  },
  {
    id: "task-004",
    title: "Update daily specials menu",
    description: "Print new menus with today's fresh specials",
    priority: "urgent",
    category: "management",
    status: "pending",
    assignedTo: "Manager Sarah",
    dueTime: "3:00 PM",
    estimatedDuration: "20 min",
    location: "Office",
  },
  {
    id: "task-005",
    title: "Prepare bread dough",
    description: "Mix and proof dough for dinner service",
    priority: "urgent",
    category: "kitchen",
    status: "pending",
    assignedTo: "Baker Lisa",
    dueTime: "2:30 PM",
    estimatedDuration: "90 min",
    location: "Bakery Section",
  },
  {
    id: "task-006",
    title: "Set up outdoor seating",
    description: "Arrange tables and umbrellas for patio dining",
    priority: "urgent",
    category: "service",
    status: "pending",
    assignedTo: "Server Mike",
    dueTime: "4:00 PM",
    estimatedDuration: "30 min",
    location: "Patio",
  },
  {
    id: "task-007",
    title: "Check delivery vehicle",
    description: "Inspect delivery van and refuel if needed",
    priority: "urgent",
    category: "delivery",
    status: "overdue",
    assignedTo: "Driver Carlos",
    dueTime: "1:00 PM",
    estimatedDuration: "25 min",
    location: "Parking Lot",
  },
  {
    id: "task-008",
    title: "Polish silverware",
    description: "Clean and polish all dinner service silverware",
    priority: "urgent",
    category: "service",
    status: "pending",
    assignedTo: "Server Anna",
    dueTime: "3:30 PM",
    estimatedDuration: "40 min",
    location: "Service Station",
  },

  // HIGH PRIORITY TASKS (next batch for "more tasks")
  {
    id: "task-009",
    title: "Marinate chicken for tomorrow",
    description: "Prepare chicken marinade for tomorrow's lunch special",
    priority: "high",
    category: "kitchen",
    status: "pending",
    assignedTo: "Sous Chef David",
    dueTime: "5:00 PM",
    estimatedDuration: "35 min",
    location: "Prep Kitchen",
  },
  {
    id: "task-010",
    title: "Update reservation system",
    description: "Input tonight's walk-in availability",
    priority: "high",
    category: "management",
    status: "pending",
    assignedTo: "Host Emma",
    dueTime: "4:30 PM",
    estimatedDuration: "15 min",
    location: "Front Desk",
  },
  {
    id: "task-011",
    title: "Stock bar supplies",
    description: "Refill napkins, straws, and cocktail garnishes",
    priority: "high",
    category: "inventory",
    status: "pending",
    assignedTo: "Bartender Jake",
    dueTime: "4:45 PM",
    estimatedDuration: "20 min",
    location: "Bar",
  },
  {
    id: "task-012",
    title: "Vacuum dining room",
    description: "Deep clean carpets in main dining area",
    priority: "high",
    category: "cleaning",
    status: "overdue",
    assignedTo: "Cleaner Rosa",
    dueTime: "11:00 AM",
    estimatedDuration: "45 min",
    location: "Dining Room",
  },

  // MEDIUM PRIORITY TASKS
  {
    id: "task-013",
    title: "Order fresh flowers",
    description: "Call florist for table centerpieces",
    priority: "medium",
    category: "management",
    status: "pending",
    assignedTo: "Manager Sarah",
    dueTime: "6:00 PM",
    estimatedDuration: "10 min",
    location: "Office",
  },
  {
    id: "task-014",
    title: "Prep salad ingredients",
    description: "Wash and chop lettuce, tomatoes, cucumbers",
    priority: "medium",
    category: "kitchen",
    status: "pending",
    assignedTo: "Prep Cook Alex",
    dueTime: "5:30 PM",
    estimatedDuration: "50 min",
    location: "Salad Station",
  },
  {
    id: "task-015",
    title: "Test sound system",
    description: "Check microphone and speakers for live music",
    priority: "medium",
    category: "service",
    status: "pending",
    assignedTo: "Server Mike",
    dueTime: "7:00 PM",
    estimatedDuration: "15 min",
    location: "Stage Area",
  },

  // Additional tasks to reach 50 total...
  {
    id: "task-016",
    title: "Check freezer temperature",
    description: "Monitor and log freezer temperatures",
    priority: "medium",
    category: "kitchen",
    status: "overdue",
    assignedTo: "Chef Maria",
    dueTime: "10:00 AM",
    estimatedDuration: "10 min",
    location: "Walk-in Freezer",
  },
  {
    id: "task-017",
    title: "Organize delivery schedule",
    description: "Plan optimal routes for evening deliveries",
    priority: "high",
    category: "delivery",
    status: "pending",
    assignedTo: "Driver Carlos",
    dueTime: "5:15 PM",
    estimatedDuration: "25 min",
    location: "Dispatch Office",
  },
  {
    id: "task-018",
    title: "Clean coffee machine",
    description: "Descale and clean espresso machine",
    priority: "medium",
    category: "cleaning",
    status: "overdue",
    dueTime: "9:00 AM",
    assignedTo: "Barista Kelly",
    estimatedDuration: "30 min",
    location: "Coffee Station",
  },
  {
    id: "task-019",
    title: "Count register till",
    description: "Balance cash register for shift change",
    priority: "high",
    category: "management",
    status: "pending",
    assignedTo: "Cashier Ben",
    dueTime: "6:30 PM",
    estimatedDuration: "20 min",
    location: "Front Counter",
  },
  {
    id: "task-020",
    title: "Slice cheese for pizzas",
    description: "Prepare mozzarella and parmesan for pizza station",
    priority: "medium",
    category: "kitchen",
    status: "pending",
    assignedTo: "Pizza Chef Tony",
    dueTime: "4:15 PM",
    estimatedDuration: "35 min",
    location: "Pizza Station",
  },
  // ... (continuing with more tasks to reach 50 total)
];

// Progressive loading responses based on the recommended flow
export const taskFlowResponses = {
  // Step 1: Initial Response - Show 8 most urgent tasks
  initialResponse: {
    message:
      '**📋 Task Overview**\n\nYou have **50 pending tasks** across all departments. Here are the **8 most urgent ones** that need immediate attention:\n\n| Priority | Task | Assigned To | Due Time | Location |\n|:--------:|------|-------------|:--------:|----------|\n| 🔴 **OVERDUE** | Prep vegetables for dinner rush | Chef Maria | 2:00 PM | Main Kitchen |\n| 🔴 **OVERDUE** | Restock wine inventory | Sommelier John | 1:30 PM | Wine Cellar |\n| 🔴 **OVERDUE** | Clean ice machine | Maintenance Tom | 12:00 PM | Bar Area |\n| 🟡 **URGENT** | Update daily specials menu | Manager Sarah | 3:00 PM | Office |\n| 🟡 **URGENT** | Prepare bread dough | Baker Lisa | 2:30 PM | Bakery Section |\n| 🟡 **URGENT** | Set up outdoor seating | Server Mike | 4:00 PM | Patio |\n| 🔴 **OVERDUE** | Check delivery vehicle | Driver Carlos | 1:00 PM | Parking Lot |\n| 🟡 **URGENT** | Polish silverware | Server Anna | 3:30 PM | Service Station |\n\n### 🚨 **Critical Alert**\n**12 tasks are overdue** - would you like to see those first?\n\n---\n\n### 💬 **What would you like to do next?**\n- Say **"more tasks"** to see additional pending items\n- Say **"filter by kitchen"** to see only kitchen tasks\n- Say **"show completed"** to view finished tasks\n- Say **"overdue tasks"** to focus on urgent items',
    suggestions: [
      "more tasks",
      "filter by kitchen",
      "show completed",
      "overdue tasks",
    ],
  },

  // Step 2: More tasks response
  moreTasksResponse: {
    message:
      '**📋 Additional Tasks (9-20)**\n\nHere are the next **12 high-priority tasks** in your queue:\n\n| Priority | Task | Department | Assigned To | Due Time |\n|:--------:|------|:----------:|-------------|:--------:|\n| 🟠 **HIGH** | Marinate chicken for tomorrow | Kitchen | Sous Chef David | 5:00 PM |\n| 🟠 **HIGH** | Update reservation system | Management | Host Emma | 4:30 PM |\n| 🟠 **HIGH** | Stock bar supplies | Inventory | Bartender Jake | 4:45 PM |\n| 🔴 **OVERDUE** | Vacuum dining room | Cleaning | Cleaner Rosa | 11:00 AM |\n| 🟠 **HIGH** | Organize delivery schedule | Delivery | Driver Carlos | 5:15 PM |\n| 🟠 **HIGH** | Count register till | Management | Cashier Ben | 6:30 PM |\n\n**Remaining tasks:** 30 more items in queue\n\n### 🎯 **Quick Actions:**\n- **"filter by [department]"** - Focus on specific area\n- **"show overdue"** - See all 12 overdue items\n- **"assign to [person]"** - View tasks by staff member',
    suggestions: [
      "filter by kitchen",
      "show overdue",
      "assign tasks",
      "view all 50",
    ],
  },

  // Step 3: Kitchen filter response
  kitchenFilterResponse: {
    message:
      "**🍳 Kitchen Department Tasks**\n\nFiltered view: **15 kitchen tasks** out of 50 total\n\n### 🔴 **Overdue Kitchen Tasks (3)**\n| Task | Assigned To | Due Time | Status |\n|------|-------------|:--------:|:------:|\n| Prep vegetables for dinner rush | Chef Maria | 2:00 PM | 🔴 **2h overdue** |\n| Check freezer temperature | Chef Maria | 10:00 AM | 🔴 **6h overdue** |\n\n### 🟡 **Urgent Kitchen Tasks (4)**\n| Task | Assigned To | Due Time | Duration |\n|------|-------------|:--------:|:--------:|\n| Prepare bread dough | Baker Lisa | 2:30 PM | 90 min |\n| Slice cheese for pizzas | Pizza Chef Tony | 4:15 PM | 35 min |\n\n**Kitchen Staff Workload:**\n- Chef Maria: 4 tasks (2 overdue)\n- Baker Lisa: 3 tasks\n- Pizza Chef Tony: 2 tasks",
    suggestions: [
      "show all kitchen",
      "reassign overdue",
      "kitchen priorities",
      "back to overview",
    ],
  },

  // Step 4: Overdue tasks smart suggestion
  overdueTasksResponse: {
    message:
      "**🚨 OVERDUE TASKS - IMMEDIATE ACTION REQUIRED**\n\n**12 tasks are past their deadline** and need urgent attention:\n\n### 🔴 **Critical Overdue (4+ hours late)**\n| Task | Department | Assigned To | Hours Late | Impact |\n|------|:----------:|-------------|:----------:|:------:|\n| Clean ice machine | Cleaning | Maintenance Tom | 6h | 🥤 **No ice for drinks** |\n| Check freezer temperature | Kitchen | Chef Maria | 6h | 🧊 **Food safety risk** |\n| Clean coffee machine | Cleaning | Barista Kelly | 7h | ☕ **No espresso service** |\n\n### 🎯 **Recommended Actions:**\n1. **Reassign** Chef Maria's tasks to available staff\n2. **Prioritize** food safety items (freezer, ice machine)\n3. **Delegate** cleaning tasks to available team members\n\n**Would you like me to suggest task reassignments?**",
    suggestions: [
      "reassign tasks",
      "prioritize by impact",
      "call in backup staff",
      "mark completed",
    ],
  },

  // Completed tasks response
  completedTasksResponse: {
    message:
      "**✅ COMPLETED TASKS TODAY**\n\n**23 tasks completed** out of 73 total assigned today. Great progress!\n\n### 🏆 **Recent Completions (Last 2 Hours)**\n| Task | Completed By | Time | Duration |\n|------|--------------|:----:|:--------:|\n| ✅ Set up lunch buffet | Server Anna | 1:45 PM | 25 min |\n| ✅ Receive food delivery | Receiving Tom | 1:30 PM | 40 min |\n| ✅ Clean restrooms | Cleaner Rosa | 1:15 PM | 30 min |\n\n### 🌟 **Top Performers Today**\n- **Server Anna**: 4 tasks completed\n- **Prep Cook Alex**: 3 tasks completed\n- **Cleaner Rosa**: 3 tasks completed\n\n**Productivity Trend:** 📈 **+15%** vs yesterday",
    suggestions: [
      "view pending tasks",
      "performance report",
      "assign new tasks",
      "team recognition",
    ],
  },
};

// Table utility functions for dynamic table generation
export const tableUtils = {
  // Generate table header separator based on alignment
  generateSeparator: (columns: Array<"left" | "center" | "right">) => {
    return columns
      .map((align) => {
        switch (align) {
          case "left":
            return ":---";
          case "center":
            return ":---:";
          case "right":
            return "---:";
          default:
            return "---";
        }
      })
      .join("|");
  },

  // Escape special Markdown characters in table cells
  escapeTableCell: (text: string) => {
    return text.replace(/\|/g, "\\|").replace(/\n/g, "<br>").replace(/\r/g, "");
  },

  // Generate a complete table from data
  generateTable: (
    headers: string[],
    rows: string[][],
    alignments?: Array<"left" | "center" | "right">
  ) => {
    const headerRow = `| ${headers.join(" | ")} |`;
    const separatorRow = `|${tableUtils.generateSeparator(alignments || headers.map(() => "left"))}|`;
    const dataRows = rows.map((row) => `| ${row.join(" | ")} |`).join("\n");

    return `${headerRow}\n${separatorRow}\n${dataRows}`;
  },

  // Filter tasks by various criteria
  filterTasks: (
    tasks: RestaurantTask[],
    criteria: {
      status?: RestaurantTask["status"];
      category?: RestaurantTask["category"];
      priority?: RestaurantTask["priority"];
      assignedTo?: string;
    }
  ) => {
    return tasks.filter((task) => {
      if (criteria.status && task.status !== criteria.status) return false;
      if (criteria.category && task.category !== criteria.category)
        return false;
      if (criteria.priority && task.priority !== criteria.priority)
        return false;
      if (criteria.assignedTo && task.assignedTo !== criteria.assignedTo)
        return false;
      return true;
    });
  },

  // Get task statistics
  getTaskStats: (tasks: RestaurantTask[]) => {
    const total = tasks.length;
    const byStatus = tasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byCategory = tasks.reduce(
      (acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byPriority = tasks.reduce(
      (acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return { total, byStatus, byCategory, byPriority };
  },
};
