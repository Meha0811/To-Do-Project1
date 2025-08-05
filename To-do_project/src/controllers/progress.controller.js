// controllers/progress.controller.js

const Progress = require('../models/progress.model');

// Create progress entry for a task
exports.createProgress = async (req, res) => {
  try {
    const { task_id, progress_percentage } = req.body;
    const progress = await Progress.create({ task_id, progress_percentage });
    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create progress' });
  }
};

// Get progress by task ID
exports.getProgressByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const progress = await Progress.findOne({ where: { task_id: taskId } });
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    res.status(200).json(progress);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve progress' });
  }
};

// Update progress percentage
exports.updateProgress = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { progress_percentage } = req.body;

    const updated = await Progress.update(
      { progress_percentage, updated_at: new Date() },
      { where: { task_id: taskId } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    res.status(200).json({ message: 'Progress updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

// Reset progress
exports.resetProgress = async (req, res) => {
  try {
    const { taskId } = req.params;
    const reset = await Progress.update(
      { progress_percentage: 0.0, updated_at: new Date() },
      { where: { task_id: taskId } }
    );

    if (reset[0] === 0) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    res.status(200).json({ message: 'Progress reset successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset progress' });
  }
};