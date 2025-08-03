const db = require('../db/db-connection');

// Create a new user
exports.createUser = async (user) => {
  const sql = `INSERT INTO user (name, email) VALUES (?, ?)`;
  const result = await db(sql, [user.name, user.email]);
  return result;
};

// Get all users
exports.getAllUsers = async () => {
  const sql = `SELECT * FROM user`;
  const result = await db(sql);
  return result;
};

// Get a user by ID
exports.getUserById = async (id) => {
  const sql = `SELECT * FROM user WHERE user_id = ?`;
  const result = await db(sql, [id]);
  return result[0]; // return first matching user
};

// Update a user
exports.updateUser = async (id, user) => {
  const sql = `UPDATE user SET name = ?, email = ? WHERE user_id = ?`;
  const result = await db(sql, [user.name, user.email, id]);
  return result;
};

// Delete a user
exports.deleteUser = async (id) => {
  const sql = `DELETE FROM user WHERE user_id = ?`;
  const result = await db(sql, [id]);
  return result;
};
