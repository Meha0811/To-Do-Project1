const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const awaitHandler = require('../middleware/awaitHandlerFactory.middleware');
const validate = require('../middleware/validators/validate');
const {
  createCategoryValidator,
  updateCategoryValidator,
} = require('../middleware/validators/categoryValidator.middleware');

router.post('/', createCategoryValidator, validate, awaitHandler(categoryController.createCategory));
router.get('/', awaitHandler(categoryController.getAllCategories));
router.get('/:id', awaitHandler(categoryController.getCategoryById));
router.put('/:id', updateCategoryValidator, validate, awaitHandler(categoryController.updateCategory));
router.delete('/:id', awaitHandler(categoryController.deleteCategory));

module.exports = router;
