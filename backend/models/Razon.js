const mongoose = require("mongoose");

const RazonSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true },
  peso: { type: Number, required: true, default: 6 },
});

module.exports = mongoose.model("Razon", RazonSchema);