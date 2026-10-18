const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET

// 1. LOGIN DE USUARIOS (Admin o Lector)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar si el usuario existe en la base de datos
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ error: 'Credenciales inválidas (usuario no encontrado)' });
    }

    // Comparar la contraseña ingresada con la contraseña encriptada en la base de datos
    const esPasswordValida = await bcrypt.compare(password, usuario.password);
    if (!esPasswordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas (contraseña incorrecta)' });
    }

    // Generar un Token JWT que expira en 8 horas
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: '¡Login exitoso!',
      token,
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión', detalle: error.message });
  }
};

// 2. CREAR USUARIO (Solo permitido para administradores)
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario (puede ser 'admin' o 'lector')
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordEncriptada,
      rol: rol || 'lector' // Por defecto se crea como lector si no se especifica
    });

    await nuevoUsuario.save();

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: {
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario', detalle: error.message });
  }
};

module.exports = {
  login,
  crearUsuario
};