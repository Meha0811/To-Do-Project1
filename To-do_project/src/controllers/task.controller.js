const TaskModel = require('../models/task.model');
const ReminderModel = require('../models/reminder.model');
const UserModel = require('../models/user.model');
const { decrypt } = require('../utils/encryption.utils');
const sendReminderEmail = require('../services/emailReminder.service');

// Helper to subtract minutes
function subtractTime(date, minutes) {
  return new Date(date.getTime() - minutes * 60000);
}

// Create task
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

    const email = decrypt(user.email);

    // Calculate reminder time
    const dueDate = new Date(task.due_date);
    const reminderTime = task.reminder_time ? new Date(task.reminder_time) : subtractTime(dueDate, 60);

    // Save reminder in DB
    await ReminderModel.createReminder({
      task_id: taskId,
      reminder_time: reminderTime
    });

    // **Remove setTimeout**; cron job will handle sending email

    res.status(201).json({ message: 'Task created successfully', taskId });
  } catch (error) {
    next(error);
  }
};



// Get task by ID
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await TaskModel.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Get all tasks
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
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// Update task
exports.updateTask = async (req, res, next) => {
  try {
    const updatedData = req.body;
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: 'At least one field is required to update' });
    }

    await TaskModel.updateTask(req.params.id, updatedData);
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    await TaskModel.deleteTask(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Archive task
exports.archiveTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await TaskModel.getTaskById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await TaskModel.archiveTask(taskId);
    res.json({ message: 'Task archived successfully' });
  } catch (error) {
    next(error);
  }
};

// Get archived tasks
exports.getArchivedTasks = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const tasks = await TaskModel.getArchivedTasks(userId);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};
