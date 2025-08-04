const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

router.post('/', taskController.createTask);
router.get('/user/:userId', taskController.getTasksForUser);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.put('/:id/complete', taskController.markAsCompleted);
router.put('/:id/archive', taskController.archiveTask);
router.put('/:id/unarchive', taskController.unarchiveTask);

module.exports = router;
