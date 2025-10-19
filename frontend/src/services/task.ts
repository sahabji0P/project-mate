import api from './api';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type ListSection = 'today' | 'tomorrow' | 'later';

export interface Task {
    _id: string;
    projectId: string;
    userId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    color: string;
    completed: boolean;
    order: number;
    listSection: ListSection;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    color?: string;
    order?: number;
    listSection?: ListSection;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    color?: string;
    completed?: boolean;
    order?: number;
    listSection?: ListSection;
}

export interface UpdateTaskStatusData {
    status: TaskStatus;
}

class TaskService {
    // Get all tasks for a project
    async getTasks(projectId: string): Promise<Task[]> {
        const response = await api.get(`/projects/${projectId}/tasks`);
        return response.data.data;
    }

    // Get a single task
    async getTask(projectId: string, taskId: string): Promise<Task> {
        const response = await api.get(`/projects/${projectId}/tasks/${taskId}`);
        return response.data.data;
    }

    // Create a new task
    async createTask(projectId: string, data: CreateTaskData): Promise<Task> {
        const response = await api.post(`/projects/${projectId}/tasks`, data);
        return response.data.data;
    }

    // Update a task
    async updateTask(projectId: string, taskId: string, data: UpdateTaskData): Promise<Task> {
        const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, data);
        return response.data.data;
    }

    // Update task status only
    async updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Promise<Task> {
        const response = await api.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status });
        return response.data.data;
    }

    // Delete a task
    async deleteTask(projectId: string, taskId: string): Promise<void> {
        await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    }
}

export default new TaskService();
