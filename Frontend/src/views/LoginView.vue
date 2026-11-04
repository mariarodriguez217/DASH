<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { iniciarSesion } from '../api/auth'

const router = useRouter()
const usuario = ref('')
const password = ref('')
const error = ref('')
const cargando = ref(false)

async function enviar() {
  error.value = ''
  cargando.value = true
  try {
    await iniciarSesion(usuario.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <main class="login">
    <form class="login__form" @submit.prevent="enviar">
      <h1>Ingresar</h1>

      <label>
        Usuario
        <input v-model="usuario" type="text" required autocomplete="username" />
      </label>

      <label>
        Contraseña
        <input v-model="password" type="password" required autocomplete="current-password" />
      </label>

      <p v-if="error" class="login__error" role="alert">{{ error }}</p>

      <button type="submit" :disabled="cargando">
        {{ cargando ? 'Ingresando…' : 'Ingresar' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
}

.login__form {
  width: 100%;
  max-width: 22rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border: 1px solid #d0d5dd;
  border-radius: 12px;
}

.login__form label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
}

.login__form input {
  padding: 0.6rem 0.75rem;
  border: 1px solid #98a2b3;
  border-radius: 8px;
  font-size: 1rem;
}

.login__form button {
  padding: 0.7rem;
  border: 0;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.login__form button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.login__error {
  margin: 0;
  color: #b42318;
  font-size: 0.9rem;
}
</style>