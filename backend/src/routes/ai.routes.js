const express = require('express');
const router = express.Router();
const { chat, summarizeProject } = require('../controllers/ai.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validation');
const { aiChatSchema } = require('../utils/validationSchemas');

// All routes are protected
router.use(authenticate);

router.post('/chat', validate(aiChatSchema), chat);
router.post('/summarize/:projectId', summarizeProject);

module.exports = router;