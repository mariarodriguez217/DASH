const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_universidad_123';

// 1. Verificar que el usuario esté logueado (tenga token válido)
const verificarToken = (req, res, next) => {
  const tokenHeader = req.header('Authorization');

  if (!tokenHeader) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    // El token suele venir como "Bearer <token>", limpiamos el string
    const token = tokenHeader.replace('Bearer ', '');
    const cifrado = jwt.verify(token, JWT_SECRET);
    
    req.usuario = cifrado; // Guardamos los datos del usuario en la petición
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

// 2. Verificar específicamente si el rol es 'admin'
const verificarAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next(); // Si es admin, puede continuar
  } else {
    res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de Administrador.' });
  }
};

module.exports = {
  verificarToken,
  verificarAdmin
};