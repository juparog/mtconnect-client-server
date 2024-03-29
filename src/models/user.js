const Bcrypt = require('bcrypt');
const Mongoose = require('mongoose');
const Validate = require('mongoose-validator');

const { Schema } = Mongoose;

// Constante para el esquema de usuarios
const userSchema = new Schema({
  // Campos del usuario
  first_name: {
    type: String,
    required: true,
  },
  last_name: String,
  username: {
    type: String,
    unique: true,
    required: true,
    index: { unique: true },
    validate: Validate({
      validator: 'isLength',
      arguments: [3, 50],
      message: 'El nombre del usuario debe estar entre {ARGS[0]} y {ARGS[1]} caracteres',
    }),
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: Validate({
      validator: 'isEmail',
      message: 'Introduce un correo valido',
    }),
  },
  password: {
    type: String,
    required: true,
    validate: Validate({
      validator: 'isLength',
      arguments: [6, 100],
      message: 'La contraseña debe estar entre {ARGS[0]} y {ARGS[1]} caracteres',
    }),
  },
});

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await Bcrypt.hash(this.password, 10);
    return next();
  } catch (err) {
    return next(err);
  }
});

const userModel = Mongoose.model('User', userSchema);

exports.UserModel = userModel;
