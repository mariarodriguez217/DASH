const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// 1. CREAR un nuevo ticket
router.post('/', async (req, res) => {
  try {
    const nuevoTicket = new Ticket(req.body);
    const ticketGuardado = await nuevoTicket.save();
    res.status(201).json(ticketGuardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el ticket', detalle: error.message });
  }
});

// 2. OBTENER todos los tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los tickets' });
  }
});

// 3. OBTENER LAS MÉTRICAS (¡Clave para tu dashboard!)
router.get('/metricas', async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    
    // Si no hay tickets, devolvemos ceros para evitar errores matemáticos
    if (totalTickets === 0) {
      return res.json({
        total: 0,
        porcentajeRealizados: 0,
        porcentajePendientes: 0,
        tareasPorTecnico: []
      });
    }

    // Contar cuántos están realizados
    const realizados = await Ticket.countDocuments({ estado: 'realizado' });
    
    // Calcular porcentaje total de realizadas
    const porcentajeRealizados = ((realizados / totalTickets) * 100).toFixed(1);

    // Agrupar tareas por técnico usando MongoDB (Aggregation Pipeline)
    const tareasPorTecnico = await Ticket.aggregate([
      {
        $group: {
          _id: '$tecnico', // Agrupa por el nombre del técnico
          totalTareas: { $sum: 1 }, // Cuenta cuántas tareas tiene en total
          realizadas: {
            $sum: {$cond: [{ $eq: ['$estado', 'realizado'] }, 1, 0] } // Cuenta cuántas hizo
          }
        }
      }
    ]);

    res.json({
      totalTickets,
      realizados,
      porcentajeRealizados: `${porcentajeRealizados}%`,
      tareasPorTecnico
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al calcular las métricas', detalle: error.message });
  }
});

module.exports = router;