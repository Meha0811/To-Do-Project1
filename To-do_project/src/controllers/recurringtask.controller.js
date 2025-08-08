const Exceptions = require('../models/recurring_task_exceptions.model');

// Add exception
exports.addException = (req, res) => {
  Exceptions.addException(req.body, (err, result) => {
    if (err) {
      console.error('Add exception error:', err);
      return res.status(500).json({ message: 'Server error', error: err });
    }
    res.status(201).json(result);
  });
};

// Get all exceptions for a recurring task
exports.getExceptionsByTask = (req, res) => {
  const recurring_task_id = req.params.taskId;

  Exceptions.getExceptionsByTask(recurring_task_id, (err, rows) => {
    if (err) {
      console.error('Fetch exceptions error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json(rows);
  });
};

// Remove exception
exports.removeException = (req, res) => {
  const { taskId } = req.params;
  const { date } = req.query;

  Exceptions.removeException(taskId, date, (err, result) => {
    if (err) {
      console.error('Remove exception error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json(result);
  });
};