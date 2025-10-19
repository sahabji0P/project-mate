const Project = require('../models/Project');
const Task = require('../models/Task');
const { NotFoundError, AuthorizationError } = require('../utils/customErrors');
const logger = require('../utils/logger');

// @desc    Get all projects for logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Check ownership
        if (project.userId.toString() !== req.user._id.toString()) {
            throw new AuthorizationError('Not authorized to access this project');
        }

        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const project = await Project.create({
            userId: req.user._id,
            name,
            description,
        });

        logger.info(`Project created: ${project.name} by user ${req.user.email}`);

        res.status(201).json({
            success: true,
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Check ownership
        if (project.userId.toString() !== req.user._id.toString()) {
            throw new AuthorizationError('Not authorized to update this project');
        }

        // Update project
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        logger.info(`Project updated: ${updatedProject.name}`);

        res.status(200).json({
            success: true,
            data: updatedProject,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Check ownership
        if (project.userId.toString() !== req.user._id.toString()) {
            throw new AuthorizationError('Not authorized to delete this project');
        }

        // Delete all tasks associated with this project
        await Task.deleteMany({ projectId: project._id });

        // Delete project
        await project.deleteOne();

        logger.info(`Project deleted: ${project.name}`);

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
};