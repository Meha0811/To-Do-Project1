const { body, param } = require('express-validator');

exports.createOrUpdateProgressValidator = [
  body('task_id')
    .notEmpty()
    .withMessage('task_id is required')
    .isInt()
    .withMessage('task_id must be an integer'),
  body('progress_percentage')
    .notEmpty()
    .withMessage('progress_percentage is required')
    .isInt({ min: 0, max: 100 })
    .withMessage('progress_percentage must be between 0 and 100'),
];

exports.taskIdParamValidator = [
  param('taskId')
    .notEmpty()
    .withMessage('taskId parameter is required')
    .isInt()
    .withMessage('taskId must be an integer'),
];
