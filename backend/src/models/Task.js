const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project ID is required'],
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        minlength: [1, 'Task title cannot be empty'],
        maxlength: [200, 'Task title cannot exceed 200 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
        default: '',
    },
    status: {
        type: String,
        enum: {
            values: ['todo', 'in-progress', 'done'],
            message: '{VALUE} is not a valid status',
        },
        default: 'todo',
    },
    priority: {
        type: String,
        enum: {
            values: ['high', 'medium', 'low'],
            message: '{VALUE} is not a valid priority',
        },
        default: 'medium',
    },
    color: {
        type: String,
        match: [/^#[0-9A-Fa-f]{6}$/, 'Please provide a valid hex color code'],
        default: '#3b82f6',
    },
    completed: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
});

// Indexes for faster queries
taskSchema.index({ projectId: 1, status: 1, order: 1 });
taskSchema.index({ userId: 1 });

// Auto-update completed based on status
taskSchema.pre('save', function (next) {
    this.completed = this.status === 'done';
    next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;