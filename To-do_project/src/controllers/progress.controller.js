const Progress = require('../models/progress.model');

exports.createOrUpdateProgress = async (req, res) => {
  try {
    const result = await Progress.upsert(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProgressByTask = async (req, res) => {
  try {
    const task_id = req.params.taskId;
    const date = req.query.date || null;
    const result = await Progress.getByTask(task_id, date);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetProgress = async (req, res) => {
  try {
    const task_id = req.params.taskId;
    const date = req.query.date || null;
    const result = await Progress.reset(task_id, date);
    res.status(200).json({ message: 'Progress reset', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};