const Appointment = require("../models/appointment");
const Pet = require("../models/pet");

// Lấy tất cả lịch
exports.getAllAppointments = async (req, res) => {
  try {
    const { date, search } = req.query;
    const filter = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    if (search) {
      const pets = await Pet.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");
      filter.pets = { $in: pets };
    }

    const appointments = await Appointment.find(filter)
      .populate({ path: "pets", select: "name species owner" })
      .populate("doctor", "name")
      .populate("services", "name icon")
      .populate("owner", "name phone")
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy lịch theo owner
exports.getAppointmentsByOwner = async (req, res) => {
  try {
    const appointments = await Appointment.find({ owner: req.params.ownerId })
      .populate({ path: "pets", select: "name species owner" })
      .populate("doctor", "name")
      .populate("services", "name icon")
      .populate("owner", "name phone");

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo lịch mới
exports.createAppointment = async (req, res) => {
  try {
    const { date, pets, services, owner } = req.body;
    if (!date || !pets?.length || !services?.length || !owner)
      return res.status(400).json({ message: "Thiếu dữ liệu" });

    const newApm = await Appointment.create({
      date,
      pets,
      services,
      owner,
      doctor: null,
      status: "pending",
    });

    const populated = await Appointment.findById(newApm._id)
      .populate("pets")
      .populate("doctor")
      .populate("services")
      .populate("owner", "name phone");

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Huỷ lịch hẹn
exports.cancelAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    )
      .populate("pets")
      .populate("services")
      .populate("owner", "name phone");

    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy lịch" });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
