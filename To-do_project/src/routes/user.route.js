const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Routes
router.post('/', userController.createUser); // Create
router.get('/', userController.getAllUsers); // Get all
router.get('/:id', userController.getUserById); // Get one
router.put('/:id', userController.updateUser); // Update
router.delete('/:id', userController.deleteUser); // Delete

module.exports = router;