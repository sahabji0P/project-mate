const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Send a chat message to Gemini AI with context
 * @param {string} message - User's message
 * @param {Object} context - Context object containing project and tasks data
 * @returns {Promise<string>} - AI response
 */
const sendChatMessage = async (message, context = {}) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Build context prompt
        let contextPrompt = 'You are a helpful AI assistant for a task management application called TaskMate.\n\n';

        if (context.project) {
            contextPrompt += `Current Project: ${context.project.name}\n`;
            if (context.project.description) {
                contextPrompt += `Project Description: ${context.project.description}\n`;
            }
        }

        if (context.tasks && context.tasks.length > 0) {
            contextPrompt += '\nCurrent Tasks:\n';
            context.tasks.forEach((task, index) => {
                contextPrompt += `${index + 1}. [${task.status.toUpperCase()}] ${task.title}`;
                if (task.description) {
                    contextPrompt += ` - ${task.description}`;
                }
                contextPrompt += ` (Priority: ${task.priority})\n`;
            });
        }

        contextPrompt += `\nUser Question: ${message}\n\n`;
        contextPrompt += 'Please provide a helpful and concise response based on the context above.';

        // Generate response
        const result = await model.generateContent(contextPrompt);
        const response = await result.response;
        const text = response.text();

        logger.debug('Gemini AI response generated successfully');

        return text;
    } catch (error) {
        logger.error(`Gemini AI error: ${error.message}`);
        throw new Error('Failed to generate AI response');
    }
};

/**
 * Generate a project summary using Gemini AI
 * @param {Object} project - Project object
 * @param {Array} tasks - Array of tasks
 * @returns {Promise<string>} - Summary text
 */
const generateProjectSummary = async (project, tasks) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Calculate task statistics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'done').length;
        const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
        const todoTasks = tasks.filter(t => t.status === 'todo').length;
        const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;

        const prompt = `
Generate a brief, insightful summary for the following project:

Project Name: ${project.name}
Project Description: ${project.description || 'No description'}

Task Statistics:
- Total Tasks: ${totalTasks}
- Completed: ${completedTasks}
- In Progress: ${inProgressTasks}
- To Do: ${todoTasks}
- High Priority: ${highPriorityTasks}

Recent Tasks:
${tasks.slice(0, 5).map((task, i) =>
            `${i + 1}. [${task.status}] ${task.title} (${task.priority} priority)`
        ).join('\n')}

Please provide:
1. A brief overview of the project's current status
2. Key insights about task completion and priorities
3. Any recommendations or observations

Keep the summary concise (3-4 paragraphs maximum).
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        logger.info(`Project summary generated for: ${project.name}`);

        return text;
    } catch (error) {
        logger.error(`Gemini AI summary error: ${error.message}`);
        throw new Error('Failed to generate project summary');
    }
};

module.exports = {
    sendChatMessage,
    generateProjectSummary,
};