const db = require('../config/db');

const RecurringTaskExceptions = {};

RecurringTaskExceptions.addException = (data, callback) => {
  const { recurring_task_id, exception_date, reason } = data;

  const query = `
    INSERT INTO recurring_task_exceptions (recurring_task_id, exception_date, reason)
    VALUES (?, ?, ?)
  `;
  db.query(query, [recurring_task_id, exception_date, reason], (err, result) => {
    if (err) return callback(err);
    callback(null, { message: 'Exception added', id: result.insertId });
  });
};

RecurringTaskExceptions.getExceptionsByTask = (recurring_task_id, callback) => {
  const query = `
    SELECT * FROM recurring_task_exceptions
    WHERE recurring_task_id = ?
  `;
  db.query(query, [recurring_task_id], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
};

RecurringTaskExceptions.removeException = (recurring_task_id, exception_date, callback) => {
  const query = `
    DELETE FROM recurring_task_exceptions
    WHERE recurring_task_id = ? AND exception_date = ?
  `;
  db.query(query, [recurring_task_id, exception_date], (err, result) => {
    if (err) return callback(err);
    callback(null, { message: 'Exception removed', result });
  });
};

RecurringTaskExceptions.isDateExcluded = (recurring_task_id, date, callback) => {
  const query = `
    SELECT * FROM recurring_task_exceptions
    WHERE recurring_task_id = ? AND exception_date = ?
  `;
  db.query(query, [recurring_task_id, date], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows.length > 0);
  });
};

module.exports = RecurringTaskExceptions;