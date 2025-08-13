const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const validate = require('../middleware/validators/validate');
const { createProgressValidator } = require('../middleware/validators/progressValidator.middleware');
const awaitHandler = require('../middleware/awaitHandlerFactory.middleware');

// Create or update progress
router.post('/', createProgressValidator, validate, awaitHandler(progressController.createOrUpdateProgress));

// Get progress by task
router.get('/:taskId', awaitHandler(progressController.getProgressByTask));

// Reset progress
router.put('/:taskId/reset', awaitHandler(progressController.resetProgress));

module.exports = router;
