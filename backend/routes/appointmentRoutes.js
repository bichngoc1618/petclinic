const express = require("express");
const router = express.Router();
const {
  getAppointmentsByOwner,
} = require("../controllers/appointmentController");

router.get("/owner/:ownerId", getAppointmentsByOwner);

module.exports = router;
