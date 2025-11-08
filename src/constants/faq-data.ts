// AI Prompt Template item type definition
export interface FAQItem {
  id: string;
  icon: string;
  category: string;
  title: string;
  prompt: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// AI Prompt Template categories
export const FAQ_CATEGORIES = [
  'GENERAL',
  'BUSINESS',
  'CREATIVE',
  'ANALYSIS',
  'SUPPORT',
  'PLANNING',
  'RESEARCH',
  'CODING'
] as const;

export type FAQCategory = typeof FAQ_CATEGORIES[number];

// Sample AI Prompt Templates for Cafe/Restaurant Business
export const sampleFAQs: FAQItem[] = [
  {
    id: '1',
    icon: 'lightbulb',
    category: 'CREATIVE',
    title: 'Menu Description Writer',
    prompt: 'Create appetizing and engaging menu descriptions for [DISH NAME]. Include key ingredients, cooking method, flavor profile, and any special dietary information. Make it sound irresistible to customers.',
    description: 'Generate compelling menu item descriptions',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    icon: 'chart-line',
    category: 'ANALYSIS',
    title: 'Restaurant Performance Analysis',
    prompt: 'Analyze our restaurant\'s performance data including sales trends, popular menu items, peak hours, customer feedback, and seasonal patterns. Provide actionable insights to improve revenue and customer satisfaction.',
    description: 'Comprehensive restaurant analytics template',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    icon: 'calendar-alt',
    category: 'PLANNING',
    title: 'Event Menu Planning',
    prompt: 'Plan a complete menu for [EVENT TYPE] with [NUMBER] guests. Consider dietary restrictions, seasonal ingredients, preparation time, cost per person of $[BUDGET], and presentation style. Include appetizers, mains, desserts, and beverages.',
    description: 'Structured event catering menu planner',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    icon: 'briefcase',
    category: 'BUSINESS',
    title: 'Staff Training Guide',
    prompt: 'Create a comprehensive training guide for new [POSITION] staff covering customer service standards, menu knowledge, POS system usage, food safety protocols, and restaurant policies. Make it easy to follow and practical.',
    description: 'New employee training template',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    icon: 'headset',
    category: 'SUPPORT',
    title: 'Customer Complaint Resolution',
    prompt: 'Draft a professional response to address this customer complaint: [COMPLAINT DETAILS]. Acknowledge the issue, apologize sincerely, explain our resolution steps, offer appropriate compensation, and ensure customer retention.',
    description: 'Restaurant customer service recovery template',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Icon mapping for categories
export const categoryIcons: Record<FAQCategory, string> = {
  GENERAL: 'info-circle',
  BUSINESS: 'briefcase',
  CREATIVE: 'lightbulb',
  ANALYSIS: 'chart-line',
  SUPPORT: 'headset',
  PLANNING: 'calendar-alt',
  RESEARCH: 'search',
  CODING: 'code'
};