const ReminderModel = require('../models/reminder.model');

const ReminderController = {
  // Create a reminder
  createReminder: async (req, res) => {
    try {
      const reminderData = req.body;
      const result = await ReminderModel.createReminder(reminderData);
      res.status(201).json({ message: 'Reminder created successfully', reminder_id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create reminder' });
    }
  },

  // Get a reminder by ID
  getReminderById: async (req, res) => {
    try {
      const reminderId = req.params.id;
      const reminder = await ReminderModel.getReminderById(reminderId);
      if (!reminder) {
        return res.status(404).json({ error: 'Reminder not found' });
      }
      res.status(200).json(reminder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get reminder' });
    }
  },

  // Get all reminders for a task
  getRemindersByTaskId: async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const reminders = await ReminderModel.getRemindersByTaskId(taskId);
      res.status(200).json(reminders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get reminders' });
    }
  },

  // Update a reminder
  updateReminder: async (req, res) => {
    try {
      const reminderId = req.params.id;
      const updatedData = req.body;
      await ReminderModel.updateReminder(reminderId, updatedData);
      res.status(200).json({ message: 'Reminder updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update reminder' });
    }
  },

  // Delete a reminder
  deleteReminder: async (req, res) => {
    try {
      const reminderId = req.params.id;
      await ReminderModel.deleteReminder(reminderId);
      res.status(200).json({ message: 'Reminder deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete reminder' });
    }
  }
};

module.exports = ReminderController;
