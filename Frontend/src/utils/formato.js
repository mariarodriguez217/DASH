/*
  Funciones para mostrar los datos en lenguaje del usuario
  (heurística 2 de Nielsen: el sistema habla el idioma de quien lo usa).
  La API manda "en_progreso"; la pantalla muestra "En progreso".
*/

export const ESTADOS = {
  pendiente: { etiqueta: 'Pendiente', clase: 'pill-ambar', color: 'var(--estado-pendiente)' },
  en_progreso: { etiqueta: 'En progreso', clase: 'pill-azul', color: 'var(--estado-en-progreso)' },
  realizado: { etiqueta: 'Realizado', clase: 'pill-verde', color: 'var(--estado-realizado)' },
}

export const PRIORIDADES = {
  alta: { etiqueta: 'Alta', clase: 'pill-rojo' },
  media: { etiqueta: 'Media', clase: 'pill-azul' },
  baja: { etiqueta: 'Baja', clase: 'pill-gris' },
}

export const CATEGORIAS = ['Software', 'Redes', 'Hardware', 'Accesos']

// La base (PostgreSQL) a veces devuelve números como texto ("70.0"); Number() lo resuelve
export function formatearNumero(valor, decimales = 0) {
  const numero = Number(valor)
  if (Number.isNaN(numero)) return '—'
  return numero.toLocaleString('es-AR', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  })
}

export function formatearFecha(fechaISO) {
  if (!fechaISO) return '—'
  return new Date(fechaISO).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatearHora(fecha) {
  return fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}
