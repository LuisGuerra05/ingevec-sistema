const mongoose = require('mongoose');

const IncumplimientoSchema = new mongoose.Schema({
  empresa: { type: String, required: true },
  fecha: { type: Date, required: true },
  incumplimiento: { type: Boolean, required: true },
  razon: { type: String },
  gravedad: { type: Number, min: 1, max: 5 },
  retenciones: { type: Number },
  creadoPor: { type: String }
});

module.exports = mongoose.model('Incumplimiento', IncumplimientoSchema);