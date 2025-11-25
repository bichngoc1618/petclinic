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
// Giao task cho bác sĩ và đổi trạng thái sang 'treating'
exports.assignDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment)
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });

    appointment.doctor = doctorId;
    appointment.status = "treating"; // Chờ khám
    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate({ path: "pets", select: "name species owner" })
      .populate("doctor", "name")
      .populate("services", "name icon")
      .populate("owner", "name phone");

    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
// 📊 Lịch hẹn theo tháng
exports.getMonthlyAppointments = async (req, res) => {
  try {
    const result = await Appointment.aggregate([
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          totalAppointments: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Định dạng kết quả
    const formatted = result.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      totalAppointments: item.totalAppointments,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Lỗi thống kê lịch hẹn theo tháng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
// Tổng số lịch hẹn
exports.getTotalAppointments = async (req, res) => {
  try {
    const total = await Appointment.countDocuments();
    res.json({ totalAppointments: total });
  } catch (error) {
    console.error("Lỗi tổng số lịch hẹn:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
