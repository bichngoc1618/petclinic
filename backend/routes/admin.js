const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const petCtrl = require("../controllers/petController");
const appointmentCtrl = require("../controllers/appointmentController");
const userCtrl = require("../controllers/authController");

// Middleware chỉ admin
router.use(authMiddleware(["admin"]));

/* ===================== PETS ===================== */
router.get("/pets", petCtrl.getAllPets);
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

/* ===================== USERS ===================== */
// Lấy tất cả users theo role (doctor | owner)
router.get("/users", userCtrl.getUsersByRole);

// Lấy tất cả users + pets + appointments (admin dashboard)
router.get("/users/all", userCtrl.getAllUsers);

// Xem chi tiết user
router.get("/users/:id", userCtrl.getUserDetail);

// Tìm kiếm user theo name hoặc email
router.get("/users/search", userCtrl.searchUsers);

// Lấy số lượng users theo role (admin dashboard)
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

// Đổi role
router.put("/users/:id/role", userCtrl.changeUserRole);

// Xóa user
router.delete("/users/:id", userCtrl.deleteUser);

module.exports = router;
