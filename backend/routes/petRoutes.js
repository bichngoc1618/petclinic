const express = require("express");
const router = express.Router();
const multer = require("multer");
const { addPet, getAllPets } = require("../controllers/petController");

// Cấu hình multer lưu ảnh vào folder 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Thêm pet (1 ảnh)
router.post("/", upload.single("image"), addPet);

// Lấy tất cả pet
router.get("/", getAllPets);

module.exports = router;
