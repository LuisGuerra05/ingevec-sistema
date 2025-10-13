const express = require("express");
const Incumplimiento = require("../models/Incumplimiento");
const requireAuth = require("../middleware/requireAuth");
const { calcularColorEmpresa } = require("../utils/calculateRisk");

const router = express.Router();

// Crear registro
router.post("/", requireAuth, async (req, res) => {
  try {
    const { empresa, obra, fecha, incumplimiento, razon, gravedad, retencionSiNo, comentario } = req.body;

    if (!empresa || !obra || typeof incumplimiento !== "boolean" || !fecha)
      return res.status(400).json({ error: "Faltan campos obligatorios" });

    const nuevo = new Incumplimiento({
      empresa,
      obra,
      fecha,
      incumplimiento,
      razon: incumplimiento ? razon : undefined,
      gravedad: incumplimiento ? gravedad : undefined,
      retencionSiNo: incumplimiento ? retencionSiNo : "No",
      comentario: !incumplimiento ? comentario : undefined,
      creadoPor: req.user.email,
    });

    await nuevo.save();
    await calcularColorEmpresa(empresa);

    res.json({ ok: true, incumplimiento: nuevo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar el registro" });
  }
});

// Listar
router.get("/", async (req, res) => {
  try {
    const { empresa } = req.query;
    const query = empresa
      ? { empresa: { $regex: new RegExp(`^${empresa}$`, "i") } }
      : {};
    const incumplimientos = await Incumplimiento.find(query).sort({ fecha: -1 });
    res.json(incumplimientos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener registros" });
  }
});

module.exports = router;
