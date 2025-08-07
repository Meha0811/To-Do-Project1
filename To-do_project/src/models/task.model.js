const db = require('../db/db-connection');

const TaskModel = {
  // Create task
  createTask: async (task) => {
    const sql = `
      INSERT INTO task 
      (user_id, title, description, category_id, priority, due_date, is_starred, color_tag, repeat_pattern, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const values = [
      task.user_id,
      task.title,
      task.description || '',
      task.category_id || null,
      task.priority || 'Low',
      task.due_date,
      task.is_starred || false,
      task.color_tag || null,
      task.repeat_pattern || 'none'
    ];
    return await db(sql, values);
  },

  // Get task by ID
  getTaskById: async (id) => {
    const sql = 'SELECT * FROM task WHERE task_id = ?';
    const result = await db(sql, [id]);
    return result[0];
  },

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

  return await db(sql, values);
},


  // Update task
  updateTask: async (id, data) => {
    let fields = [];
    let values = [];

    Object.entries(data).forEach(([key, value]) => {
      fields.push(`${key} = ?`);
      values.push(value);
    });

    const sql = `UPDATE task SET ${fields.join(', ')}, updated_at = NOW() WHERE task_id = ?`;
    values.push(id);

    return await db(sql, values);
  },

  // Delete task
  deleteTask: async (id) => {
    const sql = 'DELETE FROM task WHERE task_id = ?';
    return await db(sql, [id]);
  },

  // Archive task
  archiveTask: async (id) => {
    const sql = 'UPDATE task SET is_archived = 1, updated_at = NOW() WHERE task_id = ?';
    return await db(sql, [id]);
  },

  // Get archived tasks
  getArchivedTasks: async (userId) => {
    const sql = 'SELECT * FROM task WHERE user_id = ? AND is_archived = 1';
    return await db(sql, [userId]);
  }
};

module.exports = TaskModel;
