const { body } = require('express-validator');

exports.createProgressValidator = [
  body('task_id').notEmpty().withMessage('Task ID is required').isInt(),
  body('status').notEmpty().withMessage('Status is required'),
  body('notes').optional().isString(),
  body('is_recurring').optional().isBoolean(),
  body('recurring_instance_date').optional().isISO8601().withMessage('Invalid date format')
];
