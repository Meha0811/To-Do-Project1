const { body } = require('express-validator');

exports.createUserValidator = [
  body('name')
    .exists()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),

  body('email')
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
];

exports.updateUserValidator = [
  body('name')
    .exists()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),

  body('email')
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
];

