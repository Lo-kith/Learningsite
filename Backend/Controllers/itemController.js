const Item = require("../Model/Item");

// GET all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE new item
exports.createItem = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { name, description, price, instructor, rating, reviews } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newItem = new Item({
      name,
      description,
      price: Number(price),
      instructor,
      rating: Number(rating),
      reviews: Number(reviews),
      image: req.file ? `/upload/${req.file.filename}` : null,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// GET one item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE item
exports.updateItem = async (req, res) => {
  try {
    const { name, description, price, instructor, rating, reviews } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const updatedItem = {
      name,
      description,
      price: Number(price),
      instructor,
      rating: Number(rating),
      reviews: Number(reviews),
    };

    if (req.file) {
      updatedItem.image = `/upload/${req.file.filename}`;
    }

    const item = await Item.findByIdAndUpdate(req.params.id, updatedItem, {
      new: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// DELETE item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// controllers/purchaseController.js
const Purchase = require("../Model/Purchase");

exports.createPurchase = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const purchase = new Purchase({
      userId,
      courseId,
    });

    await purchase.save();
    res.status(201).json({ message: "Course purchased successfully", purchase });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// controllers/purchaseController.js
exports.getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming JWT middleware sets req.user

    const purchases = await Purchase.find({ userId }).populate("courseId");

    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
