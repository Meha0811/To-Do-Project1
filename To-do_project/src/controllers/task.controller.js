const TaskModel = require('../models/task.model');
const ReminderModel = require('../models/reminder.model');
const UserModel = require('../models/user.model');
const sendReminderEmail = require('../services/emailReminder.service');

function subtractTime(date, minutes) {
  return new Date(date.getTime() - minutes * 60000);
}

// ✅ Create a new task with progress , reminder & recurring integration
exports.createTask = async (req, res, next) => {
  try {
    const task = req.body;

    // Validate required fields
    if (!task.user_id || !task.title || !task.due_date) {
      return res.status(400).json({ message: 'user_id, title, and due_date are required' });
    }

    // Ensure date is valid
    const dueDate = new Date(task.due_date);
    if (isNaN(dueDate)) {
      return res.status(400).json({ message: 'Invalid due_date format' });
    }

    const result = await TaskModel.createTask(task);
    const taskId = result.insertId;

    // Get user email (plain text now)
    const user = await UserModel.getUserById(task.user_id);
    if (!user || !user.email) {
      return res.status(404).json({ message: 'User email not found' });
    }
    const email = user.email;

    // Create reminder (custom or default 60 min before)
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
      message: 'Task created with progress and recurring integration and reminder',
      taskId
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Mark task completed/incomplete (auto archive/unarchive)
exports.markTaskCompleted = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const { completed } = req.body; // true or false

    const result = await TaskModel.markTaskCompleted(taskId, completed);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (completed) {
      res.status(200).json({ message: 'Task marked as completed and archived' });
    } else {
      res.status(200).json({ message: 'Task marked as incomplete and unarchived' });
    }
  } catch (error) {
    next(error);
  }
};





// ✅ Get all tasks (with optional filters)
exports.getAllTasks = async (req, res, next) => {
  try {
    const userId = req.query.userId;

    if (userId) {
      // Filters only apply if userId is provided
      const filters = {
        priority: req.query.priority,
        category_id: req.query.category_id,
        is_completed: req.query.completed,
        starred: req.query.starred,
        due_date: req.query.due_date,
        include_archived: req.query.include_archived
      };

      const tasks = await TaskModel.getTasksForUser(userId, filters);
      return res.status(200).json(tasks);
    } else {
      // No userId → fetch all tasks (admin view maybe)
      const tasks = await TaskModel.getAllTasks();
      return res.status(200).json(tasks);
    }
  } catch (error) {
    next(error);
  }
};



// ✅ Get single task
exports.getTaskById = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await TaskModel.getTaskById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// ✅ Update task with reminder
exports.updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    if (!Object.keys(req.body).length) return res.status(400).json({ message: 'No fields to update' });

    await TaskModel.updateTask(taskId, req.body);

    // Update reminder if due_date or custom reminder_time changed
    const updatedTask = await TaskModel.getTaskById(taskId);
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });

    const reminderTime = req.body.reminder_time
      ? new Date(req.body.reminder_time)
      : req.body.due_date
      ? subtractTime(new Date(req.body.due_date), 60)
      : null;

    if (reminderTime) {
      const existingReminder = await ReminderModel.getReminderByTaskId(taskId);
      if (existingReminder) {
        await ReminderModel.updateReminderByTaskId(taskId, reminderTime);
      } else {
        await ReminderModel.createReminder({ task_id: taskId, reminder_time: reminderTime });
      }
    }

    res.status(200).json({ message: 'Task updated successfully with reminder' });
  } catch (err) {
    next(err);
  }
};

// ✅ Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    await ReminderModel.deleteReminderByTaskId(taskId);
    await TaskModel.deleteTask(taskId);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ✅ Archive a task
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



// ✅ Get archived tasks
exports.getArchivedTasks = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const tasks = await TaskModel.getArchivedTasks(userId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

