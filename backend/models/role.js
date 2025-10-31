const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["admin", "doctor", "owner"],
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Role", RoleSchema);
