const express = require('express');
const router = express.Router();
const exceptionController = require('../controllers/recurring_task_exceptions.controller');

// Add an exception date to skip
router.post('/', exceptionController.addException);

// Get all exceptions for a recurring task
router.get('/:taskId', exceptionController.getExceptionsByTask);

// Remove an exception date (pass ?date=YYYY-MM-DD)
router.delete('/:taskId', exceptionController.removeException);

module.exports = router;