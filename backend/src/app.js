require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('../config/database');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.route');
const aiRoutes = require('./routes/ai.routes');

const app = express();
app.set('trust proxy', 1);


// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'https://task-mate-sigma.vercel.app',
    credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 10) * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 50,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        logger.debug(`${req.method} ${req.path}`);
        next();
    });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', taskRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    process.exit(1);
});

module.exports = app;