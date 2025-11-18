const Appointment = require("../models/appointment");

exports.getAppointmentsByOwner = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({
        path: "pet",
        match: { owner: req.params.ownerId }, // Lọc theo owner
        select: "name species",
      })
      .populate("doctor", "name");

    const filtered = appointments.filter((a) => a.pet !== null);

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
