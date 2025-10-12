// scripts/recalcularEmpresas.js
const mongoose = require('mongoose');
const { calcularColorEmpresa } = require('../utils/calculateRisk');
const Empresa = require('../models/Empresa');
require('dotenv').config(); // si usas variables de entorno

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const empresas = await Empresa.find({});
    console.log(`Recalculando ${empresas.length} empresas...\n`);

    for (const emp of empresas) {
      await calcularColorEmpresa(emp.nombre);
      console.log(`✔ ${emp.nombre}`);
    }

    console.log("\n✅ Recalculo completo. Puedes cerrar este script.");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
