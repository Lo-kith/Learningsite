// middleware/authMiddleware.js

const authMiddleware = (req, res, next) => {
  // Expecting frontend to send userId in headers or session
  const userId = req.headers["userid"];

  if (!userId) {
    return res.status(401).json({ message: "User not logged in" });
  }

  // attach userId to request
  req.user = { id: userId };
  next();
};

module.exports = authMiddleware;
