const express = require('express');
const Incumplimiento = require('../models/Incumplimiento');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    const { empresa, fecha, incumplimiento, razon, gravedad, retenciones } = req.body;
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
      creadoPor: req.user.email
    });
    await nuevo.save();
    res.json({ ok: true, incumplimiento: nuevo });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar el incumplimiento' });
  }
});

module.exports = router;