const CategoryModel = require('../models/category.model');

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const result = await CategoryModel.createCategory(req.body);
    res.status(201).json({
      message: 'Category created successfully',
      category_id: result.insertId
    });
  } catch (err) {
    res.status(err.status || 500).json({
      error: 'Error creating category',
      details: err.message
    });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(err.status || 500).json({
      error: 'Error retrieving category',
      details: err.message
    });
  }
};

// Get all categories for a user
exports.getAllCategories = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const categories = await CategoryModel.getAllCategories(userId);
    res.status(200).json(categories);
  } catch (err) {
    res.status(err.status || 500).json({
      error: 'Error retrieving categories',
      details: err.message
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const result = await CategoryModel.updateCategory(req.params.id, req.body);
    res.status(200).json({ 
      message: 'Category updated successfully', 
      affectedRows: result.affectedRows 
    });
  } catch (err) {
    res.status(err.status || 500).json({
      error: 'Error updating category',
      details: err.message
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const result = await CategoryModel.deleteCategory(req.params.id);
    res.status(200).json({ 
      message: 'Category deleted successfully', 
      affectedRows: result.affectedRows 
    });
  } catch (err) {
    res.status(err.status || 500).json({
      error: 'Error deleting category',
      details: err.message
    });
  }
};
