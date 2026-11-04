import { API_URL } from './cliente'
import { guardarSesion } from './sesion'

// POST /api/auth/login → guarda el token y devuelve los datos del usuario
export async function iniciarSesion(usuario, password) {
  let respuesta
  try {
    respuesta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password }),
    })
  } catch {
    throw new Error('No pudimos conectarnos con el servidor. Intentá de nuevo.')
  }

  const cuerpo = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    throw new Error(cuerpo.error || 'No se pudo iniciar sesión')
  }

  guardarSesion(cuerpo)
  return cuerpo.usuario
}