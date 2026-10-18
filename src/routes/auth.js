const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');

// Ruta para hacer login (pública)
router.post('/login', authController.login);


router.post('/registrar', verificarToken, verificarAdmin, authController.crearUsuario);

module.exports = router;