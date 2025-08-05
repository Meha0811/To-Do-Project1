// routes/progress.routes.js

const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');

// Create progress
router.post('/', progressController.createProgress);

// Get progress by task ID
router.get('/:taskId', progressController.getProgressByTask);

// Update progress
router.put('/:taskId', progressController.updateProgress);

// Reset progress
router.put('/:taskId/reset', progressController.resetProgress);

module.exports = router;