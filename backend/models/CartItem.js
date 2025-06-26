const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("CartItem", CartItemSchema);
