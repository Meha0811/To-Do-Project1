const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const awaitHandler = require('../middleware/awaitHandlerFactory.middleware');
const validate = require('../middleware/validators/validate');
const {
  createCategoryValidator,
  updateCategoryValidator,
} = require('../middleware/validators/categoryValidator.middleware');

// Create a category
router.post('/', createCategoryValidator, validate, awaitHandler(categoryController.createCategory));

// Get all categories for a  user
router.get('/user/:userId', awaitHandler(categoryController.getAllCategories));

// Get category by ID
router.get('/:id', awaitHandler(categoryController.getCategoryById));

// Update category
router.put('/:id', updateCategoryValidator, validate, awaitHandler(categoryController.updateCategory));

// Delete category
router.delete('/:id', awaitHandler(categoryController.deleteCategory));

module.exports = router;
