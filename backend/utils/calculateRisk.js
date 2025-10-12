const Incumplimiento = require('../models/Incumplimiento');
const Empresa = require('../models/Empresa');

// Pesos provisionales (1–12)
const pesosRazon = {
  "Abandono de obra": 1,
  "Abandono e intervención de obra": 2,
  "Atraso y daños por trabajos extemporáneos": 3,
  "Daños por filtraciones": 4,
  "Intervención del contrato": 5,
  "Juicio laboral": 6,
  "Mal funcionamiento": 7,
  "Mal funcionamiento intervención": 8,
  "Mal funcionamiento de plazos": 9,
  "Plazo extendido contrato": 10,
  "Quiebra subcontrato": 11,
  "Otros": 12,
};

// --- FUNCIÓN PRINCIPAL ---
async function calcularColorEmpresa(nombreEmpresa) {
  try {
    // 1️⃣ Buscar TODOS los registros (cumplimientos + incumplimientos)
    const registros = await Incumplimiento.find({
      empresa: { $regex: new RegExp(`^${nombreEmpresa}$`, "i") },
    });

    // 2️⃣ Si no tiene registros → sin color (null)
    if (!registros.length) {
      await Empresa.findOneAndUpdate(
        { nombre: { $regex: new RegExp(`^${nombreEmpresa}$`, "i") } },
        { semaforo: null, riesgo: null },
        { new: true }
      );
      return;
    }

    const Pmax = 12 * 5; // razón más alta (12) * gravedad máxima (5)
    const puntajes = registros.map((reg) => {
      if (reg.incumplimiento) {
        const W = pesosRazon[reg.razon] || 1;
        const G = reg.gravedad || 1;
        return (W * G * 100) / Pmax; // valor normalizado 0–100
      } else {
        // Cumplimiento → valor 0, que baja el promedio (bueno)
        return 0;
      }
    });

    // 3️⃣ Calcular promedio general (cumplimientos e incumplimientos)
    const promedio = puntajes.reduce((a, b) => a + b, 0) / puntajes.length;

    // 4️⃣ Determinar color según umbrales
    let color = null;
    if (promedio >= 61) color = "rojo";
    else if (promedio >= 31) color = "amarillo";
    else color = "verde";

    // 5️⃣ Actualizar empresa con color y riesgo promedio
    await Empresa.findOneAndUpdate(
      { nombre: { $regex: new RegExp(`^${nombreEmpresa}$`, "i") } },
      { semaforo: color, riesgo: promedio.toFixed(2) },
      { new: true }
    );
  } catch (err) {
    console.error("Error al calcular color de empresa:", err);
  }
}

module.exports = { calcularColorEmpresa, pesosRazon };
