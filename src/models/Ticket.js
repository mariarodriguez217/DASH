const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Ticket = sequelize.define('Ticket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.TEXT, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  tecnico_id: { type: DataTypes.INTEGER, allowNull: false },
  estado: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'pendiente',
    validate: { isIn: [['pendiente', 'en_progreso', 'realizado']] }
  },
  prioridad: { type: DataTypes.TEXT, defaultValue: 'media' },
  categoria: { type: DataTypes.TEXT },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fecha_resolucion: { type: DataTypes.DATE }
}, {
  tableName: 'tickets',
  timestamps: false
});

module.exports = Ticket;