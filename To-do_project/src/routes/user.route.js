const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { createUserValidator, updateUserValidator } = require('../middleware/validators/userValidator.middleware');

const { validationResult } = require('express-validator');
const awaitHandler = require('../middleware/awaitHandlerFactory.middleware');

// Utility to check validation result
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/', createUserValidator, validate, awaitHandler(userController.createUser));
router.get('/', awaitHandler(userController.getAllUsers));
router.get('/:id', awaitHandler(userController.getUserById));
router.put('/:id', updateUserValidator, validate, awaitHandler(userController.updateUser));
router.delete('/:id', awaitHandler(userController.deleteUser));

module.exports = router;