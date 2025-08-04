const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const awaitHandler = require('../middleware/awaitHandlerFactory.middleware');
const validate = require('../middleware/validators/validate');
const {
  createTaskValidator,
  updateTaskValidator,
} = require('../middleware/validators/task.validator');

// Routes
router.post('/', createTaskValidator, validate, awaitHandler(taskController.createTask));
router.get('/', awaitHandler(taskController.getAllTasks));
router.get('/:id', awaitHandler(taskController.getTaskById));
router.put('/:id', updateTaskValidator, validate, awaitHandler(taskController.updateTask));
router.delete('/:id', awaitHandler(taskController.deleteTask));

module.exports = router;
