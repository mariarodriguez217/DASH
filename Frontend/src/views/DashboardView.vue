<!--
  Pantalla principal: indicadores generales, tickets por estado y ranking de técnicos.
  Datos: GET /api/tickets/metricas (los cálculos los hace el back; el front solo muestra).
-->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { obtenerMetricas } from '../api/tickets'
import { formatearNumero, formatearHora } from '../utils/formato'
import KpiCard from '../components/KpiCard.vue'
import BarraEstados from '../components/BarraEstados.vue'
import RankingTecnicos from '../components/RankingTecnicos.vue'

const metricas = ref(null)
const cargando = ref(true)
const error = ref('')
const actualizadoEn = ref(null)

async function cargar() {
  cargando.value = true
  error.value = ''
  try {
    metricas.value = await obtenerMetricas()
    actualizadoEn.value = new Date()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

onMounted(cargar)

// Convertimos la respuesta de la API en la lista de tarjetas a mostrar
const tarjetas = computed(() => {
  const m = metricas.value
  if (!m) return []
  const total = Number(m.total) || 0
  const porcentajeEnProgreso = total ? (Number(m.en_progreso) / total) * 100 : 0
  return [
    {
      titulo: 'Total de tickets',
      valor: formatearNumero(m.total),
      detalle: 'Todos los tickets registrados',
      color: 'var(--color-principal)',
    },
    {
      titulo: 'Realizados',
      valor: formatearNumero(m.realizados),
      detalle: `${formatearNumero(m.porcentaje_realizados, 1)} % del total`,
      color: 'var(--estado-realizado)',
    },
    {
      titulo: 'En progreso',
      valor: formatearNumero(m.en_progreso),
      detalle: `${formatearNumero(porcentajeEnProgreso, 1)} % del total`,
      color: 'var(--estado-en-progreso)',
    },
    {
      titulo: 'Pendientes',
      valor: formatearNumero(m.pendientes),
      detalle: `${formatearNumero(m.porcentaje_pendientes, 1)} % del total`,
      color: 'var(--estado-pendiente)',
    },
    {
      titulo: 'Tiempo promedio de resolución',
      valor: `${formatearNumero(m.dias_promedio_resolucion, 1)} días`,
      detalle: 'Desde que se crea hasta que se resuelve',
      color: 'var(--color-principal)',
    },
    {
      titulo: 'Atrasados',
      valor: formatearNumero(m.atrasados),
      detalle: 'Sin resolver hace más de 30 días',
      color: 'var(--alerta)',
    },
  ]
})
</script>

<template>
  <div>
    <header class="encabezado-pagina">
      <div>
        <h1>Resumen general</h1>
        <p class="texto-suave estado-actualizacion" aria-live="polite">
          <template v-if="cargando">Cargando datos…</template>
          <template v-else-if="actualizadoEn"
            >Actualizado a las {{ formatearHora(actualizadoEn) }}</template
          >
        </p>
      </div>
      <button type="button" class="boton" :disabled="cargando" @click="cargar">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20 11a8 8 0 1 0-2.3 5.7" />
          <path d="M20 4v7h-7" />
        </svg>
        Actualizar
      </button>
    </header>

    <!-- Error: mensaje claro y una forma de reintentar (heurística 9) -->
    <div v-if="error" class="aviso aviso-error" role="alert">
      <span>{{ error }}</span>
      <button type="button" class="boton" @click="cargar">Reintentar</button>
    </div>

    <!-- Carga inicial: tarjetas vacías del mismo tamaño, para que la página no "salte" -->
    <div v-else-if="cargando && !metricas" class="grilla-kpis" aria-hidden="true">
      <div v-for="n in 6" :key="n" class="tarjeta esqueleto"></div>
    </div>

    <template v-else-if="metricas">
      <section class="grilla-kpis" aria-label="Indicadores generales">
        <KpiCard
          v-for="t in tarjetas"
          :key="t.titulo"
          :titulo="t.titulo"
          :valor="t.valor"
          :detalle="t.detalle"
          :color="t.color"
        />
      </section>

      <div class="secciones">
        <BarraEstados
          :realizados="Number(metricas.realizados)"
          :en-progreso="Number(metricas.en_progreso)"
          :pendientes="Number(metricas.pendientes)"
        />
        <RankingTecnicos :tecnicos="metricas.porTecnico ?? []" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.estado-actualizacion {
  margin: 4px 0 0;
  min-height: 20px;
}

/* 1 columna en celular, 2 en tablet y 3 en computadora (6 tarjetas = 2 filas parejas) */
.grilla-kpis {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

@media (min-width: 600px) {
  .grilla-kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1100px) {
  .grilla-kpis {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.secciones {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.esqueleto {
  height: 128px;
  background: linear-gradient(90deg, #f6f7fb 0%, #eef0f6 50%, #f6f7fb 100%);
  background-size: 200% 100%;
  animation: brillo 1.4s ease-in-out infinite;
}

@keyframes brillo {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}

/* Respeta a quien pidió reducir animaciones en su sistema (accesibilidad) */
@media (prefers-reduced-motion: reduce) {
  .esqueleto {
    animation: none;
  }
}
</style>
