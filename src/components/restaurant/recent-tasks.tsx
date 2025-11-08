import { getAllTasks, Task } from "../../constants/restaurant-data";
import React from "react";
import { Text, View } from "react-native";
import TaskCard from "./task-card";

interface RecentTasksProps {
  onTaskPress?: (task: Task) => void;
}

export const RecentTasks: React.FC<RecentTasksProps> = ({ onTaskPress }) => {
  // Get urgent and recent tasks (high priority pending tasks + in-progress tasks)
  const getRecentTasks = (): Task[] => {
    const allTasks = getAllTasks();

    // Filter for urgent pending tasks and in-progress tasks
    const urgentTasks = allTasks.filter(
      (task) =>
        (task.priority === "high" && task.status === "pending") ||
        task.status === "in-progress"
    );

    // Sort by priority (high first) and then by status (in-progress first)
    return urgentTasks
      .sort((a, b) => {
        // First sort by status (in-progress first)
        if (a.status === "in-progress" && b.status !== "in-progress") return -1;
        if (b.status === "in-progress" && a.status !== "in-progress") return 1;

        // Then sort by priority
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 5); // Show only top 5 tasks
  };

  const recentTasks = getRecentTasks();

  if (recentTasks.length === 0) {
    return (
      <View className="bg-bg-drawer-light dark:bg-bg-drawer-dark rounded-2xl p-5 mb-6 border border-border-light dark:border-border-dark">
        <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark mb-4">
          Recent Tasks
        </Text>
        <View className="items-center py-8">
          <Text className="text-4xl mb-2">✅</Text>
          <Text className="text-text-muted dark:text-text-muted-dark text-center">
            No urgent tasks at the moment!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="pt-3">
      {recentTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onPress={() => onTaskPress?.(task)}
        />
      ))}
    </View>
  );
};

export default RecentTasks;
