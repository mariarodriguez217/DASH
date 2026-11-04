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

// GET /api/tickets → listado paginado con filtros limpios
export function listarTickets(filtros) {
  if (USAR_MOCKS) {
    return listarTicketsMock(filtros)
  }

  // LIMPIEZA DE FILTROS: Evita enviar propiedades con strings vacíos, null o undefined
  const filtrosLimpios = {}
  if (filtros) {
    for (const [clave, valor] of Object.entries(filtros)) {
      if (valor !== '' && valor !== null && valor !== undefined) {
        filtrosLimpios[clave] = valor
      }
    }
  }

  return pedirJSON('/tickets', filtrosLimpios)
}

/*
  Exportación a CSV.
*/
export async function exportarTicketsCSV(filtros, alAvanzar = () => {}) {
  const filas = []
  let pagina = 1
  let totalPaginas

  do {
    const respuesta = await listarTickets({ ...filtros, page: pagina, limit: 100 })
    filas.push(...(respuesta.data || []))
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

  const aCelda = (valor) => `"${String(valor ?? '').replaceAll('"', '""')}"`
  const contenido = [columnas, ...lineas].map((fila) => fila.map(aCelda).join(';')).join('\r\n')

  const BOM = String.fromCharCode(0xfeff)
  return {
    archivo: new Blob([BOM + contenido], { type: 'text/csv;charset=utf-8' }),
    cantidad: filas.length,
  }
}