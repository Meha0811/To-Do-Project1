const ReminderModel = require('../models/reminder.model');

// Create a new reminder
exports.createReminder = async (req, res, next) => {
  try {
    const { task_id, reminder_time } = req.body;

    if (!task_id || !reminder_time) {
      return res.status(400).json({ message: 'task_id and reminder_time are required' });
    }

    const result = await ReminderModel.createReminder({ task_id, reminder_time });

    res.status(201).json({
      message: 'Reminder created successfully',
      reminderId: result.insertId
    });
  } catch (error) {
    console.error('Reminder Error:', error);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
};

// Get all reminders
exports.getAllReminders = async (req, res, next) => {
  try {
    const reminders = await ReminderModel.getAllReminders();
    res.status(200).json(reminders);
  } catch (error) {
    next(error);
  }
};

// Get reminders by task ID
exports.getRemindersByTaskId = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const reminders = await ReminderModel.getRemindersByTaskId(taskId);
    res.status(200).json(reminders);
  } catch (error) {
    next(error);
  }
};

// Delete a reminder
exports.deleteReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ReminderModel.deleteReminder(id);
    res.status(200).json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    next(error);
  }
};
