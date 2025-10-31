const mongoose = require("mongoose");

const MedicalRecordSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  diagnosis: { type: String },
  treatment: { type: String },
  services: [
    {
      type: String,
      enum: ["bath", "haircut", "vaccination", "checkup", "surgery"],
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MedicalRecord", MedicalRecordSchema);
