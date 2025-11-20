const express = require("express");
const router = express.Router();
const apm = require("../controllers/appointmentController"); // import controller

// Lấy tất cả lịch
router.get("/", apm.getAllAppointments);

// Lấy lịch theo owner
router.get("/owner/:ownerId", apm.getAppointmentsByOwner);

// Tạo lịch mới
router.post("/", apm.createAppointment);

// Huỷ lịch hẹn
router.put("/:id/cancel", apm.cancelAppointment);

module.exports = router;
