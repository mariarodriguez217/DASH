const Ticket = require('../models/Ticket');

// 1. Crear un nuevo ticket
const crearTicket = async (req, res) => {
  try {
    const nuevoTicket = new Ticket(req.body);
    const ticketGuardado = await nuevoTicket.save();
    res.status(201).json(ticketGuardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el ticket', detalle: error.message });
  }
};

// 2. Obtener todos los tickets
const obtenerTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los tickets' });
  }
};

// 3. Obtener las métricas
const obtenerMetricas = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    
    if (totalTickets === 0) {
      return res.json({
        total: 0,
        porcentajeRealizados: 0,
        porcentajePendientes: 0,
        tareasPorTecnico: []
      });
    }

    const realizados = await Ticket.countDocuments({ estado: 'realizado' });
    const porcentajeRealizados = ((realizados / totalTickets) * 100).toFixed(1);

    const tareasPorTecnico = await Ticket.aggregate([
      {
        $group: {
          _id: '$tecnico',
          totalTareas: { $sum: 1 },
          realizadas: {
            $sum: {$cond: [{ $eq: ['$estado', 'realizado'] }, 1, 0] }
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
};


module.exports = {
  crearTicket,
  obtenerTickets,
  obtenerMetricas
};