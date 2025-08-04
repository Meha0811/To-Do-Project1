const express = require('express');
const router = express.Router();
const ReminderController = require('../controllers/reminder.controller');

// POST /api/reminders
router.post('/', ReminderController.createReminder);

// GET /api/reminders/:id
router.get('/:id', ReminderController.getReminderById);

// GET /api/reminders/task/:taskId
router.get('/task/:taskId', ReminderController.getRemindersByTaskId);

// PUT /api/reminders/:id
router.put('/:id', ReminderController.updateReminder);

// DELETE /api/reminders/:id
router.delete('/:id', ReminderController.deleteReminder);

module.exports = router;
