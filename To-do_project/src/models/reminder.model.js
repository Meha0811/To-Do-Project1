const db = require('../db/db-connection');

const ReminderModel = {
  createReminder: async ({ task_id, reminder_time }) => {
    const sql = 'INSERT INTO reminder (task_id, reminder_time, is_sent) VALUES (?, ?, 0)';
    return await db(sql, [task_id, reminder_time]);
  },

  getReminderByTaskId: async (task_id) => {
    const sql = 'SELECT * FROM reminder WHERE task_id = ?';
    const result = await db(sql, [task_id]);
    return result[0] || null;
  },

  updateReminderByTaskId: async (task_id, reminder_time) => {
    // Reset is_sent to 0 whenever reminder_time is updated
    const sql = 'UPDATE reminder SET reminder_time = ?, is_sent = 0 WHERE task_id = ?';
    return await db(sql, [reminder_time, task_id]);
  },

  deleteReminderByTaskId: async (task_id) => {
    const sql = 'DELETE FROM reminder WHERE task_id = ?';
    return await db(sql, [task_id]);
  },

  getAllUpcomingReminders: async () => {
    const sql = `
      SELECT r.*, u.email, u.name, t.title, t.due_date 
      FROM reminder r 
      JOIN task t ON r.task_id = t.task_id 
      JOIN user u ON t.user_id = u.user_id 
      WHERE r.reminder_time <= NOW() AND r.is_sent = 0
    `;
    return await db(sql);
  },

  markReminderSent: async (reminder_id) => {
    const sql = 'UPDATE reminder SET is_sent = 1 WHERE reminder_id = ?';
    return await db(sql, [reminder_id]);
  }
};

module.exports = ReminderModel;
