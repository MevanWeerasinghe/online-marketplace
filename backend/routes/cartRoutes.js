const express = require("express");
const router = express.Router();
const { getCart, saveCart } = require("../controllers/cartController");

router.get("/:userId", getCart);
router.post("/:userId", saveCart);

module.exports = router;
