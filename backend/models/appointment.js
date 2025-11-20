const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true }],
  services: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "treating", "completed", "cancelled"], // ✅ thêm "cancelled"
    default: "pending",
  },
  note: { type: String },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
