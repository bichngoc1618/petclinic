const User = require("../models/users");
const Role = require("../models/role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ===================== Đăng ký =====================
const register = async (req, res) => {
  try {
    const { name, email, password, roleName } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã được sử dụng" });

    // Kiểm tra role hợp lệ
    const role = await Role.findOne({ name: roleName });
    if (!role) return res.status(400).json({ message: "Role không hợp lệ" });

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role._id,
    });

    await user.save();

    // Tạo JWT
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
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
