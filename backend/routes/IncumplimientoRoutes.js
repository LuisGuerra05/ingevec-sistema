const express = require('express');
const Incumplimiento = require('../models/Incumplimiento');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

// Crear registro
router.post('/', requireAuth, async (req, res) => {
  try {
    const { empresa, fecha, incumplimiento, razon, gravedad, retenciones, comentario } = req.body;

    if (typeof incumplimiento !== "boolean" || !empresa || !fecha) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    if (incumplimiento) {
      if (!razon || !gravedad) {
        return res.status(400).json({ error: 'Debe ingresar razón y gravedad' });
      }
    }

    const nuevo = new Incumplimiento({
      empresa,
      fecha,
      incumplimiento,
      razon: incumplimiento ? razon : undefined,
      gravedad: incumplimiento ? gravedad : undefined,
      retenciones: incumplimiento ? retenciones : undefined,
      comentario: !incumplimiento ? comentario : undefined, // guardar solo si es cumplimiento
      creadoPor: req.user.email
    });

    await nuevo.save();
    res.json({ ok: true, incumplimiento: nuevo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el registro' });
  }
});

// Listar registros (por empresa si viene query)
router.get('/', async (req, res) => {
  try {
    const { empresa } = req.query;
    let query = {};

    if (empresa) {
      query.empresa = { $regex: new RegExp(`^${empresa}$`, "i") }; // case-insensitive
    }

    const incumplimientos = await Incumplimiento.find(query).sort({ fecha: -1 });
    res.json(incumplimientos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener registros' });
  }
});

module.exports = router;
