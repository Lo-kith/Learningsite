const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  purchasedCourses: [
    {
      courseId: String,
      title: String,
      description: String,
      instructor: String,
      duration: String,
      rating: Number,
      reviews: Number,
      purchaseDate: String,
      modules: [
        {
          title: String,
          duration: String,
          topic: String,
          completed: { type: Boolean, default: false },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
