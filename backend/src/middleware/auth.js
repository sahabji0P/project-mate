const { verifyAccessToken } = require('../services/token.service');
const { AuthenticationError } = require('../utils/customErrors');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided');
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyAccessToken(token);

        // Get user from database
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new AuthenticationError('User not found');
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new AuthenticationError('Invalid token'));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AuthenticationError('Token expired'));
        }
        next(error);
    }
};

module.exports = authenticate;