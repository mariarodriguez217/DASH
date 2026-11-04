/*
  Sesión del administrador: guarda el token y los datos del usuario en el navegador.
  Es el único archivo que toca localStorage.
*/
const CLAVE = 'sesion_dashboard'

export function guardarSesion({ token, usuario }) {
  localStorage.setItem(CLAVE, JSON.stringify({ token, usuario }))
}

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE))
  } catch {
    return null
  }
}

export function obtenerToken() {
  return obtenerSesion()?.token ?? null
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE)
}