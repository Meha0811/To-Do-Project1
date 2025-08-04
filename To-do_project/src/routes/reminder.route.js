const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminder.controller');
const awaitHandler = require('../middleware/awaitHandlerFactory.middleware');
const validate = require('../middleware/validators/validate');
const {
  createReminderValidator,
  updateReminderValidator,
} = require('../middleware/validators/reminder.validator');

router.post('/', createReminderValidator, validate, awaitHandler(reminderController.createReminder));
router.get('/', awaitHandler(reminderController.getAllReminders));
router.get('/:id', awaitHandler(reminderController.getReminderById));
router.put('/:id', updateReminderValidator, validate, awaitHandler(reminderController.updateReminder));
router.delete('/:id', awaitHandler(reminderController.deleteReminder));

module.exports = router;
