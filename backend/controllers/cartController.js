const CartItem = require("../models/CartItem");

// @desc Get cart for a user
exports.getCart = async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.params.userId }).populate(
      "itemId"
    );
    res.json(
      items.map((i) => ({
        ...i.itemId.toObject(),
        quantity: i.quantity,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Error loading cart" });
  }
};

// @desc Save cart for a user
exports.saveCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.params.userId });

    const bulk = req.body.map((item) => ({
      userId: req.params.userId,
      itemId: item._id,
      quantity: item.quantity,
    }));

    await CartItem.insertMany(bulk);
    res.status(200).json({ message: "Cart saved" });
  } catch (err) {
    res.status(500).json({ message: "Error saving cart" });
  }
};
