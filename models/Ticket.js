const mongoose = require('mongoose');

// estructura  Ticket en la base de datos
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


module.exports = mongoose.model('Ticket', ticketSchema);