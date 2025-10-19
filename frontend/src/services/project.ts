import api from './api';

export interface Project {
    _id: string;
    userId: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectData {
    name: string;
    description?: string;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
}

class ProjectService {
    // Get all projects for the logged-in user
    async getProjects(): Promise<Project[]> {
        const response = await api.get('/projects');
        return response.data.data;
    }

    // Get a single project
    async getProject(id: string): Promise<Project> {
        const response = await api.get(`/projects/${id}`);
        return response.data.data;
    }

    // Create a new project
    async createProject(data: CreateProjectData): Promise<Project> {
        const response = await api.post('/projects', data);
        return response.data.data;
    }

    // Update a project
    async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
        const response = await api.put(`/projects/${id}`, data);
        return response.data.data;
    }

    // Delete a project
    async deleteProject(id: string): Promise<void> {
        await api.delete(`/projects/${id}`);
    }
}

export default new ProjectService();