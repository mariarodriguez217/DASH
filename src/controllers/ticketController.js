const pool = require('../config/db');

const obtenerTickets = async (req, res) => {
  try {
    const { tecnico_id, estado, prioridad, categoria, desde, hasta } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const condiciones = [];
    const valores = [];

    const agregar = (sql, valor) => {
      valores.push(valor);
      condiciones.push(sql.replace('?', `$${valores.length}`));
    };

    if (tecnico_id && tecnico_id !== '') agregar('k.tecnico_id = ?', parseInt(tecnico_id, 10));
    if (estado && estado !== '')         agregar('k.estado = ?', estado);
    if (prioridad && prioridad !== '')   agregar('k.prioridad = ?', prioridad);
    if (categoria && categoria !== '')   agregar('k.categoria = ?', categoria);
    if (desde && desde !== '')           agregar('k.fecha_creacion >= ?', desde);
    if (hasta && hasta !== '')           agregar('k.fecha_creacion <= ?', hasta);

    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

    const totalResult = await pool.query(
      `SELECT COUNT(*)::int AS total 
       FROM tickets k
       LEFT JOIN tecnicos t ON t.id = k.tecnico_id
       ${where}`,
      valores
    );
    const total = totalResult.rows[0]?.total || 0;

    const { rows } = await pool.query(
      `SELECT k.id, k.titulo, k.descripcion, k.estado, k.prioridad, k.categoria,
              k.fecha_creacion, k.fecha_resolucion,
              t.id AS tecnico_id, COALESCE(t.nombre, 'Sin asignar') AS tecnico
       FROM tickets k
       LEFT JOIN tecnicos t ON t.id = k.tecnico_id
       ${where}
       ORDER BY k.fecha_creacion DESC
       LIMIT $${valores.length + 1} OFFSET $${valores.length + 2}`,
      [...valores, limit, offset]
    );

    res.json({
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error detallado en obtenerTickets:', error);
    res.status(500).json({ error: 'Error al obtener los tickets', detalle: error.message });
  }
};

const obtenerMetricas = async (req, res) => {
  try {
    const general = await pool.query(`
      SELECT
        COUNT(*)::int AS total,
        (COUNT(*) FILTER (WHERE estado = 'realizado'))::int   AS realizados,
        (COUNT(*) FILTER (WHERE estado = 'en_progreso'))::int AS en_progreso,
        (COUNT(*) FILTER (WHERE estado = 'pendiente'))::int   AS pendientes,
        COALESCE(ROUND(100.0 * COUNT(*) FILTER (WHERE estado = 'realizado') / NULLIF(COUNT(*), 0), 1), 0)::float AS porcentaje_realizados,
        COALESCE(ROUND(100.0 * COUNT(*) FILTER (WHERE estado = 'pendiente') / NULLIF(COUNT(*), 0), 1), 0)::float AS porcentaje_pendientes,
        ROUND((EXTRACT(EPOCH FROM AVG(fecha_resolucion - fecha_creacion)) / 86400)::numeric, 1)::float AS dias_promedio_resolucion,
        (COUNT(*) FILTER (WHERE estado <> 'realizado' AND fecha_creacion < now() - interval '30 days'))::int AS atrasados
      FROM tickets
    `);

    const porTecnico = await pool.query(`
      SELECT t.id,
             t.nombre,
             COUNT(*)::int AS total,
             (COUNT(*) FILTER (WHERE k.estado = 'realizado'))::int AS realizados,
             ROUND(100.0 * COUNT(*) FILTER (WHERE k.estado = 'realizado') / COUNT(*), 1)::float AS porcentaje,
             ROUND((EXTRACT(EPOCH FROM AVG(k.fecha_resolucion - k.fecha_creacion)) / 86400)::numeric, 1)::float AS dias_promedio
      FROM tickets k
      JOIN tecnicos t ON t.id = k.tecnico_id
      GROUP BY t.id, t.nombre
      ORDER BY realizados DESC
    `);

    res.json({
      ...general.rows[0],
      porTecnico: porTecnico.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular las métricas', detalle: error.message });
  }
};

module.exports = {
  obtenerTickets,
  obtenerMetricas
};