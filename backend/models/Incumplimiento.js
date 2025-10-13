const mongoose = require('mongoose');

const IncumplimientoSchema = new mongoose.Schema({
  empresa: { type: String, required: true, trim: true },
  obra: { type: String, required: true, trim: true },
  fecha: { type: Date, required: true },
  incumplimiento: { type: Boolean, required: true },
  razon: { type: String },
  gravedad: { type: Number, min: 1, max: 5 },
  retencionSiNo: { type: String, enum: ["Sí", "No"], default: "No" },
  comentario: { type: String },
  creadoPor: { type: String }
});

IncumplimientoSchema.pre("save", function (next) {
  if (this.empresa) this.empresa = this.empresa.trim();
  if (this.obra) this.obra = this.obra.trim();
  next();
});

module.exports = mongoose.model("Incumplimiento", IncumplimientoSchema);
