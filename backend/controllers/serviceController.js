const Service = require("../models/service");
const Appointment = require("../models/appointment");

// Lấy tất cả dịch vụ
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    console.error("❌ Lỗi lấy dịch vụ:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thêm dịch vụ mới
exports.createService = async (req, res) => {
  try {
    const { name, icon, price } = req.body;
    if (!name || !icon || price == null)
      return res.status(400).json({ message: "Thiếu dữ liệu" });

    const newService = await Service.create({ name, icon, price });
    res.status(201).json(newService);
  } catch (error) {
    console.error("❌ Lỗi tạo dịch vụ:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thống kê: tổng số dịch vụ đã sử dụng + doanh thu
exports.getTotalServicesUsed = async (req, res) => {
  try {
    // 1️⃣ Lấy tất cả lịch hẹn đã hoàn thành
    const appointments = await Appointment.find({ status: "completed" }).select(
      "services"
    );

    // 2️⃣ Lấy tất cả dịch vụ 1 lần để map _id -> price & name
    const allServices = await Service.find({});
    const serviceMap = {};
    allServices.forEach((s) => {
      serviceMap[s._id.toString()] = { price: s.price || 0, name: s.name };
    });

    let totalUsed = 0;
    let totalRevenue = 0;

    // Chi tiết từng dịch vụ cho PieChart
    const serviceDetails = allServices.map((s) => ({
      _id: s._id,
      name: s.name,
      totalUsed: 0,
      revenue: 0,
    }));

    const serviceDetailMap = {};
    serviceDetails.forEach((s) => (serviceDetailMap[s._id.toString()] = s));

    // 3️⃣ Duyệt lịch hẹn
    appointments.forEach((apm) => {
      if (apm.services?.length) {
        totalUsed += apm.services.length;
        apm.services.forEach((svcId) => {
          const svcStr = svcId.toString();
          const price = serviceMap[svcStr]?.price || 0;
          totalRevenue += price;

          if (serviceDetailMap[svcStr]) {
            serviceDetailMap[svcStr].totalUsed += 1;
            serviceDetailMap[svcStr].revenue += price;
          }
        });
      }
    });

    // 4️⃣ Trả kết quả
    res.status(200).json({
      totalServicesUsed: totalUsed,
      totalRevenue,
      servicesUsed: serviceDetails.filter((s) => s.totalUsed > 0), // chỉ dịch vụ đã dùng
    });
  } catch (error) {
    console.error("❌ Lỗi thống kê dịch vụ sử dụng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
