const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const awaitHandler = require('../middleware/awaitHandlerFactory.middleware');
const validate = require('../middleware/validators/validate');
const { createOrUpdateProgressValidator } = require('../middleware/validators/progressValidator.middleware');

// Create or update progress
router.post('/', createOrUpdateProgressValidator, validate, awaitHandler(progressController.createOrUpdateProgress));

// Get progress by task ID
router.get('/:taskId', awaitHandler(progressController.getProgressByTask));

// Reset progress
router.put('/:taskId/reset', awaitHandler(progressController.resetProgress));

module.exports = router;
