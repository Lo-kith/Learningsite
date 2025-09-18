const User = require("../Model/UserModel");

// login or signup
exports.login = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  let user = await User.findOne({ email });

  if (!user) {
    // signup new user
    user = new User({ username, email, password, purchasedCourses: [] });
    await user.save();
  } else {
    // check password (basic)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
  }

  res.json(user);
};

// get user purchases
exports.getPurchases = async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user.purchasedCourses || []);
};

// buy new course
exports.buyCourse = async (req, res) => {
  const { email } = req.params;
  const { course } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // avoid duplicate
  const already = user.purchasedCourses.find((c) => c.courseId === course.courseId);
  if (already) return res.json(user.purchasedCourses);

  const newCourse = {
    ...course,
    purchaseDate: new Date().toISOString().split("T")[0],
    modules: [
      { title: "Introduction", duration: "15m", topic: "Course overview", completed: false },
      { title: "Module 1", duration: "1h", topic: "Getting started", completed: false },
    ],
  };

  user.purchasedCourses.push(newCourse);
  await user.save();

  res.json(user.purchasedCourses);
};
