// backend/routes/itemRoutes.js
const express = require("express");
const {
  createItem,
  getItems,
  getItemById,
  deleteItem,
  rateItem,
} = require("../controllers/itemController");
const upload = require("../middleware/upload");
const path = require("path");
const router = express.Router();

// Upload route
router.post("/upload", upload.single("image"), (req, res) => {
  res.send({ imageUrl: `/uploads/${req.file.filename}` });
});

router.post("/", createItem);
router.get("/", getItems);
router.get("/:id", getItemById);
router.delete("/:id", deleteItem);
router.post("/:itemId/rate", rateItem);

module.exports = router;
