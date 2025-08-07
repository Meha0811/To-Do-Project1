const CategoryModel = require('../models/category.model');

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const result = await CategoryModel.createCategory(req.body);
    res.status(201).json({ message: 'Category created successfully', category_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Error creating category', details: err.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving category', details: err.message });
  }
};

// Get all categories for a user
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.getAllCategories(req.params.userId);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving categories', details: err.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    await CategoryModel.updateCategory(req.params.id, req.body);
    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating category', details: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    await CategoryModel.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting category', details: err.message });
  }
};
