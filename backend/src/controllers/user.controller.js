const User = require('../models/User');
const { ConflictError } = require('../utils/customErrors');
const logger = require('../utils/logger');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        // Check if email is being changed and already exists
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new ConflictError('Email already in use');
            }
        }

        // Update user
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, email },
            {
                new: true,
                runValidators: true
            }
        );

        logger.info(`User profile updated: ${user.email}`);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
};