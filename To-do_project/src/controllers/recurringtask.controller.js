// controllers/recurringTask.controller.js

const RecurringTask = require('../models/recurringTask.model');

// Create recurring task entry
exports.createRecurringTask = async (req, res) => {
  try {
    const { task_id, pattern, next_occurence } = req.body;
    const newRecurring = await RecurringTask.create({ task_id, pattern, next_occurence });
    res.status(201).json(newRecurring);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create recurring task' });
  }
};

// Get recurring task by task ID
exports.getRecurringByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const recurring = await RecurringTask.findOne({ where: { task_id: taskId } });
    if (!recurring) return res.status(404).json({ error: 'Recurring task not found' });
    res.status(200).json(recurring);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve recurring task' });
  }
};

// Update recurring task pattern or next occurrence
exports.updateRecurringTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { pattern, next_occurence } = req.body;

    const updated = await RecurringTask.update(
      { pattern, next_occurence },
      { where: { task_id: taskId } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ error: 'Recurring task not found' });
    }

    res.status(200).json({ message: 'Recurring task updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update recurring task' });
  }
};

// Delete recurring task (optional)
exports.deleteRecurringTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const deleted = await RecurringTask.destroy({ where: { task_id: taskId } });

    if (!deleted) {
      return res.status(404).json({ error: 'Recurring task not found' });
    }

    res.status(200).json({ message: 'Recurring task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete recurring task' });
  }
};