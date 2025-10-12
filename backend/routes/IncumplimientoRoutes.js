// routes/IncumplimientoRoutes.js
const express = require('express');
const Incumplimiento = require('../models/Incumplimiento');
const requireAuth = require('../middleware/requireAuth');
const { calcularColorEmpresa } = require('../utils/calculateRisk');

const router = express.Router();

// Crear registro (protegido)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { empresa, fecha, incumplimiento, razon, gravedad, retenciones, comentario } = req.body;

    if (typeof incumplimiento !== "boolean" || !empresa || !fecha) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevo = new Incumplimiento({
      empresa,
      fecha,
      incumplimiento,
      razon: incumplimiento ? razon : undefined,
      gravedad: incumplimiento ? gravedad : undefined,
      retenciones: incumplimiento ? retenciones : undefined,
      comentario: !incumplimiento ? comentario : undefined,
      creadoPor: req.user.email,
    });

    await nuevo.save();

    // 🔁 Recalcular color de la empresa
    await calcularColorEmpresa(empresa);

    res.json({ ok: true, incumplimiento: nuevo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el registro' });
  }
});

// Listar registros
router.get('/', async (req, res) => {
  try {
    const { empresa } = req.query;
    const query = empresa
      ? { empresa: { $regex: new RegExp(`^${empresa}$`, "i") } }
      : {};
    const incumplimientos = await Incumplimiento.find(query).sort({ fecha: -1 });
    res.json(incumplimientos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener registros' });
  }
});

module.exports = router;
