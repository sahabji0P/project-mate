const Project = require('../models/Project');
const Task = require('../models/Task');
const { sendChatMessage, generateProjectSummary } = require('../services/gemini.service');
const { NotFoundError, AuthorizationError } = require('../utils/customErrors');
const logger = require('../utils/logger');

// @desc    Send chat message to AI
// @route   POST /api/ai/chat
// @access  Private
const chat = async (req, res, next) => {
    try {
        const { message, projectId } = req.body;

        let context = {};

        // If projectId is provided, fetch project and tasks for context
        if (projectId) {
            const project = await Project.findById(projectId);

            if (!project) {
                throw new NotFoundError('Project not found');
            }

            if (project.userId.toString() !== req.user._id.toString()) {
                throw new AuthorizationError('Not authorized to access this project');
            }

            const tasks = await Task.find({ projectId }).sort({ order: 1 });

            context = {
                project: {
                    name: project.name,
                    description: project.description,
                },
                tasks: tasks.map(task => ({
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                })),
            };
        }

        // Get AI response
        const aiResponse = await sendChatMessage(message, context);

        logger.info(`AI chat message processed for user: ${req.user.email}`);

        res.status(200).json({
            success: true,
            data: {
                message: aiResponse,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Generate project summary
// @route   POST /api/ai/summarize/:projectId
// @access  Private
const summarizeProject = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        // Fetch project
        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        if (project.userId.toString() !== req.user._id.toString()) {
            throw new AuthorizationError('Not authorized to access this project');
        }

        // Fetch tasks
        const tasks = await Task.find({ projectId }).sort({ createdAt: -1 });

        // Generate summary
        const summary = await generateProjectSummary(project, tasks);

        logger.info(`Project summary generated for: ${project.name}`);

        res.status(200).json({
            success: true,
            data: {
                summary,
                stats: {
                    totalTasks: tasks.length,
                    completedTasks: tasks.filter(t => t.status === 'done').length,
                    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
                    todoTasks: tasks.filter(t => t.status === 'todo').length,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    chat,
    summarizeProject,
};