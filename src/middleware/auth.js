const jwt = require('jsonwebtoken');

// Protege una ruta: exige el header  Authorization: Bearer <token>
module.exports = (req, res, next) => {
  const [tipo, token] = (req.headers.authorization || '').split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Sesión inválida o vencida' });
  }
};