const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} = require("../Controllers/itemController");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Routes
router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", upload.single("image"), createItem);
router.put("/:id", upload.single("image"), updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
