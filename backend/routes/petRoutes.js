// routes/petRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  addPet,
  updatePet,
  getAllPets,
  getPetsByOwner,
} = require("../controllers/petController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Thêm pet
router.post("/", upload.single("image"), addPet);

// Cập nhật pet (PUT cũng nhận file)
router.put("/:id", upload.single("image"), updatePet);

// Lấy pet
router.get("/", getAllPets);
router.get("/owner/:ownerId", getPetsByOwner);

module.exports = router;
