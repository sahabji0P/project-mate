const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET
        // { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
    );
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('ACCESS_TOKEN_EXPIRED');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('INVALID_ACCESS_TOKEN');
        }
        throw error;
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('REFRESH_TOKEN_EXPIRED');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('INVALID_REFRESH_TOKEN');
        }
        throw error;
    }
};

// New helper function to generate both tokens
const generateTokenPair = (userId) => {
    return {
        accessToken: generateAccessToken(userId),
        refreshToken: generateRefreshToken(userId)
    };
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTokenPair,
    verifyAccessToken,
    verifyRefreshToken,
};