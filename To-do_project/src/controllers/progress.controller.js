const Progress = require('../models/progress.model');

exports.createOrUpdateProgress = async (req, res, next) => {
  try {
    const { task_id, recurring_instance_date, progress_percentage } = req.body;
    const result = await Progress.upsert({ task_id, recurring_instance_date, progress_percentage });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getProgressByTask = async (req, res, next) => {
  try {
    const task_id = req.params.taskId;
    const recurring_instance_date = req.query.date || null;
    const result = await Progress.getByTask(task_id, recurring_instance_date);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.resetProgress = async (req, res, next) => {
  try {
    const task_id = req.params.taskId;
    const recurring_instance_date = req.query.date || null;
    const result = await Progress.reset(task_id, recurring_instance_date);
    res.json({ message: 'Progress reset', result });
  } catch (err) {
    next(err);
  }
};
