// backend/models/service.js
const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, required: true }, // lưu đường dẫn icon
});

module.exports = mongoose.model("Service", ServiceSchema);
