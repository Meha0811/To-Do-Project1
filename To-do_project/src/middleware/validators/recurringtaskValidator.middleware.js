const { body } = require('express-validator');

exports.createRecurringValidator = [
  body('task_id').notEmpty().withMessage('task_id is required').isInt(),
  body('pattern').notEmpty().withMessage('pattern is required').isIn(['Daily', 'Weekly', 'Monthly']),
  body('next_occurence').notEmpty().withMessage('next_occurence is required').isISO8601()
];

exports.exceptionValidator = [
  body('recurring_id').notEmpty().withMessage('recurring_id is required').isInt(),
  body('exception_date').notEmpty().withMessage('exception_date is required').isISO8601(),
  body('reason').optional().isString()
];
