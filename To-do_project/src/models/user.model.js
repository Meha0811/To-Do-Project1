const db = require('../db/db-connection');
const { encrypt, decrypt } = require('../utils/encryption.utils');

// Create a new user (encrypt email)
exports.createUser = async (user) => {
  const encryptedEmail = encrypt(user.email);
  const sql = `INSERT INTO user (name, email) VALUES (?, ?)`;
  const result = await db(sql, [user.name, encryptedEmail]);
  return result;
};

// Get all users (decrypt emails)
exports.getAllUsers = async () => {
  const sql = `SELECT * FROM user`;
  const result = await db(sql);
  return result.map(user => ({
    ...user,
    email: decrypt(user.email)
  }));
};

// Get a user by ID (decrypt email)
exports.getUserById = async (id) => {
  const sql = `SELECT * FROM user WHERE user_id = ?`;
  const result = await db(sql, [id]);

  if (result.length === 0) return null;

  return {
    ...result[0],
    email: decrypt(result[0].email)
  };
};

// Update a user (encrypt email before saving)
exports.updateUser = async (id, user) => {
  const encryptedEmail = encrypt(user.email);
  const sql = `UPDATE user SET name = ?, email = ? WHERE user_id = ?`;
  const result = await db(sql, [user.name, encryptedEmail, id]);
  return result;
};

// Delete a user
exports.deleteUser = async (id) => {
  const sql = `DELETE FROM user WHERE user_id = ?`;
  const result = await db(sql, [id]);
  return result;
};
