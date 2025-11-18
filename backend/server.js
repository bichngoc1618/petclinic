const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const petRoutes = require("./routes/petRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Route auth
app.use("/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route thử nghiệm
app.get("/", (req, res) => {
  res.send("Pet Clinic Backend is running 🐾");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
