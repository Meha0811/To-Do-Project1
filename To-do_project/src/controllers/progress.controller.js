const ProgressModel = require('../models/progress.model');

// ✅ Create or Update Progress
exports.createOrUpdateProgress = async (req, res, next) => {
  try {
    const result = await ProgressModel.upsert(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

// ✅ Get Progress By Task
exports.getProgressByTask = async (req, res, next) => {
  try {
    const task_id = req.params.taskId;
    const date = req.query.date || null;
    const progress = await ProgressModel.getByTask(task_id, date);
    res.status(200).json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

// ✅ Reset Progress
exports.resetProgress = async (req, res, next) => {
  try {
    const task_id = req.params.taskId;
    const date = req.query.date || null;
    const result = await ProgressModel.reset(task_id, date);
    res.status(200).json({ message: 'Progress reset', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};
