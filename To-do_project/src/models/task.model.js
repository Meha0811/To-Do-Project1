const db = require('../db/db-connection');

class TaskModel {
  async createTask(task) {
    const sql = `
      INSERT INTO task (user_id, title, description, category_id, priority, due_date, is_starred, color_tag, repeat_pattern)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db(sql, [
      task.user_id,
      task.title,
      task.description || '',
      task.category_id,
      task.priority,
      task.due_date,
      task.is_starred || false,
      task.color_tag || null,
      task.repeat_pattern || 'none'
    ]);
    return result;
  }

  async getTasksByUser(user_id, filters = {}) {
    let sql = `SELECT * FROM task WHERE user_id = ?`;
    let params = [user_id];

    if (filters.completed !== undefined) {
      sql += ` AND is_completed = ?`;
      params.push(filters.completed);
    }

    if (filters.category_id) {
      sql += ` AND category_id = ?`;
      params.push(filters.category_id);
    }

    if (filters.due_date) {
      sql += ` AND due_date = ?`;
      params.push(filters.due_date);
    }

    if (filters.priority) {
      sql += ` AND priority = ?`;
      params.push(filters.priority);
    }

    if (filters.starred === 'true') {
      sql += ` AND is_starred = true`;
    }

    if (filters.color_tag) {
      sql += ` AND color_tag = ?`;
      params.push(filters.color_tag);
    }

    if (filters.exclude_archived !== false) {
      sql += ` AND is_archived = false`;
    }

    sql += ` ORDER BY 
      CASE priority
        WHEN 'High' THEN 1
        WHEN 'Medium' THEN 2
        WHEN 'Low' THEN 3
        ELSE 4
      END,
      due_date ASC
    `;

    return await db(sql, params);
  }

  async updateTask(task_id, data) {
    const sql = `
      UPDATE task SET title = ?, description = ?, category_id = ?, priority = ?, due_date = ?, is_starred = ?, color_tag = ?, repeat_pattern = ?
      WHERE task_id = ?
    `;
    return await db(sql, [
      data.title,
      data.description,
      data.category_id,
      data.priority,
      data.due_date,
      data.is_starred,
      data.color_tag,
      data.repeat_pattern,
      task_id
    ]);
  }

  async deleteTask(task_id) {
    return await db(`DELETE FROM task WHERE task_id = ?`, [task_id]);
  }

  async markAsCompleted(task_id) {
    return await db(`UPDATE task SET is_completed = true WHERE task_id = ?`, [task_id]);
  }

  async archiveTask(task_id) {
    return await db(`UPDATE task SET is_archived = true WHERE task_id = ?`, [task_id]);
  }

  async unarchiveTask(task_id) {
    return await db(`UPDATE task SET is_archived = false WHERE task_id = ?`, [task_id]);
  }
}

module.exports = new TaskModel();
