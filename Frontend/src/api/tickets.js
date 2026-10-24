/*
  Una función por cada endpoint de la API de tickets.
  Los componentes llaman a estas funciones y no saben si los datos
  vienen de la API real o de los datos de prueba (mocks).
*/
import { pedirJSON, USAR_MOCKS } from './cliente'
import { metricasMock, listarTicketsMock } from './mocks'
import { ESTADOS, PRIORIDADES, formatearFecha } from '../utils/formato'

// GET /api/tickets/metricas → KPIs generales y ranking por técnico
export function obtenerMetricas() {
  return USAR_MOCKS ? metricasMock() : pedirJSON('/tickets/metricas')
}

// GET /api/tickets → listado paginado con filtros
// filtros: { page, limit, tecnico_id, estado, prioridad, categoria, desde, hasta }
export function listarTickets(filtros) {
  return USAR_MOCKS ? listarTicketsMock(filtros) : pedirJSON('/tickets', filtros)
}

/*
  Exportación a CSV.
  La API todavía no tiene un endpoint de exportación, así que el front
  pide todas las páginas del listado (de a 100, el máximo que acepta la API)
  con los filtros aplicados y arma el archivo en el navegador.
  Mejora futura: que el back genere el archivo (más eficiente con muchos datos).
*/
export async function exportarTicketsCSV(filtros, alAvanzar = () => {}) {
  const filas = []
  let pagina = 1
  let totalPaginas

  do {
    const respuesta = await listarTickets({ ...filtros, page: pagina, limit: 100 })
    filas.push(...respuesta.data)
    totalPaginas = respuesta.totalPages || 1
    alAvanzar(pagina, totalPaginas)
    pagina++
  } while (pagina <= totalPaginas)

  const columnas = [
    'ID',
    'Título',
    'Técnico',
    'Estado',
    'Prioridad',
    'Categoría',
    'Creado',
    'Resuelto',
  ]
  const lineas = filas.map((t) => [
    t.id,
    t.titulo,
    t.tecnico,
    ESTADOS[t.estado]?.etiqueta ?? t.estado,
    PRIORIDADES[t.prioridad]?.etiqueta ?? t.prioridad,
    t.categoria,
    formatearFecha(t.fecha_creacion),
    formatearFecha(t.fecha_resolucion),
  ])

  // Cada valor va entre comillas (y se duplican las comillas internas) para que
  // una coma o un punto y coma dentro de un título no rompa las columnas.
  const aCelda = (valor) => `"${String(valor ?? '').replaceAll('"', '""')}"`
  // Punto y coma como separador: es lo que espera Excel configurado en español
  const contenido = [columnas, ...lineas].map((fila) => fila.map(aCelda).join(';')).join('\r\n')

  // Un carácter invisible al inicio (BOM) hace que Excel reconozca los acentos
  const BOM = String.fromCharCode(0xfeff)
  return {
    archivo: new Blob([BOM + contenido], { type: 'text/csv;charset=utf-8' }),
    cantidad: filas.length,
  }
}
