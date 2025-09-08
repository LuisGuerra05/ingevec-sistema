const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true }
});

UserSchema.statics.hashPassword = async function(plain, pepper, saltRounds) {
  const salted = plain + pepper;
  return await bcrypt.hash(salted, Number(saltRounds));
};

UserSchema.methods.verifyPassword = async function(plain, pepper) {
  const salted = plain + pepper;
  return await bcrypt.compare(salted, this.passwordHash);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;