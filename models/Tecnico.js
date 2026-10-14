const mongoose = require('mongoose');

const tecnicoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  especialidad: { type: String, required: true }, // Ej: "Redes", "Hardware", "Software"
  telefono: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Tecnico', tecnicoSchema);