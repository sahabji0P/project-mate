const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().trim(),
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(50).trim(),
    email: Joi.string().email().lowercase().trim(),
}).min(1);

// Project validation schemas
const createProjectSchema = Joi.object({
    name: Joi.string().min(1).max(100).required().trim(),
    description: Joi.string().max(500).allow('').trim(),
});

const updateProjectSchema = Joi.object({
    name: Joi.string().min(1).max(100).trim(),
    description: Joi.string().max(500).allow('').trim(),
}).min(1);

// Task validation schemas
const createTaskSchema = Joi.object({
    title: Joi.string().min(1).max(200).required().trim(),
    description: Joi.string().max(1000).allow('').trim(),
    status: Joi.string().valid('todo', 'in-progress', 'done').default('todo'),
    priority: Joi.string().valid('high', 'medium', 'low').default('medium'),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#3b82f6'),
    order: Joi.number().integer().min(0).default(0),
    listSection: Joi.string().valid('today', 'tomorrow', 'later').default('today'),
});

const updateTaskSchema = Joi.object({
    title: Joi.string().min(1).max(200).trim(),
    description: Joi.string().max(1000).allow('').trim(),
    status: Joi.string().valid('todo', 'in-progress', 'done'),
    priority: Joi.string().valid('high', 'medium', 'low'),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    completed: Joi.boolean(),
    order: Joi.number().integer().min(0),
    listSection: Joi.string().valid('today', 'tomorrow', 'later'),
}).min(1);

const updateTaskStatusSchema = Joi.object({
    status: Joi.string().valid('todo', 'in-progress', 'done').required(),
});

// Auth refresh schema
const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

// AI validation schemas
const aiChatSchema = Joi.object({
    message: Joi.string().min(1).max(1000).required().trim(),
    projectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
});

module.exports = {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    createProjectSchema,
    updateProjectSchema,
    createTaskSchema,
    updateTaskSchema,
    updateTaskStatusSchema,
    refreshTokenSchema,
    aiChatSchema,
};