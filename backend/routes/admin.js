const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const petCtrl = require("../controllers/petController");
const appointmentCtrl = require("../controllers/appointmentController");
const serviceCtrl = require("../controllers/serviceController");
const userCtrl = require("../controllers/authController");
const paymentCtrl = require("../controllers/paymentController");

// Middleware chỉ admin
router.use(authMiddleware(["admin"]));

/* ===================== PETS ===================== */
router.get("/pets", petCtrl.getAllPets);
router.get("/pets/owner/:ownerId", petCtrl.getPetsByOwner);
router.get("/pets/:id", petCtrl.getPetById);
router.get("/boarding-pets", petCtrl.getBoardingPets);
router.post("/pets", petCtrl.addPet);
router.put("/pets/:id", petCtrl.updatePet);
router.delete("/pets/:id", petCtrl.deletePet);

/* ===================== APPOINTMENTS ===================== */
router.get("/appointments", appointmentCtrl.getAllAppointments);
router.get(
  "/appointments/owner/:ownerId",
  appointmentCtrl.getAppointmentsByOwner
);
router.post("/appointments", appointmentCtrl.createAppointment);
router.put("/appointments/:id/assign-doctor", appointmentCtrl.assignDoctor);
router.put("/appointments/:id/cancel", appointmentCtrl.cancelAppointment);

// Thống kê lịch hẹn
router.get("/appointments/total", appointmentCtrl.getTotalAppointments);
router.get("/appointments/monthly", appointmentCtrl.getMonthlyAppointments);

/* ===================== SERVICES ===================== */
router.get("/services", serviceCtrl.getAllServices);
router.post("/services", serviceCtrl.createService);
router.get("/services/total-used", serviceCtrl.getTotalServicesUsed);

/* ===================== USERS ===================== */
router.get("/users", userCtrl.getUsersByRole);
router.get("/users/all", userCtrl.getAllUsers);
router.get("/users/:id", userCtrl.getUserDetail);
router.get("/users/search", userCtrl.searchUsers);
router.get("/users/counts", async (req, res) => {
  try {
    const doctorsCount = await userCtrl.getUserCountsForDashboard("doctor");
    const ownersCount = await userCtrl.getUserCountsForDashboard("owner");
    res.json({ doctors: doctorsCount, owners: ownersCount });
  } catch (err) {
    console.error("Error in /users/counts:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/users/:id/role", userCtrl.changeUserRole);
router.delete("/users/:id", userCtrl.deleteUser);
router.get("/payments/monthly", paymentCtrl.getMonthlyRevenue);

router.get("/payments/total", paymentCtrl.getTotalRevenue);

module.exports = router;
