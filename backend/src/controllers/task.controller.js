const Task = require('../models/Task');
const Project = require('../models/Project');
const { NotFoundError, AuthorizationError } = require('../utils/customErrors');
const logger = require('../utils/logger');

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getTasks = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        // Verify project exists and user owns it
        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        if (project.userId.toString() !== req.user._id.toString()) {
            throw new AuthorizationError('Not authorized to access this project');
        }

        // Get tasks
        const tasks = await Task.find({ projectId })
            .sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single task
// @route   GET /api/projects/:projectId/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
    try {
        const { projectId, id } = req.params;

        const task = await Task.findOne({ _id: id, projectId });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        // Check ownership
        if (task.userId.toString() !== req.user._id.toString()) {
            throw new AuthorizationError('Not authorized to access this task');
        }

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        // Verify project exists and user owns it
        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        if (project.userId.toString() !== req.user._id.toString()) {
            throw new AuthorizationError('Not authorized to create task in this project');
        }

        // Create task
        const task = await Task.create({
            ...req.body,
            projectId,
            userId: req.user._id,
        });

        logger.info(`Task created: ${task.title} in project ${project.name}`);

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update task
// @route   PUT /api/projects/:projectId/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
    try {
        const { projectId, id } = req.params;

        const task = await Task.findOne({ _id: id, projectId });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        // Check ownership
        if (task.userId.toString() !== req.user._id.toString()) {
            throw new AuthorizationError('Not authorized to update this task');
        }

        // Update task
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        logger.info(`Task updated: ${updatedTask.title}`);

        res.status(200).json({
            success: true,
            data: updatedTask,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update task status
// @route   PATCH /api/projects/:projectId/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res, next) => {
    try {
        const { projectId, id } = req.params;
        const { status } = req.body;

        const task = await Task.findOne({ _id: id, projectId });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        // Check ownership
        if (task.userId.toString() !== req.user._id.toString()) {
            throw new AuthorizationError('Not authorized to update this task');
        }

        // Update status
        task.status = status;
        await task.save();

        logger.info(`Task status updated: ${task.title} -> ${status}`);

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete task
// @route   DELETE /api/projects/:projectId/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
    try {
        const { projectId, id } = req.params;

        const task = await Task.findOne({ _id: id, projectId });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        // Check ownership
        if (task.userId.toString() !== req.user._id.toString()) {
            throw new AuthorizationError('Not authorized to delete this task');
        }

        await task.deleteOne();

        logger.info(`Task deleted: ${task.title}`);

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
};