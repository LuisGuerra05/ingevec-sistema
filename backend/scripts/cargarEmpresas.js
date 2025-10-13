require("dotenv").config();
const mongoose = require("mongoose");
const Empresa = require("../models/Empresa");
const Razon = require("../models/Razon");
const Obra = require("../models/Obra");

const { MONGO_URI, DB_NAME } = process.env;

// === EMPRESAS ===
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
  { nombre: "UNION S.A.", semaforo: "verde" },
];

// === RAZONES CON PESO ===
const pesosRazon = {
  "Abandono de obra": 10,
  "Abandono e intervención de obra": 10,
  "Atraso y daños por trabajos extemporáneos": 6,
  "Daños por filtraciones": 6,
  "Intervención del contrato": 5,
  "Juicio laboral": 10,
  "Mal funcionamiento": 6,
  "Mal funcionamiento intervención": 7,
  "Mal funcionamiento de plazos": 8,
  "Plazo extendido contrato": 5,
  "Quiebra subcontrato": 1,
  "Otros": 3,
};

// === OBRAS ===
const obras = ["Miraflores 1406, Renca", "Libertad 51"];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
    console.log(`✅ Conectado a MongoDB: ${mongoose.connection.name}`);

    // --- Empresas ---
    await Empresa.deleteMany({});
    await Empresa.insertMany(empresas);
    console.log("🏗️ Empresas cargadas correctamente");

    // --- Razones ---
    await Razon.deleteMany({});
    const razonesDocs = Object.entries(pesosRazon).map(([nombre, peso]) => ({
      nombre,
      peso,
    }));
    await Razon.insertMany(razonesDocs);
    console.log("📊 Razones cargadas correctamente");

    // --- Obras ---
    await Obra.deleteMany({});
    await Obra.insertMany(obras.map((nombre) => ({ nombre })));
    console.log("🏢 Obras cargadas correctamente");

    await mongoose.disconnect();
    console.log("✅ Base de datos inicializada con éxito");
  } catch (err) {
    console.error("❌ Error al ejecutar seed:", err.message);
    process.exit(1);
  }
}

seed();
