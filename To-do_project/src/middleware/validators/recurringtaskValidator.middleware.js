const { body, query } = require('express-validator');

exports.createRecurringTaskValidator = [
  body('task_id').notEmpty().withMessage('Task ID is required').isInt(),
  body('pattern')
    .notEmpty()
    .withMessage('Pattern is required')
    .isIn(['Daily', 'Weekly', 'Monthly'])
    .withMessage('Pattern must be Daily, Weekly or Monthly'),
  body('next_occurence').notEmpty().withMessage('Next occurence is required').isISO8601()
];

exports.addExceptionValidator = [
  body('recurring_id').notEmpty().withMessage('Recurring task ID is required').isInt(),
  body('exception_date').notEmpty().withMessage('Exception date is required').isISO8601(),
  body('reason').optional().isString()
];

exports.removeExceptionValidator = [
  query('date').notEmpty().withMessage('Exception date is required').isISO8601()
];
