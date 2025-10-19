const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/user.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validation');
const { updateProfileSchema } = require('../utils/validationSchemas');

// All routes are protected
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);

module.exports = router;