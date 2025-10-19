const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
} = require('../controllers/task.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validation');
const {
    createTaskSchema,
    updateTaskSchema,
    updateTaskStatusSchema,
} = require('../utils/validationSchemas');

// All routes are protected
router.use(authenticate);

router.route('/:projectId/tasks')
    .get(getTasks)
    .post(validate(createTaskSchema), createTask);

router.route('/:projectId/tasks/:id')
    .get(getTask)
    .put(validate(updateTaskSchema), updateTask)
    .delete(deleteTask);

router.patch(
    '/:projectId/tasks/:id/status',
    validate(updateTaskStatusSchema),
    updateTaskStatus
);

module.exports = router;