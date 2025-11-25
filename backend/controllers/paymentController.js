const Payment = require("../models/payment");

// Tổng doanh thu
exports.getTotalRevenue = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      { $match: { status: "paid" } }, // chỉ tính các payment đã thanh toán
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;

    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("❌ Lỗi tính tổng doanh thu:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Doanh thu theo tháng
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      { $match: { status: "paid" } }, // chỉ tính các payment đã thanh toán
      {
        $group: {
          _id: {
            year: { $year: "$paymentDate" },
            month: { $month: "$paymentDate" },
          },
          monthlyRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Định dạng kết quả
    const formatted = result.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      revenue: item.monthlyRevenue,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Lỗi tính doanh thu theo tháng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
