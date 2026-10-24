/*
  Datos de prueba con EXACTAMENTE la misma forma que la API real (ver README).
  Sirven para trabajar el front sin depender de que el back esté corriendo.
  Se activan con VITE_USAR_MOCKS=true en el archivo .env.
*/

const TECNICOS = [
  { id: 1, nombre: 'Ana López' },
  { id: 2, nombre: 'Bruno Díaz' },
  { id: 3, nombre: 'Carla Méndez' },
  { id: 4, nombre: 'Diego Ruiz' },
  { id: 5, nombre: 'Elena Sosa' },
]

const TITULOS = {
  Software: [
    'Error al abrir el sistema de facturación',
    'No guarda los cambios',
    'Actualizar versión del antivirus',
  ],
  Redes: ['Sin conexión a internet', 'Wifi lento en el segundo piso', 'No accede a la VPN'],
  Hardware: ['La impresora no imprime', 'El monitor no enciende', 'Cambio de teclado'],
  Accesos: ['Alta de usuario nuevo', 'Restablecer contraseña', 'Permisos en carpeta compartida'],
}

// Generador de números al azar con semilla fija: siempre produce los mismos datos
function crearAzar(semilla) {
  return function () {
    semilla = (semilla + 0x6d2b79f5) | 0
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function elegir(azar, lista) {
  return lista[Math.floor(azar() * lista.length)]
}

const DIA = 24 * 60 * 60 * 1000

function generarTickets(cantidad) {
  const azar = crearAzar(42)
  const ahora = Date.now()
  const tickets = []
  for (let id = 1; id <= cantidad; id++) {
    const categoria = elegir(azar, Object.keys(TITULOS))
    const tecnico = elegir(azar, TECNICOS)
    const creado = ahora - azar() * 180 * DIA
    const sorteo = azar()
    const estado = sorteo < 0.7 ? 'realizado' : sorteo < 0.85 ? 'en_progreso' : 'pendiente'
    const resuelto =
      estado === 'realizado' ? Math.min(creado + (0.2 + azar() * 7) * DIA, ahora) : null
    tickets.push({
      id,
      titulo: elegir(azar, TITULOS[categoria]),
      descripcion: `Ticket de prueba #${id} reportado por un usuario.`,
      estado,
      prioridad: elegir(azar, ['baja', 'media', 'media', 'alta']),
      categoria,
      fecha_creacion: new Date(creado).toISOString(),
      fecha_resolucion: resuelto ? new Date(resuelto).toISOString() : null,
      tecnico_id: tecnico.id,
      tecnico: tecnico.nombre,
    })
  }
  return tickets.sort((a, b) => b.fecha_creacion.localeCompare(a.fecha_creacion))
}

const TICKETS = generarTickets(10000)

// Simula la demora de la red, para ver los estados de carga
function demorar(datos) {
  return new Promise((resolver) => setTimeout(() => resolver(datos), 400))
}

function redondear(valor) {
  return Math.round(valor * 10) / 10
}

// Equivale a GET /api/tickets/metricas
export function metricasMock() {
  const ahora = Date.now()
  const contar = (lista, estado) => lista.filter((t) => t.estado === estado).length
  const diasPromedio = (lista) => {
    const resueltos = lista.filter((t) => t.fecha_resolucion)
    if (!resueltos.length) return 0
    const suma = resueltos.reduce(
      (total, t) => total + (new Date(t.fecha_resolucion) - new Date(t.fecha_creacion)) / DIA,
      0,
    )
    return redondear(suma / resueltos.length)
  }
  const total = TICKETS.length
  const realizados = contar(TICKETS, 'realizado')
  const pendientes = contar(TICKETS, 'pendiente')

  return demorar({
    total,
    realizados,
    en_progreso: contar(TICKETS, 'en_progreso'),
    pendientes,
    porcentaje_realizados: redondear((realizados / total) * 100),
    porcentaje_pendientes: redondear((pendientes / total) * 100),
    dias_promedio_resolucion: diasPromedio(TICKETS),
    atrasados: TICKETS.filter(
      (t) => !t.fecha_resolucion && ahora - new Date(t.fecha_creacion) > 30 * DIA,
    ).length,
    porTecnico: TECNICOS.map((tecnico) => {
      const suyos = TICKETS.filter((t) => t.tecnico_id === tecnico.id)
      const hechos = contar(suyos, 'realizado')
      return {
        id: tecnico.id,
        nombre: tecnico.nombre,
        total: suyos.length,
        realizados: hechos,
        porcentaje: redondear((hechos / suyos.length) * 100),
        dias_promedio: diasPromedio(suyos),
      }
    }),
  })
}

// Equivale a GET /api/tickets con sus filtros y paginación
export function listarTicketsMock(filtros = {}) {
  const page = Number(filtros.page) || 1
  const limit = Math.min(Number(filtros.limit) || 20, 100)
  const filtrados = TICKETS.filter(
    (t) =>
      (!filtros.tecnico_id || t.tecnico_id === Number(filtros.tecnico_id)) &&
      (!filtros.estado || t.estado === filtros.estado) &&
      (!filtros.prioridad || t.prioridad === filtros.prioridad) &&
      (!filtros.categoria || t.categoria === filtros.categoria) &&
      (!filtros.desde || t.fecha_creacion.slice(0, 10) >= filtros.desde) &&
      (!filtros.hasta || t.fecha_creacion.slice(0, 10) <= filtros.hasta),
  )
  return demorar({
    data: filtrados.slice((page - 1) * limit, page * limit),
    total: filtrados.length,
    page,
    limit,
    totalPages: Math.ceil(filtrados.length / limit),
  })
}
