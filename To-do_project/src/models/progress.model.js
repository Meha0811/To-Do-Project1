const db = require('../db/db-connection');

const ProgressModel = {
  // Create or update progress
  upsert: async (data) => {
    const { task_id, is_recurring = 0, recurring_instance_date = null, status, notes } = data;

    let selectQuery = `SELECT * FROM progress WHERE task_id = ? AND is_recurring = ?`;
    const values = [task_id, is_recurring];

    if (is_recurring) {
      selectQuery += ` AND recurring_instance_date = ?`;
      values.push(recurring_instance_date);
    }

    const rows = await db(selectQuery, values);

    if (rows.length > 0) {
      const updateQuery = `
        UPDATE progress
        SET status = ?, notes = ?, updated_at = NOW()
        WHERE id = ?
      `;
      await db(updateQuery, [status, notes, rows[0].id]);
      return { message: 'Progress updated', id: rows[0].id };
    } else {
      const insertQuery = `
        INSERT INTO progress (task_id, is_recurring, recurring_instance_date, status, notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `;
      const result = await db(insertQuery, [task_id, is_recurring, recurring_instance_date, status, notes]);
      return { message: 'Progress created', id: result.insertId };
    }
  },

  // Get progress by task (and optional recurring date)
  getByTask: async (task_id, recurring_instance_date = null) => {
    let sql = `SELECT * FROM progress WHERE task_id = ?`;
    const values = [task_id];

    if (recurring_instance_date) {
      sql += ` AND recurring_instance_date = ?`;
      values.push(recurring_instance_date);
    }

    return await db(sql, values);
  },

  // Reset progress
  reset: async (task_id, recurring_instance_date = null) => {
    let sql = `UPDATE progress SET status = 'Not Started', notes = '', updated_at = NOW() WHERE task_id = ?`;
    const values = [task_id];

    if (recurring_instance_date) {
      sql += ` AND recurring_instance_date = ?`;
      values.push(recurring_instance_date);
    }

    const result = await db(sql, values);
    return result;
  }
};

module.exports = ProgressModel;
