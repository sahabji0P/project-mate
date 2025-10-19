import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useToast } from '../hooks/use-toast';
import taskService, { CreateTaskData, Task, TaskStatus, UpdateTaskData } from '../services/task';

// Re-export types from service
export type { ListSection, Task, TaskPriority, TaskStatus } from '../services/task';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  getTasksByProject: (projectId: string) => Task[];
  fetchTasksForProject: (projectId: string) => Promise<void>;
  addTask: (projectId: string, data: CreateTaskData) => Promise<void>;
  updateTask: (projectId: string, taskId: string, data: UpdateTaskData) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
  moveTask: (projectId: string, taskId: string, status: TaskStatus) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get tasks for a specific project from state
  const getTasksByProject = (projectId: string): Task[] => {
    return tasks.filter(task => task.projectId === projectId);
  };

  // Fetch tasks for a project from API
  const fetchTasksForProject = async (projectId: string) => {
    try {
      setIsLoading(true);
      const fetchedTasks = await taskService.getTasks(projectId);

      // Replace tasks for this project while keeping tasks from other projects
      setTasks(prev => [
        ...prev.filter(t => t.projectId !== projectId),
        ...fetchedTasks
      ]);
    } catch (error: any) {
      console.error('Failed to fetch tasks:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load tasks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new task
  const addTask = async (projectId: string, data: CreateTaskData) => {
    try {
      setIsLoading(true);
      const newTask = await taskService.createTask(projectId, data);
      setTasks(prev => [newTask, ...prev]);
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create task';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a task
  const updateTask = async (projectId: string, taskId: string, data: UpdateTaskData) => {
    try {
      setIsLoading(true);
      const updatedTask = await taskService.updateTask(projectId, taskId, data);
      setTasks(prev =>
        prev.map(task => (task._id === taskId ? updatedTask : task))
      );
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update task';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (projectId: string, taskId: string) => {
    try {
      setIsLoading(true);
      await taskService.deleteTask(projectId, taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete task';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Move task to different status (drag and drop)
  const moveTask = async (projectId: string, taskId: string, status: TaskStatus) => {
    try {
      // Optimistic update
      setTasks(prev =>
        prev.map(task => (task._id === taskId ? { ...task, status } : task))
      );

      await taskService.updateTaskStatus(projectId, taskId, status);

      toast({
        title: 'Success',
        description: 'Task status updated',
      });
    } catch (error: any) {
      // Revert on error by refetching
      await fetchTasksForProject(projectId);

      const message = error.response?.data?.error || 'Failed to update task status';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const value: TaskContextType = {
    tasks,
    isLoading,
    getTasksByProject,
    fetchTasksForProject,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
