const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { 
    type: String, 
    enum: ['admin', 'lector'], 
    default: 'lector' 
  } // Define si es administrador o solo lector
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);