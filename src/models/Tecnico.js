const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Tecnico = sequelize.define('Tecnico', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.TEXT, allowNull: false },
  email: { type: DataTypes.TEXT, allowNull: false, unique: true },
  especialidad: { type: DataTypes.TEXT, allowNull: false },
  telefono: { type: DataTypes.TEXT }
}, {
  tableName: 'tecnicos',
  timestamps: false
});

module.exports = Tecnico;