const User = require('../models/User');
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} = require('../services/token.service');
const {
    ValidationError,
    AuthenticationError,
    ConflictError
} = require('../utils/customErrors');
const logger = require('../utils/logger');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ConflictError('Email already registered');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token to user
        user.refreshTokens.push(refreshToken);
        await user.save();

        logger.info(`New user registered: ${user.email}`);

        res.status(201).json({
            success: true,
            data: {
                user,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            throw new AuthenticationError('Invalid credentials');
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            throw new AuthenticationError('Invalid credentials');
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token to user
        user.refreshTokens.push(refreshToken);
        await user.save();

        // Remove password from response
        user.password = undefined;

        logger.info(`User logged in: ${user.email}`);

        res.status(200).json({
            success: true,
            data: {
                user,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AuthenticationError('Refresh token required');
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Find user and check if refresh token exists
        const user = await User.findById(decoded.userId);

        if (!user || !user.refreshTokens.includes(refreshToken)) {
            throw new AuthenticationError('Invalid refresh token');
        }

        // Generate new access token
        const accessToken = generateAccessToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new ValidationError('Refresh token required');
        }

        // Remove refresh token from user
        const user = await User.findById(req.user._id);
        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        await user.save();

        logger.info(`User logged out: ${user.email}`);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
};