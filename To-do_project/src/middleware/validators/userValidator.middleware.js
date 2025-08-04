const { body } = require('express-validator');

exports.createUserValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail()
];

exports.updateUserValidator = [
  body('name')
    .optional()
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),

  body('email')
    .optional()
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),

  body().custom(body => {
    const allowedFields = ['name', 'email'];
    const fields = Object.keys(body);
    return fields.every(field => allowedFields.includes(field));
  }).withMessage('Invalid fields in update request')
];
