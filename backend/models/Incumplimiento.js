const mongoose = require('mongoose');

const IncumplimientoSchema = new mongoose.Schema({
  empresa: { type: String, required: true, trim: true },
  fecha: { type: Date, required: true },
  incumplimiento: { type: Boolean, required: true },
  razon: { type: String },
  gravedad: { type: Number, min: 1, max: 5 },
  retenciones: { type: Number },
  comentario: { type: String }, // <-- nuevo campo
  creadoPor: { type: String }
});

// Middleware: siempre guardar empresa en mismo formato
IncumplimientoSchema.pre("save", function(next) {
  if (this.empresa) {
    this.empresa = this.empresa.trim();
  }
  next();
});

module.exports = mongoose.model('Incumplimiento', IncumplimientoSchema);
