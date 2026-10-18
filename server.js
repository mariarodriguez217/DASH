require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Probar la conexión a la base
pool.query('SELECT NOW()')
  .then(() => console.log('¡Conectado exitosamente a Neon (PostgreSQL)!'))
  .catch((error) => console.error('Error al conectar a la base:', error));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de la Ticketera funcionando 🚀');
});

// Rutas
app.use('/api/tickets', require('./src/routes/tickets'));
//app.use('/api/metricas', require('./src/routes/metricas'));

// Autenticación (pendiente de migrar a Postgres)
// app.use('/api/auth', require('./src/routes/auth'));

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});