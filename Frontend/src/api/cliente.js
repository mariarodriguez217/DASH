/*
  Cliente HTTP: el ÚNICO lugar del front que habla con la API.
  Ningún componente usa fetch directamente; todos pasan por acá.
  Así, si cambia la dirección de la API o la forma de manejar errores,
  se modifica un solo archivo.
*/

// La dirección de la API viene de una variable de entorno (archivo .env),
// para poder usar una en local y otra en producción sin tocar el código.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Si VITE_USAR_MOCKS=true, el front usa datos de prueba y no llama a la API.
export const USAR_MOCKS = import.meta.env.VITE_USAR_MOCKS === 'true'

/**
 * Hace un GET a la API y devuelve el JSON de la respuesta.
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

  let respuesta
  try {
    respuesta = await fetch(url)
  } catch {
    // fetch falla así cuando no hay conexión o la API está apagada
    throw new Error(
      'No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.',
    )
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
