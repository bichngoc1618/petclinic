const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["male", "female"], default: "male" },
  image: { type: String }, // chỉ 1 ảnh
});

module.exports = mongoose.model("Pet", petSchema);
