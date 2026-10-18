const Tecnico = require('./Tecnico');
const Ticket = require('./Ticket');
const Usuario = require('./Usuario');

Tecnico.hasMany(Ticket, { foreignKey: 'tecnico_id' });
Ticket.belongsTo(Tecnico, { foreignKey: 'tecnico_id', as: 'tecnico' });

module.exports = { Tecnico, Ticket, Usuario };