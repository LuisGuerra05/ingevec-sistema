const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  semaforo: { type: String, enum: ['rojo', 'amarillo', 'verde'], required: true }
});

module.exports = mongoose.model('Empresa', EmpresaSchema);