const TaskModel = require('../models/task.model');

exports.createTask = async (req, res, next) => {
  try {
    const task = req.body;
    const result = await TaskModel.createTask(task);
    res.status(201).json({ message: 'Task created', taskId: result.insertId });
  } catch (error) {
    next(error);
  }
};

exports.getTasksForUser = async (req, res, next) => {
  try {
    const filters = {
      completed: req.query.completed === 'true' ? true : req.query.completed === 'false' ? false : undefined,
      category_id: req.query.category_id,
      due_date: req.query.due_date,
      priority: req.query.priority,
      starred: req.query.starred,
      color_tag: req.query.color_tag,
      exclude_archived: req.query.exclude_archived !== 'false', // default true
    };

    const tasks = await TaskModel.getTasksByUser(req.params.userId, filters);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    await TaskModel.updateTask(req.params.id, req.body);
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    await TaskModel.deleteTask(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.markAsCompleted = async (req, res, next) => {
  try {
    await TaskModel.markAsCompleted(req.params.id);
    res.status(200).json({ message: 'Task marked as completed' });
  } catch (error) {
    next(error);
  }
};

exports.archiveTask = async (req, res, next) => {
  try {
    await TaskModel.archiveTask(req.params.id);
    res.status(200).json({ message: 'Task archived successfully' });
  } catch (error) {
    next(error);
  }
};

exports.unarchiveTask = async (req, res, next) => {
  try {
    await TaskModel.unarchiveTask(req.params.id);
    res.status(200).json({ message: 'Task unarchived successfully' });
  } catch (error) {
    next(error);
  }
};
