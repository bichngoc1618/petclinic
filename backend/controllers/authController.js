const User = require("../models/users");
const Role = require("../models/role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ===================== Đăng ký =====================
const register = async (req, res) => {
  try {
    const { name, email, password, roleName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã được sử dụng" });

    const role = await Role.findOne({ name: roleName });
    if (!role) return res.status(400).json({ message: "Role không hợp lệ" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role._id,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: role.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role.name,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Đăng nhập =====================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("role");
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không đúng" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Cập nhật profile =====================
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const { name, phone, address } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // Xử lý avatar
    if (req.file) {
      if (user.avatar) {
        const oldPath = path.join(__dirname, "../uploads", user.avatar);
        fs.unlink(oldPath, (err) => {
          if (err) console.log("Xoá avatar cũ thất bại:", err);
        });
      }
      user.avatar = req.file.filename;
    }

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Lấy user hiện tại =====================
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, updateUser, getMe };
