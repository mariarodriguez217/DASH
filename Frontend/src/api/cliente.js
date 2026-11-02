import { obtenerToken, cerrarSesion } from './sesion'

// Por defecto usa la ruta relativa /api: en local la atiende el proxy de Vite
// y en Vercel la atiende el backend (ver vercel.json).
// VITE_API_URL solo hace falta si el back está en otro dominio.
export const API_URL = import.meta.env.VITE_API_URL || '/api'

// Si VITE_USAR_MOCKS=true, el front usa datos de prueba y no llama a la API.
export const USAR_MOCKS = import.meta.env.VITE_USAR_MOCKS === 'true'

/**
 * Hace un GET a la API y devuelve el JSON de la respuesta.
 * Envía el token de la sesión (si hay) en el header Authorization.
 * @param {string} ruta - por ejemplo '/tickets'
 * @param {object} parametros - filtros que viajan en la URL (?estado=pendiente&page=2)
 */
export async function pedirJSON(ruta, parametros = {}) {
  // Armamos los parámetros de la URL, salteando los que están vacíos
  const query = new URLSearchParams()
  for (const [clave, valor] of Object.entries(parametros)) {
    if (valor !== '' && valor !== null && valor !== undefined) {
      query.append(clave, valor)
    }
  }
  const url = query.toString() ? `${API_URL}${ruta}?${query}` : `${API_URL}${ruta}`

  const token = obtenerToken()

  let respuesta
  try {
    respuesta = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  } catch {
    // fetch falla así cuando no hay conexión o la API está apagada
    throw new Error(
      'No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.',
    )
  }

  // Token inválido o vencido: se borra la sesión y se vuelve al login
  if (respuesta.status === 401) {
    cerrarSesion()
    window.location.href = '/login'
    throw new Error('Tu sesión venció. Volvé a iniciar sesión.')
  }

  if (!respuesta.ok) {
    // Intentamos mostrar el mensaje que mandó el back; si no hay, uno genérico
    let mensaje = `El servidor respondió con un error (${respuesta.status}).`
    try {
      const cuerpo = await respuesta.json()
      mensaje = cuerpo.error?.mensaje || cuerpo.error || cuerpo.mensaje || cuerpo.message || mensaje
    } catch {
      // la respuesta no era JSON: nos quedamos con el mensaje genérico
    }
    throw new Error(String(mensaje))
  }

  return respuesta.json()
}