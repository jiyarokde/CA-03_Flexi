const mongoose = require("mongoose");
module.exports = mongoose.model("Student", new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNo: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  year: { type: Number, required: true, min: 1, max: 6 },
  address: { type: String, default: "", trim: true },
}, { timestamps: true }));
