const TaskModel = require('../models/task.model');

// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    const task = req.body;

    if (!task.user_id || !task.title || !task.due_date) {
      return res.status(400).json({ message: 'user_id, title, and due_date are required' });
    }

    const result = await TaskModel.createTask(task);
    res.status(201).json({
      message: 'Task created successfully',
      taskId: result.insertId
    });
  } catch (error) {
    next(error);
  }
};

// Get task by ID
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await TaskModel.getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// Get all tasks for a user (with optional filters)
exports.getTasksForUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const filters = req.query;
    const tasks = await TaskModel.getTasksForUser(userId, filters);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// Update a task
exports.updateTask = async (req, res, next) => {
  try {
    const result = await TaskModel.updateTask(req.params.id, req.body);
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
  try {
    await TaskModel.deleteTask(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Mark task as completed
exports.markAsCompleted = async (req, res, next) => {
  try {
    await TaskModel.updateTask(req.params.id, { is_completed: true });
    res.status(200).json({ message: 'Task marked as completed' });
  } catch (error) {
    next(error);
  }
};

// Archive a task
exports.archiveTask = async (req, res, next) => {
  try {
    await TaskModel.updateTask(req.params.id, { is_archived: true });
    res.status(200).json({ message: 'Task archived' });
  } catch (error) {
    next(error);
  }
};

// Unarchive a task
exports.unarchiveTask = async (req, res, next) => {
  try {
    await TaskModel.updateTask(req.params.id, { is_archived: false });
    res.status(200).json({ message: 'Task unarchived' });
  } catch (error) {
    next(error);
  }
};
