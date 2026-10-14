
const express = require('express');
const router = express.Router();


const ticketController = require('../controllers/ticketController');


router.post('/', ticketController.crearTicket);
router.get('/', ticketController.obtenerTickets);
router.get('/metricas', ticketController.obtenerMetricas);

module.exports = router;