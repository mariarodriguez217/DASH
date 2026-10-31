/*
  Rutas de la aplicación (SPA con renderizado del lado del cliente, CSR).
  El router cambia de pantalla sin recargar la página.
*/
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { titulo: 'Dashboard' },
    },
    {
      path: '/tickets',
      name: 'tickets',
      // Lazy loading + code splitting: el código de esta pantalla se descarga
      // recién cuando el usuario entra a ella, así la carga inicial es más liviana.
      component: () => import('../views/TicketsView.vue'),
      meta: { titulo: 'Tickets' },
    },
    // Cualquier dirección desconocida vuelve al dashboard
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// Actualiza el título de la pestaña del navegador en cada cambio de pantalla
router.afterEach((destino) => {
  document.title = `${destino.meta.titulo ?? 'Inicio'} · Ticketera`
})

export default router
