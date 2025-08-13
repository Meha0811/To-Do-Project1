const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminder.controller');
const reminderValidator = require('../middleware/validators/reminderValidator.middleware');

// Create reminder
router.post('/', reminderValidator, reminderController.createReminder);

// Get all reminders
router.get('/', reminderController.getAllReminders);

// Get reminder by task ID
router.get('/task/:taskId', reminderController.getRemindersByTaskId);

// Update reminder by task ID
router.put('/task', reminderValidator, reminderController.updateReminder);

// Delete reminder by task ID
router.delete('/task/:taskId', reminderController.deleteReminder);

module.exports = router;