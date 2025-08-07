const ReminderModel = require('../models/reminder.model');

// Create a new reminder
exports.createReminder = async (req, res, next) => {
  try {
    const reminder = req.body;
    const result = await ReminderModel.createReminder(reminder);
    res.status(201).json({ message: 'Reminder created successfully', reminder_id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// Get all upcoming (not sent) reminders
exports.getAllReminders = async (req, res, next) => {
  try {
    const reminders = await ReminderModel.getAllUpcomingReminders();
    res.status(200).json(reminders);
  } catch (error) {
    next(error);
  }
};

// Get reminder by task ID
exports.getRemindersByTaskId = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const reminder = await ReminderModel.getReminderByTaskId(taskId);
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found for this task' });
    }
    res.status(200).json(reminder);
  } catch (error) {
    next(error);
  }
};

// Update reminder by task ID
exports.updateReminder = async (req, res, next) => {
  try {
    const reminder = req.body;
    const result = await ReminderModel.updateReminderByTaskId(reminder);
    res.json({ message: 'Reminder updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete reminder by task ID
exports.deleteReminder = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const result = await ReminderModel.deleteReminderByTaskId(taskId);
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    next(error);
  }
};