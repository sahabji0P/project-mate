const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
        minlength: [1, 'Project name cannot be empty'],
        maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        default: '',
    },
}, {
    timestamps: true,
});

// Index for faster queries
projectSchema.index({ userId: 1, createdAt: -1 });

// Delete all tasks when project is deleted
projectSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    await mongoose.model('Task').deleteMany({ projectId: this._id });
    next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;