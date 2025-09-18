// models/Purchase.js
const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: String,
  title: String,
  modules: Array,
  // Add other fields as needed
});

module.exports = mongoose.model("Purchase", purchaseSchema);