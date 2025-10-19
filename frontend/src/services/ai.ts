import api from './api';

export interface AIChatMessage {
    message: string;
    projectId?: string;
}

export interface AIChatResponse {
    message: string;
}

export interface ProjectSummaryResponse {
    summary: string;
    stats: {
        totalTasks: number;
        completedTasks: number;
        inProgressTasks: number;
        todoTasks: number;
    };
}

class AIService {
    /**
     * Send a chat message to the AI assistant
     * @param message - The user's message
     * @param projectId - Optional project ID for context
     * @returns AI response message
     */
    async sendChatMessage(
        message: string,
        projectId?: string
    ): Promise<AIChatResponse> {
        const response = await api.post<{ success: boolean; data: AIChatResponse }>(
            '/ai/chat',
            { message, projectId }
        );
        return response.data.data;
    }

    /**
     * Get AI-generated summary for a project
     * @param projectId - The project ID
     * @returns Project summary and statistics
     */
    async getProjectSummary(projectId: string): Promise<ProjectSummaryResponse> {
        const response = await api.post<{
            success: boolean;
            data: ProjectSummaryResponse;
        }>(`/ai/summarize/${projectId}`);
        return response.data.data;
    }
}

const aiService = new AIService();
export default aiService;
