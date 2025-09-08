const express = require('express');
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');
const jwt = require('jsonwebtoken');

const router = express.Router();

function isIngevecEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@ingevec\.cl$/.test(email);
}

router.post('/test-user', async (req, res) => {
  const { email, password } = req.body;
  if (!isIngevecEmail(email)) {
    return res.status(400).json({ error: 'Solo se permiten correos @alumnos.uai.cl' });
  }
  try {
    const hash = await User.hashPassword(password, process.env.PEPPER, process.env.SALT_ROUNDS);
    const user = await User.findOneAndUpdate(
      { email },
      { email, passwordHash: hash },
      { upsert: true, new: true }
    );
    res.json({ ok: true, user: { email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Intentando login:', email, password);
  const user = await User.findOne({ email });
  console.log('Usuario encontrado:', user);
  if (!user) return res.status(401).json({ error: 'Correo o contraseña incorrecta' });
  const ok = await user.verifyPassword(password, process.env.PEPPER);
  console.log('Verificación de contraseña:', ok);
  if (!ok) return res.status(401).json({ error: 'Correo o contraseña incorrecta' });

  
  if (!isIngevecEmail(email)) {
    return res.status(401).json({ error: 'Correo o contraseña incorrecta' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Correo o contraseña incorrecta' });
    const ok = await user.verifyPassword(password, process.env.PEPPER);
    if (!ok) return res.status(401).json({ error: 'Correo o contraseña incorrecta' });

    const token = jwt.sign(
      { sub: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ ok: true, token, user: { email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Error en login' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: { email: req.user.email } });
});

router.get('/users', async (req, res) => {
  const users = await User.find({}, { email: 1, _id: 0 });
  res.json({ users: users.map(u => u.email) });
});

module.exports = router;