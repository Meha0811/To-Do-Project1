const RecurringTask = require('../models/recurringtask.model');
const Progress = require('../models/progress.model');

// Create recurring task
exports.createRecurringTask = async (req, res, next) => {
  try {
    const { task_id, pattern, next_occurence } = req.body;
    const result = await RecurringTask.createRecurringTask({ task_id, pattern, next_occurence });
    res.status(201).json({ message: 'Recurring task created', recurring_id: result.insertId });
  } catch (err) {
    next(err);
  }
};

// Get recurring task
exports.getRecurringTask = async (req, res, next) => {
  try {
    const task_id = req.params.taskId;
    const recurringTask = await RecurringTask.getRecurringTask(task_id);
    if (!recurringTask) return res.status(404).json({ message: 'Recurring task not found' });
    res.json(recurringTask);
  } catch (err) {
    next(err);
  }
};

// Exceptions
exports.addException = async (req, res, next) => {
  try {
    const result = await RecurringTask.addException(req.body);
    res.status(201).json({ message: 'Exception added', id: result.insertId });
  } catch (err) {
    next(err);
  }
};

exports.getExceptions = async (req, res, next) => {
  try {
    const recurring_id = req.params.taskId;
    const exceptions = await RecurringTask.getExceptions(recurring_id);
    res.json(exceptions);
  } catch (err) {
    next(err);
  }
};

exports.removeException = async (req, res, next) => {
  try {
    const recurring_id = req.params.taskId;
    const { date } = req.query;
    const result = await RecurringTask.removeException(recurring_id, date);
    res.json({ message: 'Exception removed', result });
  } catch (err) {
    next(err);
  }
};
