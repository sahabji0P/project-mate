const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
} = require('../controllers/project.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validation');
const { createProjectSchema, updateProjectSchema } = require('../utils/validationSchemas');

// All routes are protected
router.use(authenticate);

router.route('/')
    .get(getProjects)
    .post(validate(createProjectSchema), createProject);

router.route('/:id')
    .get(getProject)
    .put(validate(updateProjectSchema), updateProject)
    .delete(deleteProject);

module.exports = router;