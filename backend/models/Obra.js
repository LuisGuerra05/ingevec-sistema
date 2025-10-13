const mongoose = require("mongoose");

const ObraSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true },
});

module.exports = mongoose.model("Obra", ObraSchema);
