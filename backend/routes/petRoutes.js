const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  addPet,
  updatePet,
  getAllPets,
  getPetsByOwner,
  deletePet,
  getPetById,
} = require("../controllers/petController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Thêm pet
router.post("/", upload.single("image"), addPet);

// Cập nhật pet
router.put("/:id", upload.single("image"), updatePet);

// Xoá pet
router.delete("/:id", deletePet);

// Lấy pet
router.get("/", getAllPets);
router.get("/owner/:ownerId", getPetsByOwner);
router.get("/:id", getPetById);

module.exports = router;
