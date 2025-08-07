const { body } = require('express-validator');

exports.createCategoryValidator = [
  body('user_id')
    .notEmpty().withMessage('User ID is required')
    .isInt().withMessage('User ID must be an integer'),

  body('name')
    .notEmpty().withMessage('Category name is required'),

  body('color_code')
    .optional()
    .matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/).withMessage('Invalid hex color code')
];

exports.updateCategoryValidator = [
  body().custom(body => Object.keys(body).length > 0)
    .withMessage('At least one field is required to update'),

  body('name')
    .optional()
    .notEmpty().withMessage("Name can't be empty"),

  body('color_code')
    .optional()
    .matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/).withMessage('Invalid hex color code')
];