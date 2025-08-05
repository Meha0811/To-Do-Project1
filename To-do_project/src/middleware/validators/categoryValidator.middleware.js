const { body } = require('express-validator');

exports.createCategoryValidator = [
  body('user_id').notEmpty().withMessage('User ID is required').isInt(),
  body('name').notEmpty().withMessage('Category name is required'),
  body('color_code').optional().isString(),
];

exports.updateCategoryValidator = [
  body().custom(body => Object.keys(body).length > 0).withMessage('At least one field is required to update'),
];
