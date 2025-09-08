require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const { MONGO_URI, DB_NAME, PEPPER, SALT_ROUNDS } = process.env;

async function seed() {
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  const dbName = mongoose.connection.name;
  console.log(`Conectado a MongoDB: ${dbName}`);

  const email = 'admin@ingevec.cl';
  const password = 'admin123';
  const hash = await User.hashPassword(password, PEPPER, SALT_ROUNDS);

  const user = await User.findOneAndUpdate(
    { email },
    { email, passwordHash: hash },
    { upsert: true, new: true }
  );
  console.log(`Usuario sembrado: ${user.email}`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Error al sembrar usuario:', err.message);
  process.exit(1);
});