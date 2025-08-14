const db = require('../db/db-connection');

const CategoryModel = {
  // Create a new category
  createCategory: async (category) => {
    const sql = `
      INSERT INTO category (user_id, name, color_code)
      VALUES (?, ?, ?)
    `;
    const values = [category.user_id, category.name, category.color_code || null];
    return await db(sql, values);
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const sql = `SELECT * FROM category WHERE category_id = ?`;
    const result = await db(sql, [id]);
    return result[0];
  },

  // Get all categories for a user
  getAllCategories: async (userId) => {
    const sql = `SELECT * FROM category WHERE user_id = ?`;
    return await db(sql, [userId]);
  },


  // Update category
  updateCategory: async (id, data) => {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) {
      throw new Error("No fields provided for update.");
    }

    const sql = `UPDATE category SET ${fields.join(', ')} WHERE category_id = ?`;
    values.push(id);

    return await db(sql, values);
  },

  // Delete category
  deleteCategory: async (id) => {
    const sql = `DELETE FROM category WHERE category_id = ?`;
    return await db(sql, [id]);
  }
};

module.exports = CategoryModel;
