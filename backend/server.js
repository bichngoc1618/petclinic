const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/auth"); // Đổi tên để rõ ràng
const petRoutes = require("./routes/petRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const adminRoutes = require("./routes/admin");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Kết nối MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes); // tất cả route liên quan user
app.use("/api/appointments", appointmentRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin", adminRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("Pet Clinic Backend is running 🐾");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
