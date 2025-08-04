const { body } = require('express-validator');

exports.createTaskValidator = [
  body('user_id').notEmpty().withMessage('User ID is required').isInt(),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('category_id').optional().isInt(),
  body('priority').optional().isIn(['Low', 'Medium', 'High']),
  body('due_date').optional().isISO8601().withMessage('Invalid date format'),
  body('is_completed').optional().isBoolean(),
  body('is_archived').optional().isBoolean(),
  body('is_starred').optional().isBoolean(),
  body('color_tag').optional().isString(),
  body('repeat_pattern').optional().isIn(['None', 'Daily', 'Weekly', 'Monthly']),
];

exports.updateTaskValidator = [
  body().custom(body => Object.keys(body).length > 0).withMessage('At least one field is required to update'),
];
