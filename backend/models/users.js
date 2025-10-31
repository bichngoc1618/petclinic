const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  avatar: {
    type: String,  // sẽ lưu đường dẫn hoặc tên file ảnh
    default: "",   // có thể trống nếu người dùng chưa tải ảnh
  },
  phone: { 
    type: String, 
    default: "" 
  },
  address: { 
    type: String, 
    default: "" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("User", UserSchema);
