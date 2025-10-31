const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Import models
const Role = require("./models/role");
const User = require("./models/users");
const Pet = require("./models/pet");
const Appointment = require("./models/appointment");
const MedicalRecord = require("./models/medicalRecord");
const Payment = require("./models/payment");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    // Xóa dữ liệu cũ
    await Promise.all([
      Role.deleteMany({}),
      User.deleteMany({}),
      Pet.deleteMany({}),
      Appointment.deleteMany({}),
      MedicalRecord.deleteMany({}),
      Payment.deleteMany({}),
    ]);
    console.log("🗑️  Đã xóa toàn bộ dữ liệu cũ");

    // 1️⃣ Tạo 3 vai trò
    const roles = await Role.insertMany([
      { name: "admin" },
      { name: "doctor" },
      { name: "owner" },
    ]);
    console.log("✅ Roles đã được tạo");

    // 2️⃣ Tạo người dùng mẫu
    const [adminRole, doctorRole, ownerRole] = roles;

    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@petclinic.com",
        password: "123456", // nên mã hóa sau này
        role: adminRole._id,
        avatar: "",
        phone: "0909000111",
        address: "123 Main Street, HCM",
      },
      {
        name: "Dr. John Doe",
        email: "doctor@petclinic.com",
        password: "123456",
        role: doctorRole._id,
        avatar: "",
        phone: "0909222333",
        address: "456 Clinic Road, HCM",
      },
      {
        name: "Nguyễn Văn A",
        email: "owner@petclinic.com",
        password: "123456",
        role: ownerRole._id,
        avatar: "",
        phone: "0909555666",
        address: "789 Pet Street, HCM",
      },
    ]);
    console.log("✅ Users đã được tạo");

    const [adminUser, doctorUser, ownerUser] = users;

    // 3️⃣ Tạo thú cưng (pet)
    const pet = await Pet.create({
      owner: ownerUser._id,
      name: "Miu Miu",
      species: "Cat",
      breed: "Mèo Anh Lông Ngắn",
      age: 2,
      gender: "female",
    });
    console.log("✅ Pet đã được tạo");

    // 4️⃣ Tạo lịch hẹn (appointment)
    const appointment = await Appointment.create({
      pet: pet._id,
      doctor: doctorUser._id,
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 ngày sau
      status: "confirmed",
      note: "Khám sức khỏe định kỳ và tiêm phòng",
    });
    console.log("✅ Appointment đã được tạo");

    // 5️⃣ Tạo hồ sơ khám (medical record)
    const medicalRecord = await MedicalRecord.create({
      appointment: appointment._id,
      diagnosis: "Sức khỏe tốt, cần tiêm vacxin dại",
      treatment: "Tiêm vacxin + tắm rửa định kỳ",
      services: ["bath", "vaccination"],
      date: new Date(),
    });
    console.log("✅ Medical Record đã được tạo");

    // 6️⃣ Tạo thanh toán (payment)
    await Payment.create({
      appointment: appointment._id,
      amount: 350000,
      method: "cash",
      status: "paid",
      paymentDate: new Date(),
    });
    console.log("✅ Payment đã được tạo");

    console.log("🎉 Dữ liệu mẫu đã được seed đầy đủ thành công!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed dữ liệu:", error);
    process.exit(1);
  }
};

seedData();
