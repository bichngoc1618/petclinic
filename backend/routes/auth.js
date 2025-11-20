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
router.get("/me", authMiddleware(), getMe); // Lấy user hiện tại
router.put("/:id", authMiddleware(), upload.single("avatar"), updateUser); // Cập nhật profile

module.exports = router;
