const TaskModel = require('../models/task.model');
const ReminderModel = require('../models/reminder.model');
const UserModel = require('../models/user.model');
const sendReminderEmail = require('../services/emailReminder.service');

function subtractTime(date, minutes) {
  return new Date(date.getTime() - minutes * 60000);
}

// Create a new task and set reminder
exports.createTask = async (req, res, next) => {
  try {
    const task = req.body;

    if (!task.user_id || !task.title || !task.due_date) {
      return res.status(400).json({ message: 'user_id, title, and due_date are required' });
    }

    const result = await TaskModel.createTask(task);
    const taskId = result.insertId;

    // Get user email
    const user = await UserModel.getUserById(task.user_id);
    if (!user || !user.email) {
      return res.status(404).json({ message: 'User email not found' });
    }

    // Create reminder (custom or default 60 minutes before)
    const dueDate = new Date(task.due_date);
    const reminderTime = task.reminder_time
      ? new Date(task.reminder_time)
      : subtractTime(dueDate, 60);

    await ReminderModel.createReminder({
      task_id: taskId,
      reminder_time: reminderTime
    });

    // Schedule email (basic immediate logic for demo)
    const now = new Date();
    const timeDiff = reminderTime - now;

    if (timeDiff > 0) {
      setTimeout(() => {
        sendReminderEmail(
          user.email,
          `Reminder: ${task.title}`,
          `Hey ${user.name}, don't forget to complete your task: "${task.title}" by ${dueDate}`
        );
      }, timeDiff);
    }

    res.status(201).json({
      message: 'Task created and reminder scheduled',
      taskId
    });
  } catch (error) {
    next(error);
  }
};
