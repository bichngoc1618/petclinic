const Service = require("../models/service");

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

// Thêm dịch vụ mới (nếu cần)
exports.createService = async (req, res) => {
  try {
    const { name, icon } = req.body;

    if (!name || !icon)
      return res.status(400).json({ message: "Thiếu dữ liệu" });

    const newService = await Service.create({ name, icon });
    res.status(201).json(newService);
  } catch (error) {
    console.error("❌ Lỗi tạo dịch vụ:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
