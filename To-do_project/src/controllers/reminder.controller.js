const ReminderModel = require('../models/reminder.model');

// Create reminder
exports.createReminder = async (req, res, next) => {
  try {
    const { task_id, reminder_time } = req.body;
    const result = await ReminderModel.createReminder({ task_id, reminder_time });
    res.status(201).json({ message: 'Reminder created successfully', reminder_id: result.insertId });
  } catch (err) {
    next(err);
  }
};

// Get all upcoming reminders
exports.getAllReminders = async (req, res, next) => {
  try {
    const reminders = await ReminderModel.getAllUpcomingReminders();
    res.status(200).json(reminders);
  } catch (err) {
    next(err);
  }
};

// Get reminder by task ID
exports.getRemindersByTaskId = async (req, res, next) => {
  try {
    const reminder = await ReminderModel.getReminderByTaskId(req.params.taskId);
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json(reminder);
  } catch (err) {
    next(err);
  }
};

// Update reminder
exports.updateReminder = async (req, res, next) => {
  try {
    const { task_id, reminder_time } = req.body;
    await ReminderModel.updateReminderByTaskId(task_id, reminder_time);
    res.json({ message: 'Reminder updated successfully' });
  } catch (err) {
    next(err);
  }
};

// Delete reminder
exports.deleteReminder = async (req, res, next) => {
  try {
    await ReminderModel.deleteReminderByTaskId(req.params.taskId);
    res.json({ message: 'Reminder deleted successfully' });
  } catch (err) {
    next(err);
  }
};
