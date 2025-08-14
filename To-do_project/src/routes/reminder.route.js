const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminder.controller');
const { createReminderValidator, updateReminderValidator } = require('../middleware/validators/reminderValidator.middleware');
const validate = require('../middleware/validators/validate');
const awaitHandler = require('../middleware/awaitHandlerFactory.middleware');

router.post('/', createReminderValidator, validate, awaitHandler(reminderController.createReminder));
router.get('/', awaitHandler(reminderController.getAllReminders));
router.get('/task/:taskId', awaitHandler(reminderController.getRemindersByTaskId));
router.put('/task/:taskId', updateReminderValidator, validate, awaitHandler(reminderController.updateReminder));
router.delete('/task/:taskId', awaitHandler(reminderController.deleteReminder));

module.exports = router;
