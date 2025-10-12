// routes/EmpresaRoutes.js
const express = require('express');
const Empresa = require('../models/Empresa');
const requireAuth = require('../middleware/requireAuth');
const { calcularColorEmpresa } = require('../utils/calculateRisk');
const router = express.Router();

// --- RUTAS PÚBLICAS ---
router.get('/', async (req, res) => {
  try {
    const empresas = await Empresa.find({});
    res.json(empresas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener empresas' });
  }
});

router.get('/:nombre', async (req, res) => {
  try {
    const empresa = await Empresa.findOne({
      nombre: { $regex: new RegExp(`^${req.params.nombre}$`, "i") },
    });
    res.json(empresa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener empresa' });
  }
});

// --- RUTAS PROTEGIDAS ---
router.post('/', requireAuth, async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'Falta nombre de empresa' });
    }

    const nueva = new Empresa({ nombre }); // 🔹 sin color por defecto
    await nueva.save();
    res.json({ ok: true, empresa: nueva });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear empresa' });
  }
});

// Editar empresa
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { nombre, semaforo } = req.body;
    const empresa = await Empresa.findByIdAndUpdate(
      req.params.id,
      { nombre, semaforo },
      { new: true }
    );
    res.json({ ok: true, empresa });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar empresa' });
  }
});

// Eliminar empresa
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Empresa.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar empresa' });
  }
});

// 🔁 Recalcular colores manualmente
router.post('/recalcular', requireAuth, async (req, res) => {
  try {
    const empresas = await Empresa.find({});
    for (const emp of empresas) {
      await calcularColorEmpresa(emp.nombre);
    }
    res.json({ ok: true, msg: 'Colores recalculados para todas las empresas' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al recalcular colores' });
  }
});

module.exports = router;
