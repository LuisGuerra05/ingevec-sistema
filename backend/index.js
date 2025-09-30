require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const UserRoutes = require('./routes/UserRoutes');
const IncumplimientoRoutes = require('./routes/IncumplimientoRoutes');
const EmpresaRoutes = require('./routes/EmpresaRoutes');

const { MONGO_URI, DB_NAME, PORT } = process.env;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', UserRoutes);
app.use('/api/incumplimientos', IncumplimientoRoutes);
app.use('/api/empresas', EmpresaRoutes);

mongoose.connect(MONGO_URI, { dbName: DB_NAME })
  .then(() => {
    const dbName = mongoose.connection.name;
    console.log(`Conectado a MongoDB: ${dbName}`);
    if (dbName === 'test') {
      console.error("La conexión apunta a 'test'. Define el nombre de la BD en MONGO_URI (…/mi_bd) o en DB_NAME.");
      process.exit(1);
    }
    app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error de conexión a MongoDB:', err.message);
    process.exit(1);
  });