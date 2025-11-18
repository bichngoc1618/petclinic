const express = require("express");
const router = express.Router();
const {
  getAllServices,
  createService,
} = require("../controllers/serviceController");

// Lấy danh sách dịch vụ
router.get("/", getAllServices);

// Tạo dịch vụ mới (nếu cần)
router.post("/", createService);

module.exports = router;
