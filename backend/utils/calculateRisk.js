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
    // 1️⃣ Buscar los incumplimientos de la empresa
    const registros = await Incumplimiento.find({
      empresa: { $regex: new RegExp(`^${nombreEmpresa}$`, "i") },
      incumplimiento: true,
    });

    // 2️⃣ Si no tiene registros de incumplimiento → sin color (null)
    if (!registros.length) {
      await Empresa.findOneAndUpdate(
        { nombre: { $regex: new RegExp(`^${nombreEmpresa}$`, "i") } },
        { semaforo: null, riesgo: null },
        { new: true }
      );
      return;
    }

    // 3️⃣ Calcular puntaje ponderado
    const puntajes = registros.map((reg) => {
      const W = pesosRazon[reg.razon] || 1;
      const G = reg.gravedad || 1;
      return W * G;
    });

    // 4️⃣ Normalizar y promediar
    const Pmax = 12 * 5; // razón más alta (12) * gravedad máxima (5)
    const normalizados = puntajes.map((p) => (p / Pmax) * 100);
    const promedio = normalizados.reduce((a, b) => a + b, 0) / normalizados.length;

    // 5️⃣ Determinar color
    let color = null;
    if (promedio >= 61) color = "rojo";
    else if (promedio >= 31) color = "amarillo";
    else if (promedio >= 0) color = "verde";

    // 6️⃣ Actualizar la empresa con color y valor de riesgo
    await Empresa.findOneAndUpdate(
      { nombre: { $regex: new RegExp(`^${nombreEmpresa}$`, "i") } },
      { semaforo: color, riesgo: promedio.toFixed(2) }, // 🔹 guardamos valor numérico redondeado
      { new: true }
    );
  } catch (err) {
    console.error("Error al calcular color de empresa:", err);
  }
}

module.exports = { calcularColorEmpresa, pesosRazon };
