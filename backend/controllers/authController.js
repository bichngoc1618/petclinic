const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Role = require("../models/role");
const Pet = require("../models/pet");
const Appointment = require("../models/appointment");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ===================== Helpers =====================
const safeUserData = async (u, req = null) => {
  const pets = await Pet.find({ owner: u._id });
  const appointments = await Appointment.find({ owner: u._id });
  let activeAppointments = [];
  let completedAppointments = [];

  if (u.role?.name === "doctor") {
    activeAppointments = await Appointment.find({
      doctor: u._id,
      status: "treating",
    });
    completedAppointments = await Appointment.find({
      doctor: u._id,
      status: "completed",
    });
  }

  let avatarUrl = u.avatar || "";
  if (avatarUrl && req) {
    const host = req.protocol + "://" + req.get("host");
    avatarUrl = avatarUrl.startsWith("http") ? avatarUrl : host + avatarUrl;
  }

  return {
    _id: u._id,
    name: u.name,
    email: u.email,
    phone: u.phone || "",
    address: u.address || "",
    avatar: avatarUrl,
    role: u.role?.name || "unknown",
    pets,
    appointments,
    activeAppointments,
    completedAppointments,
  };
};

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
      user: await safeUserData(user, req),
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
      { id: user._id, email: user.email, role: user.role?.name || "unknown" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      user: await safeUserData(user, req),
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Lấy profile hiện tại =====================
const getMe = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("role", "name");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json(await safeUserData(user, req));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Cập nhật profile =====================
const updateUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Không tìm thấy user" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const { name, phone, address } = req.body;

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    // Cập nhật avatar nếu upload
    if (req.file) {
      if (user.avatar) {
        const oldPath = path.join(
          __dirname,
          "../uploads",
          path.basename(user.avatar)
        );
        try {
          await fs.promises.unlink(oldPath);
        } catch (err) {
          console.log("Xoá avatar cũ thất bại:", err.message);
        }
      }
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.status(200).json(await safeUserData(user, req));
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Lấy tất cả users =====================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role", "name");
    const result = await Promise.all(users.map((u) => safeUserData(u, req)));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Lấy users theo role =====================
const getUsersByRole = async (req, res) => {
  try {
    const role = req.query.role;
    if (!role)
      return res
        .status(400)
        .json({ message: "Cần truyền query ?role=doctor hoặc ?role=owner" });

    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc)
      return res.status(400).json({ message: `Role ${role} không tồn tại` });

    const users = await User.find({ role: roleDoc._id }).populate(
      "role",
      "name"
    );
    const result = await Promise.all(users.map((u) => safeUserData(u, req)));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Đếm users theo role =====================
const getUserCounts = async (req, res) => {
  try {
    const roleQuery = req.query.role;
    if (!roleQuery)
      return res
        .status(400)
        .json({ message: "Cần truyền query ?role=doctor hoặc ?role=owner" });

    const roleDoc = await Role.findOne({ name: roleQuery });
    if (!roleDoc)
      return res
        .status(400)
        .json({ message: `Role ${roleQuery} không tồn tại` });

    const count = await User.countDocuments({ role: roleDoc._id });
    res.json({ role: roleQuery, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Lọc users theo role =====================
const getUsersWithRole = async (req, res) => {
  try {
    const roleQuery = req.query.role;
    let users;
    if (!roleQuery || roleQuery === "all") {
      users = await User.find().populate("role", "name");
    } else {
      const roleDoc = await Role.findOne({ name: roleQuery });
      if (!roleDoc)
        return res
          .status(400)
          .json({ message: `Role ${roleQuery} không tồn tại` });
      users = await User.find({ role: roleDoc._id }).populate("role", "name");
    }
    const result = await Promise.all(users.map((u) => safeUserData(u, req)));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Tìm kiếm users =====================
const searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search)
      return res.status(400).json({ message: "Cần truyền query ?search=xxx" });

    const regex = new RegExp(search, "i");
    const users = await User.find({
      $or: [{ name: regex }, { email: regex }],
    }).populate("role", "name");
    const result = await Promise.all(users.map((u) => safeUserData(u, req)));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Lấy chi tiết 1 user =====================
const getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role", "name");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json(await safeUserData(user, req));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Đổi role của user =====================
const changeUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { roleName } = req.body;
    if (!roleName)
      return res.status(400).json({ message: "Cần truyền roleName mới" });

    const role = await Role.findOne({ name: roleName });
    if (!role)
      return res
        .status(400)
        .json({ message: `Role ${roleName} không tồn tại` });

    const user = await User.findByIdAndUpdate(
      userId,
      { role: role._id },
      { new: true }
    ).populate("role", "name");

    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    res.json({
      message: `Đã đổi role thành công`,
      user: await safeUserData(user, req),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Xóa user =====================
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    // Xoá avatar nếu tồn tại
    if (user.avatar) {
      const filePath = path.join(
        __dirname,
        "../uploads",
        path.basename(user.avatar)
      );
      fs.promises
        .unlink(filePath)
        .catch((err) => console.log("Xoá avatar thất bại:", err.message));
    }

    res.json({ message: "Đã xóa user thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateUser,
  getAllUsers,
  getUsersByRole,
  getUserCounts,
  getUsersWithRole,
  searchUsers,
  getUserDetail,
  changeUserRole,
  deleteUser,
};
