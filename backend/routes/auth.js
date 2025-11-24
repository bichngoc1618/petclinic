// routes/auth.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  register,
  login,
  updateUser,
  getMe,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware(), getMe);
router.put(
  "/me",
  authMiddleware(),
  upload.single("avatar"), // avatar là tên trường formData từ frontend
  updateUser // SỬA: gọi trực tiếp updateUser từ authController
);

module.exports = router;
