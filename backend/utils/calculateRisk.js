// utils/calculateRisk.js
const Incumplimiento = require('../models/Incumplimiento');
const Empresa = require('../models/Empresa');
const Razon = require('../models/Razon');

// --- FUNCIÓN PRINCIPAL ---
async function calcularColorEmpresa(nombreEmpresa) {
  try {
    // 1️⃣ Buscar TODOS los registros de la empresa (cumplimientos + incumplimientos)
    const registros = await Incumplimiento.find({
      empresa: { $regex: new RegExp(`^${nombreEmpresa}$`, "i") },
    });

    // 2️⃣ Si no tiene registros → dejar sin color (null)
    if (!registros.length) {
      await Empresa.findOneAndUpdate(
        { nombre: { $regex: new RegExp(`^${nombreEmpresa}$`, "i") } },
        { semaforo: null, riesgo: null },
        { new: true }
      );
      return;
    }

    // 3️⃣ Cargar todas las razones con sus pesos desde la BD
    const razonesDocs = await Razon.find({});
    const pesosRazon = {};
    razonesDocs.forEach((r) => {
      pesosRazon[r.nombre] = r.peso;
    });

    // 4️⃣ Definir peso máximo posible (razón más alta * gravedad máxima)
    const pesoMaximo = Math.max(...Object.values(pesosRazon));
    const Pmax = pesoMaximo * 5;

    // 5️⃣ Calcular puntaje de cada registro
    const puntajes = registros.map((reg) => {
      if (reg.incumplimiento) {
        const W = pesosRazon[reg.razon] || 1; // si no está en la lista, asigna 1
        const G = reg.gravedad || 1;
        return (W * G * 100) / Pmax; // normaliza entre 0 y 100
      } else {
        // cumplimiento → contribuye con 0 (reduce el promedio)
        return 0;
      }
    });

    // 6️⃣ Calcular promedio total de riesgo
    const promedio = puntajes.reduce((a, b) => a + b, 0) / puntajes.length;

    // 7️⃣ Asignar color según umbrales
    let color = null;
    if (promedio >= 61) color = "rojo";
    else if (promedio >= 31) color = "amarillo";
    else color = "verde";

    // 8️⃣ Actualizar empresa en la BD
    await Empresa.findOneAndUpdate(
      { nombre: { $regex: new RegExp(`^${nombreEmpresa}$`, "i") } },
      { semaforo: color, riesgo: promedio.toFixed(2) },
      { new: true }
    );

    console.log(`✅ Riesgo recalculado para ${nombreEmpresa}: ${color} (${promedio.toFixed(2)})`);
  } catch (err) {
    console.error("❌ Error al calcular color de empresa:", err);
  }
}

module.exports = { calcularColorEmpresa };
