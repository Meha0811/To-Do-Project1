const UserModel = require('../models/user.model');
const UserModel = require('../models/user.model');
const { encrypt, decrypt } = require('../utils/encryption.utils');

// Create a new user
exports.createUser = async (req, res, next) => {
  try {
    const user = req.body;

    if (!user.name || !user.email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const result = await UserModel.createUser(user);
    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update a user
exports.updateUser = async (req, res, next) => {
  try {
    const updatedData = req.body;

    if (!updatedData.name || !updatedData.email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const result = await UserModel.updateUser(req.params.id, updatedData);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete a user
exports.deleteUser = async (req, res, next) => {
  try {
    await UserModel.deleteUser(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const encryptedEmail = encrypt(email);
    const result = await UserModel.createUser({ name, email: encryptedEmail });

    res.status(201).json({ message: 'User created', userId: result.insertId });
  } catch (err) {
    next(err);
  }
};