// routes/recurringTask.routes.js

const express = require('express');
const router = express.Router();
const recurringController = require('../controllers/recurringTask.route');

// Create recurring task
router.post('/', recurringController.createRecurringTask);

// Get recurring task by task ID
router.get('/:taskId', recurringController.getRecurringByTask);

// Update recurring task
router.put('/:taskId', recurringController.updateRecurringTask);

// Delete recurring task
router.delete('/:taskId', recurringController.deleteRecurringTask);

module.exports = router;