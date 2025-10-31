const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  species: { type: String, required: true }, // loài: chó, mèo, v.v.
  breed: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ["male", "female"] },
});

module.exports = mongoose.model("Pet", PetSchema);
