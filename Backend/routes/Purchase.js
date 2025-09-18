const express = require("express");
const router = express.Router();
const Purchase = require("../Model/Purchase");

// GET /api/purchases/my-purchases
router.get("/my-purchases", async (req, res) => {
  try {
    const userId = req.headers.userid; 

    if (!userId) {
      return res.status(401).json({ message: "User ID header is missing." });
    }

    // Find purchases for this user
    const purchases = await Purchase.find({ user: userId })
      .populate("course")   
      .sort({ purchaseDate: -1 });

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ message: "No purchases found for this user." });
    }

    // return only course details
    const courses = purchases.map((p) => p.course);

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching user's purchases:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
