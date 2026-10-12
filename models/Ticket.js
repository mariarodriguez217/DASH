const mongoose = require('mongoose');

// Definimos la estructura que tendrá un Ticket en la base de datos
const ticketSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  tecnico: { type: String, required: true }, // Nombre del técnico asignado
  estado: { 
    type: String, 
    enum: ['pendiente', 'en_progreso', 'realizado'], 
    default: 'pendiente' 
  },
  fechaCreacion: { type: Date, default: Date.now }
});

// Creamos y exportamos el modelo
module.exports = mongoose.model('Ticket', ticketSchema);