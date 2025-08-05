const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminder.controller');

// Create reminder
router.post('/', reminderController.createReminder);

// Get all reminders
router.get('/', reminderController.getAllReminders);

// Get reminders by task_id
router.get('/task/:taskId', reminderController.getRemindersByTaskId);

// Delete a reminder
router.delete('/:id', reminderController.deleteReminder);

module.exports = router;
