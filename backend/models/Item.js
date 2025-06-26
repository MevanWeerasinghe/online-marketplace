// backend/models/Item.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    price: { type: Number, required: true },
    keywords: [{ type: String }],
    userId: { type: String }, // Clerk User ID
    rating: {
      type: Number,
      default: 0,
    },
    ratedBy: {
      type: Number,
      default: 0,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
