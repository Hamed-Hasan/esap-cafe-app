import { RoleData, Task } from "../../constants/restaurant-data";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import TaskCard from "./task-card";

interface TaskDetailModalProps {
  visible: boolean;
  roleData: RoleData | null;
  onClose: () => void;
  onTaskPress?: (task: Task) => void;
}

const { height: screenHeight } = Dimensions.get("window");

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  visible,
  roleData,
  onClose,
  onTaskPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  if (!roleData) return null;

  const getTasksByStatus = (
    status: "pending" | "in-progress" | "completed"
  ) => {
    return roleData.tasks.filter((task) => task.status === status);
  };

  const pendingTasks = getTasksByStatus("pending");
  const inProgressTasks = getTasksByStatus("in-progress");
  const completedTasks = getTasksByStatus("completed");

  const TaskSection: React.FC<{
    title: string;
    tasks: Task[];
    color: string;
    icon: string;
  }> = ({ title, tasks, color, icon }) => (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <View
          className="w-8 h-8 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${color}20` }}
        >
          <Text className="text-sm">{icon}</Text>
        </View>
        <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
          {title}
        </Text>
        <View
          className="ml-2 px-2 py-1 rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          <Text className="text-xs font-semibold" style={{ color }}>
            {tasks.length}
          </Text>
        </View>
      </View>

      {tasks.length === 0 ? (
        <View className="bg-bg-drawer-light dark:bg-bg-drawer-dark rounded-xl p-4 border border-border-light dark:border-border-dark">
          <Text className="text-text-muted dark:text-text-muted-dark text-center">
            No {title.toLowerCase()} tasks
          </Text>
        </View>
      ) : (
        <View>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => onTaskPress?.(task)}
            />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      className="bg-transparent"
      backdropColor="transparent"
    >
      <BlurView
        intensity={isDark ? 40 : 12}
        tint="dark"
        style={{
          flex: 1,
          borderRadius: 28,
          borderWidth: 1,
          borderColor: isDark ? "#414548" : "rgba(255, 255, 255, 0.7)",
          overflow: "hidden",
          minHeight: 200,
        }}
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(63, 67, 70, 0.7)", "rgba(76, 81, 85, 0.7)"]
              : ["rgba(255, 255, 255, 0.7)", "rgba(255, 255, 255, 1)"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0.5558, 0.9752]}
          style={{
            flex: 1,
            paddingHorizontal: 12,
            paddingVertical: 16,
          }}
        >
          {/* Header */}
          <View className=" px-6 py-6 border-b border-border-light dark:border-border-dark">
            <View className="flex-row items-center justify-between">
              <View className="flex flex-row items-center justify-center w-full">
                <Text className="text-xl text-center font-bold text-text-primary dark:text-text-primary-dark">
                  {roleData.role}
                </Text>
              </View>
            </View>
          </View>

          {/* Task Lists */}
          <ScrollView
            className="flex-1 px-6 pt-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Pending Tasks */}
            <TaskSection
              title="Pending Tasks"
              tasks={pendingTasks}
              color="#EF4444"
              icon="⏳"
            />

            {/* In Progress Tasks */}
            <TaskSection
              title="In Progress Tasks"
              tasks={inProgressTasks}
              color="#A67C52"
              icon="🔄"
            />

            {/* Completed Tasks */}
            <TaskSection
              title="Completed Tasks"
              tasks={completedTasks}
              color="#4EBD7C"
              icon="✅"
            />
          </ScrollView>
        </LinearGradient>
      </BlurView>
    </Modal>
  );
};

export default TaskDetailModal;
