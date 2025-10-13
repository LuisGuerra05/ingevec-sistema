// routes/opcionesRoutes.js
const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const Empresa = require("../models/Empresa");
const Razon = require("../models/Razon");
const Obra = require("../models/Obra");

const router = express.Router();

// --- Obtener listas ---
router.get("/:tipo/list", async (req, res) => {
  try {
    const { tipo } = req.params;
    let data = [];

    switch (tipo) {
      case "empresa":
        data = await Empresa.find({}, { nombre: 1, _id: 0 });
        break;
      case "razon":
        data = await Razon.find({}, { nombre: 1, peso: 1, _id: 0 });
        break;
      case "obra":
        data = await Obra.find({}, { nombre: 1, _id: 0 });
        break;
      default:
        return res.status(400).json({ error: "Tipo no válido" });
    }

    // 🔹 Orden alfabético por nombre
    data.sort((a, b) => a.nombre.localeCompare(b.nombre));

    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Error al obtener opciones:", err.message);
    res.status(500).json({ error: "Error al obtener opciones" });
  }
});

// --- Agregar nueva opción ---
router.post("/:tipo", requireAuth, async (req, res) => {
  try {
    const { tipo } = req.params;
    const { valor } = req.body;

    if (!valor) return res.status(400).json({ error: "Falta valor" });

    const nombre = valor.trim();
    let Modelo;

    if (tipo === "empresa") Modelo = Empresa;
    else if (tipo === "razon") Modelo = Razon;
    else if (tipo === "obra") Modelo = Obra;
    else return res.status(400).json({ error: "Tipo no válido" });

    const existe = await Modelo.findOne({ nombre: new RegExp(`^${nombre}$`, "i") });
    if (existe) return res.json({ ok: true, mensaje: "Ya existe" });

    const doc = tipo === "razon" ? { nombre, peso: 5 } : { nombre };
    await Modelo.create(doc);
    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Error al guardar opción:", err.message);
    res.status(500).json({ error: "Error al guardar opción" });
  }
});

module.exports = router;
