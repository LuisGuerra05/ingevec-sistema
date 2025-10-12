const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  semaforo: {
    type: String,
    enum: ['rojo', 'amarillo', 'verde', null],
    default: null, // 🔹 sin color por defecto
  },
  riesgo: {
    type: Number,
    min: 0,
    max: 100,
    default: null, // 🔹 solo se llena si hay incumplimientos
  },
});

module.exports = mongoose.model('Empresa', EmpresaSchema);
