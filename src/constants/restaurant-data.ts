export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueTime?: string;
  category: string;
}

export interface RoleData {
  role: string;
  icon: string;
  color: string;
  tasks: Task[];
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
}

export const restaurantMockData: RoleData[] = [
  {
    role: 'Branch Manager',
    icon: '👨‍💼',
    color: '#482C20',
    totalTasks: 8,
    pendingTasks: 5,
    completedTasks: 3,
    tasks: [
      {
        id: 'bm1',
        title: 'Low Stock Alert: Coffee Beans',
        description: 'Arabica coffee beans running low - 2 days supply left',
        priority: 'high',
        status: 'pending',
        dueTime: '2:00 PM',
        category: 'Inventory'
      },
      {
        id: 'bm2',
        title: 'Staff Schedule Review',
        description: 'Review and approve next week\'s staff schedule',
        priority: 'medium',
        status: 'pending',
        dueTime: '4:00 PM',
        category: 'Scheduling'
      },
      {
        id: 'bm3',
        title: 'Monthly Sales Report',
        description: 'Prepare monthly sales analysis and trends',
        priority: 'medium',
        status: 'in-progress',
        category: 'Reports'
      },
      {
        id: 'bm4',
        title: 'Supplier Meeting',
        description: 'Meeting with new organic supplier',
        priority: 'high',
        status: 'pending',
        dueTime: '10:00 AM',
        category: 'Meetings'
      },
      {
        id: 'bm5',
        title: 'Equipment Maintenance',
        description: 'Schedule espresso machine maintenance',
        priority: 'low',
        status: 'completed',
        category: 'Maintenance'
      }
    ]
  },
  {
    role: 'Chef',
    icon: '👨‍🍳',
    color: '#A67C52',
    totalTasks: 6,
    pendingTasks: 4,
    completedTasks: 2,
    tasks: [
      {
        id: 'ch1',
        title: 'Design Winter Menu',
        description: 'Create seasonal menu with winter specialties',
        priority: 'high',
        status: 'in-progress',
        dueTime: '6:00 PM',
        category: 'Menu Planning'
      },
      {
        id: 'ch2',
        title: 'Order Fresh Ingredients',
        description: 'Place order for organic vegetables and herbs',
        priority: 'high',
        status: 'pending',
        dueTime: '9:00 AM',
        category: 'Ingredient Orders'
      },
      {
        id: 'ch3',
        title: 'Special Diet Request',
        description: 'Prepare gluten-free options for table 12',
        priority: 'medium',
        status: 'pending',
        dueTime: '1:30 PM',
        category: 'Special Requests'
      },
      {
        id: 'ch4',
        title: 'Recipe Testing',
        description: 'Test new vegan dessert recipes',
        priority: 'low',
        status: 'pending',
        category: 'Recipe Development'
      },
      {
        id: 'ch5',
        title: 'Kitchen Inventory Check',
        description: 'Daily inventory check completed',
        priority: 'medium',
        status: 'completed',
        category: 'Inventory'
      }
    ]
  },
  {
    role: 'Staff',
    icon: '👥',
    color: '#4EBD7C',
    totalTasks: 12,
    pendingTasks: 8,
    completedTasks: 4,
    tasks: [
      {
        id: 'st1',
        title: 'Table 5 Assignment',
        description: 'Serve party of 6 - anniversary celebration',
        priority: 'high',
        status: 'in-progress',
        dueTime: '7:30 PM',
        category: 'Table Service'
      },
      {
        id: 'st2',
        title: 'Order #1247 Ready',
        description: 'Cappuccino and croissant ready for pickup',
        priority: 'high',
        status: 'pending',
        dueTime: 'Now',
        category: 'Order Status'
      },
      {
        id: 'st3',
        title: 'Customer Complaint',
        description: 'Table 8 - coffee temperature issue',
        priority: 'medium',
        status: 'pending',
        dueTime: 'ASAP',
        category: 'Customer Service'
      },
      {
        id: 'st4',
        title: 'Refill Station',
        description: 'Restock napkins and sugar at station 3',
        priority: 'low',
        status: 'pending',
        category: 'Maintenance'
      },
      {
        id: 'st5',
        title: 'VIP Customer Arrival',
        description: 'Regular customer Mr. Johnson arriving at 3 PM',
        priority: 'medium',
        status: 'pending',
        dueTime: '3:00 PM',
        category: 'Customer Service'
      },
      {
        id: 'st6',
        title: 'Table 12 Cleaned',
        description: 'Table cleaned and reset for next customers',
        priority: 'low',
        status: 'completed',
        category: 'Table Service'
      }
    ]
  }
];

export const getTasksByRole = (role: string): RoleData | undefined => {
  return restaurantMockData.find(data => data.role === role);
};

export const getAllTasks = (): Task[] => {
  return restaurantMockData.flatMap(roleData => roleData.tasks);
};

export const getTasksByPriority = (priority: 'high' | 'medium' | 'low'): Task[] => {
  return getAllTasks().filter(task => task.priority === priority);
};

export const getPendingTasksCount = (): number => {
  return getAllTasks().filter(task => task.status === 'pending').length;
};

export const getTotalTasksCount = (): number => {
  return getAllTasks().length;
};