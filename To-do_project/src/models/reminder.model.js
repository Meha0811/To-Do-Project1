const db = require('../db/db-connection');

const ReminderModel = {
  // Create a new reminder
  createReminder: async (reminder) => {
    const sql = `
      INSERT INTO reminder (task_id, reminder_time, is_sent)
      VALUES (?, ?, ?)
    `;
    const values = [reminder.task_id, reminder.reminder_time, reminder.is_sent || false];
    return await db(sql, values);
  },

  // Get a reminder by ID
  getReminderById: async (id) => {
    const sql = `SELECT * FROM reminder WHERE reminder_id = ?`;
    const result = await db(sql, [id]);
    return result[0];
  },

  // Get all reminders for a task
  getRemindersByTaskId: async (taskId) => {
    const sql = `SELECT * FROM reminder WHERE task_id = ?`;
    return await db(sql, [taskId]);
  },

  // Update a reminder
  updateReminder: async (id, data) => {
    let fields = [];
    let values = [];

    Object.entries(data).forEach(([key, value]) => {
      fields.push(`${key} = ?`);
      values.push(value);
    });

    const sql = `UPDATE reminder SET ${fields.join(', ')} WHERE reminder_id = ?`;
    values.push(id);

    return await db(sql, values);
  },

  // Delete a reminder
  deleteReminder: async (id) => {
    const sql = `DELETE FROM reminder WHERE reminder_id = ?`;
    return await db(sql, [id]);
  }
};

module.exports = ReminderModel;
