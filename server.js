const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('¡Conectado exitosamente a MongoDB Atlas!'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de la Ticketera funcionando 🚀');
});

// Importar y usar las rutas de tickets
const ticketRoutes = require('./routes/tickets');
app.use('/api/tickets', ticketRoutes);
// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});