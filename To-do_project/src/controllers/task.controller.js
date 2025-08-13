const TaskModel = require('../models/task.model');
const ReminderModel = require('../models/reminder.model');
const UserModel = require('../models/user.model');
const { decrypt } = require('../utils/encryption.utils');
const sendReminderEmail = require('../services/emailReminder.service');

function subtractTime(date, minutes) {
  return new Date(date.getTime() - minutes * 60000);
}

// Create a new task with progress & recurring integration
exports.createTask = async (req, res, next) => {
  try {
    const task = req.body;

    if (!task.user_id || !task.title || !task.due_date) {
      return res.status(400).json({ message: 'user_id, title, and due_date are required' });
    }

    const result = await TaskModel.createTask(task);
    const taskId = result.insertId;

    // Get user email & decrypt
    const user = await UserModel.getUserById(task.user_id);
    if (!user || !user.email) {
      return res.status(404).json({ message: 'User email not found' });
    }
    const email = decrypt(user.email);

    // Create reminder (custom or default 60 min before)
    const dueDate = new Date(task.due_date);
    const reminderTime = task.reminder_time
      ? new Date(task.reminder_time)
      : subtractTime(dueDate, 60);

    await ReminderModel.createReminder({
      task_id: taskId,
      reminder_time: reminderTime
    });

    // Schedule email (demo)
    const now = new Date();
    const timeDiff = reminderTime - now;

    if (timeDiff > 0) {
      setTimeout(() => {
        sendReminderEmail(
          email,
          `Reminder: ${task.title}`,
          `Hey ${user.name}, don't forget to complete your task: "${task.title}" by ${dueDate}`
        );
      }, timeDiff);
    }

    res.status(201).json({
      message: 'Task created with progress and recurring integration',
      taskId
    });
  } catch (error) {
    next(error);
  }
};

// Archive a task
exports.archiveTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await TaskModel.getTaskById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await TaskModel.archiveTask(taskId);
    res.status(200).json({ message: 'Task archived successfully' });
  } catch (error) {
    next(error);
  }
};

// Get archived tasks
exports.getArchivedTasks = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const tasks = await TaskModel.getArchivedTasks(userId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// Get all tasks with filters
exports.getAllTasks = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const filters = {
      priority: req.query.priority,
      category_id: req.query.category_id,
      is_completed: req.query.completed,
      starred: req.query.starred,
      due_date: req.query.due_date,
      include_archived: req.query.include_archived
    };

    const tasks = await TaskModel.getTasksForUser(userId, filters);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};
