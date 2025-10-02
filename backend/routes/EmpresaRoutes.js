const express = require('express');
const Empresa = require('../models/Empresa');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

// --- RUTAS PÚBLICAS ---
// Listar todas las empresas
router.get('/', async (req, res) => {
  try {
    const empresas = await Empresa.find({});
    res.json(empresas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener empresas' });
  }
});

// Buscar una empresa por nombre (case-insensitive)
router.get('/:nombre', async (req, res) => {
  try {
    const empresa = await Empresa.findOne({
      nombre: { $regex: new RegExp(`^${req.params.nombre}$`, "i") }
    });
    res.json(empresa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener empresa' });
  }
});

// --- RUTAS PROTEGIDAS ---
// Crear nueva empresa
router.post('/', requireAuth, async (req, res) => {
  try {
    const { nombre, semaforo } = req.body;
    if (!nombre || !semaforo) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const nueva = new Empresa({ nombre, semaforo });
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

module.exports = router;
