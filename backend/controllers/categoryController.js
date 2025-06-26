// backend/controllers/categoryController.js
const Category = require("../models/Category");
const Item = require("../models/Item");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const category = new Category({ name: req.body.name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get items by category ID
exports.getItemsByCategory = async (req, res) => {
  try {
    const items = await Item.find({ category: req.params.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
