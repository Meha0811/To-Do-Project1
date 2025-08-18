const db = require('../db/db-connection');
const Progress = require('./progress.model');
const RecurringTask = require('./recurringtask.model');
const { decrypt } = require('../utils/encryption.utils'); // ✅ import decrypt for encrypted fields

const TaskModel = {
  // ✅ Create task
  createTask: async (task) => {
    const sql = `
      INSERT INTO task 
      (user_id, title, description, category_id, priority, due_date, is_starred, color_tag, repeat_pattern, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      task.user_id,
      task.title,
      task.description ?? null,
      task.category_id ?? null,
      task.priority ?? 'Low',
      task.due_date,
      task.is_starred ?? false,
      task.color_tag ?? null,
      task.repeat_pattern ?? 'None'
    ];

    const result = await db(sql, values);
    const taskId = result.insertId;

    // Initialize progress
    await Progress.upsert({
      task_id: taskId,
      recurring_instance_date: null,
      progress_percentage: 0
    });

    // Create recurring task if repeat_pattern is set
    if (task.repeat_pattern && task.repeat_pattern !== 'None') {
      await RecurringTask.createRecurringTask({   
        task_id: taskId,
        pattern: task.repeat_pattern,
        next_occurence: task.due_date
      });
    }

    return result;
  },

  // ✅ Get all tasks
  getAllTasks: async (userId) => {
    let sql = "SELECT * FROM task";
    const params = [];

    if (userId) {
      sql += " WHERE user_id = ?";
      params.push(userId);
    }

    return await db(sql, params); // ✅ fixed: no db.query()
  },

  // ✅ Get task by ID
  getTaskById: async (id) => {
    const sql = 'SELECT * FROM task WHERE task_id = ?';
    const result = await db(sql, [id]);
    if (!result[0]) return null;

    // Decrypt sensitive fields
    const task = result[0];
    task.title = decrypt(task.title);
    if (task.description) task.description = decrypt(task.description);
    if (task.color_tag) task.color_tag = decrypt(task.color_tag);

    return task;
  },

  // ✅ Get tasks for a user with optional filters
  getTasksForUser: async (userId, filters) => {
    let sql = 'SELECT * FROM task WHERE user_id = ?';
    const values = [userId];

    if (filters.priority) {
      sql += ' AND priority = ?';
      values.push(filters.priority);
    }
    if (filters.starred) {
      sql += ' AND is_starred = ?';
      values.push(filters.starred === 'true' ? 1 : 0);
    }
    if (filters.due_date) {
      sql += ' AND due_date = ?';
      values.push(filters.due_date);
    }
    if (filters.is_completed !== undefined) {
      sql += ' AND is_completed = ?';
      values.push(filters.is_completed === 'true' ? 1 : 0);
    }
    if (filters.category_id) {
      sql += ' AND category_id = ?';
      values.push(filters.category_id);
    }
    if (!filters.include_archived || filters.include_archived !== 'true') {
      sql += ' AND is_archived = 0';
    }

    const tasks = await db(sql, values);

    // Decrypt sensitive fields
    return tasks.map(task => {
      task.title = decrypt(task.title);
      if (task.description) task.description = decrypt(task.description);
      if (task.color_tag) task.color_tag = decrypt(task.color_tag);
      return task;
    });
  },

  // ✅ Update task
  updateTask: async (id, data) => {
    let fields = [];
    let values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (['title', 'description', 'color_tag'].includes(key) && value) {
        fields.push(`${key} = ?`);
        values.push(value);
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    const sql = `UPDATE task SET ${fields.join(', ')}, updated_at = NOW() WHERE task_id = ?`;
    values.push(id);

    return await db(sql, values);
  },

  // ✅ Delete task
  deleteTask: async (id) => {
    const sql = 'DELETE FROM task WHERE task_id = ?';
    return await db(sql, [id]);
  },

// ✅ Mark task as completed/incompleted (auto archive/unarchive)
markTaskCompleted: async (id, completed = true) => {
  let sql, values;

  if (completed) {
    // If completed → archive too
    sql = 'UPDATE task SET is_completed = 1, is_archived = 1, updated_at = NOW() WHERE task_id = ?';
    values = [id];
  } else {
    // If incomplete → unarchive too
    sql = 'UPDATE task SET is_completed = 0, is_archived = 0, updated_at = NOW() WHERE task_id = ?';
    values = [id];
  }

  const result = await db(sql, values);
  return result;
},



  // ✅ Archive task
  archiveTask: async (id) => {
    const sql = 'UPDATE task SET is_archived = 1, updated_at = NOW() WHERE task_id = ?';
    return await db(sql, [id]);
  },

  // ✅ Get archived tasks for a user
  getArchivedTasks: async (userId) => {
    const sql = 'SELECT * FROM task WHERE user_id = ? AND is_archived = 1';
    const tasks = await db(sql, [userId]);

    return tasks.map(task => {
      task.title = decrypt(task.title);
      if (task.description) task.description = decrypt(task.description);
      if (task.color_tag) task.color_tag = decrypt(task.color_tag);
      return task;
    });
  }
};

module.exports = TaskModel;
