// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./Config/db');
const itemsRouter = require('./routes/items');
const userRoutes=require('./routes/userRoute');
const purchaseRoutes = require("./routes/Purchase");
const app = express();

// Debug check
console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI);

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'], // Vite frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Serve uploaded images
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/user',userRoutes);
app.use("/api/purchases", purchaseRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));