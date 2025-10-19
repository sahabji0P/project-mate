const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validation');
const { registerSchema, loginSchema, refreshTokenSchema } = require('../utils/validationSchemas');

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refresh);

// Protected routes
router.post('/logout', authenticate, logout);

module.exports = router;