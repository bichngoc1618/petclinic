const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ["cash", "credit_card", "transfer"],
    required: true,
  },
  status: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
  },
  paymentDate: { type: Date },
});

module.exports = mongoose.model("Payment", PaymentSchema);
