<!--
  Estructura general: menú lateral fijo + contenido de la pantalla actual.
  <RouterView /> es el lugar donde el router dibuja la pantalla que corresponde.
-->
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="layout">
    <nav class="menu" aria-label="Navegación principal">
      <div class="marca">
        <span class="marca-icono" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 12h4l3-8 4 16 3-8h4" />
          </svg>
        </span>
        <span class="marca-nombre">Ticketera</span>
      </div>

      <div class="menu-links">
        <RouterLink to="/" class="menu-link">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
          </svg>
          Dashboard
        </RouterLink>
        <RouterLink to="/tickets" class="menu-link">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
            />
            <path d="M10 5v12" />
          </svg>
          Tickets
        </RouterLink>
      </div>
    </nav>

    <main class="contenido">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-wrap: wrap;
  min-height: 100vh;
}

.menu {
  flex: 1 1 220px;
  max-width: 100%;
  background: var(--color-fondo-suave);
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.marca {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
}

.marca-icono {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-principal);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marca-nombre {
  font-weight: 800;
  font-size: 18px;
}

.menu-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: var(--radio-chico);
  color: var(--pill-gris-texto);
  text-decoration: none;
  font-weight: 600;
}

.menu-link:hover {
  background: rgba(255, 255, 255, 0.7);
}

/* El router agrega esta clase al enlace de la pantalla actual */
.menu-link.router-link-active {
  background: #ffffff;
  color: var(--color-texto);
  font-weight: 700;
  box-shadow: var(--sombra);
}

.menu-link.router-link-active svg {
  color: var(--color-principal);
}

/* "flex: 999" hace que el contenido ocupe todo el ancho disponible;
   en pantallas angostas el menú pasa arriba */
.contenido {
  flex: 999 1 560px;
  min-width: 0;
  padding: 28px 32px 40px;
}

@media (max-width: 640px) {
  .contenido {
    padding: 20px 16px 32px;
  }
}
</style>
