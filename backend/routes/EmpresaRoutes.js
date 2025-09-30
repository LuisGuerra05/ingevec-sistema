const express = require('express');
const Empresa = require('../models/Empresa');
const router = express.Router();

// Listar todas las empresas
router.get('/', async (req, res) => {
  const empresas = await Empresa.find({});
  res.json(empresas);
});

// Buscar una empresa por nombre (case-insensitive)
router.get('/:nombre', async (req, res) => {
  const empresa = await Empresa.findOne({
    nombre: { $regex: new RegExp(`^${req.params.nombre}$`, "i") }
  });
  res.json(empresa);
});

module.exports = router;
