const { body } = require('express-validator');

exports.createReminderValidator = [
  body('task_id').notEmpty().withMessage('Task ID is required').isInt(),
  body('reminder_time').notEmpty().withMessage('Reminder time is required').isISO8601(),
];

exports.updateReminderValidator = [
  body().custom(body => Object.keys(body).length > 0).withMessage('At least one field is required to update'),
];
