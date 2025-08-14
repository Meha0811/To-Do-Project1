const express = require('express');
const router = express.Router();
const recurringController = require('../controllers/recurringtask.controller');
const awaitHandler = require('../middleware/awaitHandlerFactory.middleware');
const validate = require('../middleware/validators/validate');
const {
  createRecurringTaskValidator,
  addExceptionValidator,
  removeExceptionValidator
} = require('../middleware/validators/recurringtaskValidator.middleware');

// Recurring task
router.post(
  '/',
  createRecurringTaskValidator,
  validate,
  awaitHandler(recurringController.createRecurringTask)
);

router.get('/:taskId', awaitHandler(recurringController.getRecurringTask));

// Exceptions
router.post(
  '/exception',
  addExceptionValidator,
  validate,
  awaitHandler(recurringController.addException)
);

router.get('/exception/:taskId', awaitHandler(recurringController.getExceptions));

router.delete(
  '/exception/:taskId',
  removeExceptionValidator,
  validate,
  awaitHandler(recurringController.removeException)
);

module.exports = router;
