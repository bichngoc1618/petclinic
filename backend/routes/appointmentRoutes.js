const express = require("express");
const router = express.Router();
const {
  getAppointmentsByOwner,
  getAllAppointments,
  createAppointment,
} = require("../controllers/appointmentController");

// Lấy tất cả lịch
router.get("/", getAllAppointments);

// Lấy lịch theo owner
router.get("/owner/:ownerId", getAppointmentsByOwner);

// Tạo lịch mới
router.post("/", createAppointment);

module.exports = router;
