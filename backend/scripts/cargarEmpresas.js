require('dotenv').config();
const mongoose = require('mongoose');
const Empresa = require('../models/Empresa');

const { MONGO_URI, DB_NAME } = process.env;

const empresas = [
  { nombre: "ALEJANDRO ESTEBAN SAZO MONDACA", semaforo: "rojo" },
  { nombre: "ARTEYESPRO CHILE SPA", semaforo: "amarillo" },
  { nombre: "COMERCIAL SANDOVAL Y CIA LTDA.", semaforo: "verde" },
  { nombre: "CONSTRUCCIONES JARAMILLO SPA", semaforo: "rojo" },
  { nombre: "CONSTRUCTORA INGEVEC S.A.", semaforo: "verde" },
  { nombre: "EDUARDO EUGENIO LOYOLA MOLINA", semaforo: "amarillo" },
  { nombre: "EQUIPOS Y SERV INTEGRALES A LA CONSTRUCCION LTDA", semaforo: "verde" },
  { nombre: "GAET INGENIERIA & SERVICIOS LIMITADA", semaforo: "rojo" },
  { nombre: "GRITTIMETAL SPA", semaforo: "amarillo" },
  { nombre: "INMOBILIARIA Y CONSTRUCTORA AISLACON SPA", semaforo: "verde" },
  { nombre: "ISSAN LTDA", semaforo: "rojo" },
  { nombre: "MVSS SPA", semaforo: "amarillo" },
  { nombre: "OBRAS Y SERVICIOS DE BOMBEO SPA", semaforo: "verde" },
  { nombre: "SILVA PAVIMENTOS Y CONSTRUCCION LIMITADA", semaforo: "rojo" },
  { nombre: "TRANSPORTES YEVENES SPA", semaforo: "amarillo" },
  { nombre: "UNION S.A.", semaforo: "verde" }
];

async function seed() {
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  const dbName = mongoose.connection.name;
  console.log(`Conectado a MongoDB: ${dbName}`);

  await Empresa.deleteMany({});
  await Empresa.insertMany(empresas);
  console.log('Empresas cargadas');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Error al cargar empresas:', err.message);
  process.exit(1);
});