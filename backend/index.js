require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const requireAuth = require('./middleware/requireAuth');

const UserRoutes = require('./routes/UserRoutes');
const IncumplimientoRoutes = require('./routes/IncumplimientoRoutes');
const EmpresaRoutes = require('./routes/EmpresaRoutes');

const { MONGO_URI, DB_NAME, PORT } = process.env;

const app = express();
app.use(cors());
app.use(express.json());

// APIs
app.use('/api', UserRoutes);
app.use('/api/incumplimientos', IncumplimientoRoutes);
app.use('/api/empresas', EmpresaRoutes);

// --- Servir React ---
// subir un nivel desde backend -> luego entrar a frontend/build
const frontendPath = path.join(__dirname, "..", "frontend", "build");
app.use(express.static(frontendPath));

// Catch-all: rutas que no sean /api
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// --- Mongo ---
mongoose.connect(MONGO_URI, { dbName: DB_NAME })
  .then(() => {
    const dbName = mongoose.connection.name;
    console.log(`Conectado a MongoDB: ${dbName}`);
    if (dbName === 'test') {
      console.error("⚠️ La conexión apunta a 'test'. Define la BD en MONGO_URI (…/mi_bd) o en DB_NAME.");
      process.exit(1);
    }
    app.listen(PORT || 3000, () => {
      console.log(`Servidor escuchando en puerto ${PORT || 3000}`);
    });
  })
  .catch(err => {
    console.error('Error de conexión a MongoDB:', err.message);
    process.exit(1);
  });
