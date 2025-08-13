const db = require('../db/db-connection');

// Recurring Task operations
const RecurringTask = {};

// Create a recurring task
RecurringTask.createRecurringTask = async (data) => {
  const { task_id, pattern, next_occurence } = data;
  const sql = `
    INSERT INTO recurring_task (task_id, pattern, next_occurence)
    VALUES (?, ?, ?)
  `;
  const result = await db(sql, [task_id, pattern, next_occurence]);
  return result;
};

// Get recurring task by task_id
RecurringTask.getRecurringTask = async (task_id) => {
  const sql = `SELECT * FROM recurring_task WHERE task_id = ?`;
  const result = await db(sql, [task_id]);
  return result[0];
};

// Add exception date for recurring task
RecurringTask.addException = async ({ recurring_id, exception_date, reason }) => {
  const sql = `
    INSERT INTO recurring_task_exceptions (recurring_id, exception_date, reason)
    VALUES (?, ?, ?)
  `;
  const result = await db(sql, [recurring_id, exception_date, reason]);
  return result;
};

// Get exceptions for a recurring task
RecurringTask.getExceptions = async (recurring_id) => {
  const sql = `
    SELECT * FROM recurring_task_exceptions WHERE recurring_id = ?
  `;
  return await db(sql, [recurring_id]);
};

// Remove exception
RecurringTask.removeException = async (recurring_id, exception_date) => {
  const sql = `
    DELETE FROM recurring_task_exceptions
    WHERE recurring_id = ? AND exception_date = ?
  `;
  return await db(sql, [recurring_id, exception_date]);
};

module.exports = RecurringTask;
