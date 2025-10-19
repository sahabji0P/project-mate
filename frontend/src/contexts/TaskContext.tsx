import React, { createContext, useContext, useEffect, useState } from 'react';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type ListSection = 'today' | 'tomorrow' | 'later';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  listSection?: ListSection;
  completed?: boolean;
  priority?: 'high' | 'medium' | 'low';
  color?: string;
  createdAt: string;
}

interface TaskContextType {
  tasks: Task[];
  getTasksByProject: (projectId: string) => Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Omit<Task, 'id' | 'createdAt' | 'projectId'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const getTasksByProject = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'projectId'>>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  return (
    <TaskContext.Provider value={{ tasks, getTasksByProject, addTask, updateTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
};
