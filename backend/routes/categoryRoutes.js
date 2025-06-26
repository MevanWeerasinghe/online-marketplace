const express = require("express");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  getItemsByCategory,
} = require("../controllers/categoryController");

router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/:id/items", getItemsByCategory);

module.exports = router;
