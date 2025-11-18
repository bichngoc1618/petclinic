const Appointment = require("../models/appointment");

// Lấy tất cả lịch hẹn
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({ path: "pets", select: "name species owner" })
      .populate("doctor", "name")
      .populate("services", "name icon");
    res.json(appointments);
  } catch (error) {
    console.error("❌ Lỗi lấy tất cả lịch:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy lịch theo owner
exports.getAppointmentsByOwner = async (req, res) => {
  try {
    const appointments = await Appointment.find({ owner: req.params.ownerId })
      .populate({ path: "pets", select: "name species owner" })
      .populate("doctor", "name")
      .populate("services", "name icon");
    res.json(appointments);
  } catch (error) {
    console.error("❌ Lỗi lấy lịch theo owner:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo lịch hẹn mới
exports.createAppointment = async (req, res) => {
  try {
    const { date, pets, services, owner } = req.body;

    if (!date || !pets?.length || !services?.length)
      return res.status(400).json({ message: "Thiếu dữ liệu" });

    // Tạo appointment mới
    const newApm = await Appointment.create({
      date,
      pets,
      services,
      owner,
      doctor: null,
      status: "pending",
    });

    // Populate sau khi tạo
    const populatedApm = await Appointment.findById(newApm._id)
      .populate({ path: "pets", select: "name species owner" })
      .populate("doctor", "name")
      .populate("services", "name icon");

    res.status(201).json(populatedApm);
  } catch (error) {
    console.error("❌ Lỗi tạo lịch:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
