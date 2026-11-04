const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// POST /api/auth/login
// Body: { "usuario": "admin", "password": "..." }
// "usuario" puede ser el nombre ("admin") o el email de la tabla usuarios.
const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
    }

    const { rows } = await pool.query(
      `SELECT id, nombre, email, password
       FROM usuarios
       WHERE nombre = $1 OR email = $1
       LIMIT 1`,
      [usuario]
    );
    const admin = rows[0];

    // Mismo mensaje si el usuario no existe o la contraseña está mal,
    // para no revelar qué usuarios existen.
    const valido = admin && (await bcrypt.compare(password, admin.password));
    if (!valido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: admin.id, nombre: admin.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: { id: admin.id, nombre: admin.nombre, email: admin.email }
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { login };