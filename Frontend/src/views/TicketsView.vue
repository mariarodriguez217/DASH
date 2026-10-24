<!--
  Pantalla de tickets: filtros, tabla paginada y exportación a CSV.
  Datos: GET /api/tickets (la paginación y los filtros los resuelve el back,
  así el navegador nunca carga los 10.000 tickets de una vez).
-->
<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listarTickets, obtenerMetricas, exportarTicketsCSV } from '../api/tickets'
import { ESTADOS, PRIORIDADES, CATEGORIAS, formatearNumero } from '../utils/formato'
import TablaTickets from '../components/TablaTickets.vue'
import PaginacionTickets from '../components/PaginacionTickets.vue'

const route = useRoute()
const router = useRouter()

const CAMPOS_FILTRO = ['tecnico_id', 'estado', 'prioridad', 'categoria', 'desde', 'hasta']
const OPCIONES_POR_PAGINA = [20, 50, 100]

// Los filtros se leen de la URL: así un listado filtrado se puede compartir
// o volver a abrir (heurística 6: reconocer en lugar de recordar)
function leerFiltrosDeUrl() {
  const filtros = {}
  for (const campo of CAMPOS_FILTRO) filtros[campo] = route.query[campo] ?? ''
  return filtros
}

const filtros = reactive(leerFiltrosDeUrl())
const pagina = ref(Number(route.query.page) || 1)
const porPagina = ref(
  OPCIONES_POR_PAGINA.includes(Number(route.query.limit)) ? Number(route.query.limit) : 20,
)

const resultado = ref({ data: [], total: 0, totalPages: 0 })
const cargando = ref(false)
const error = ref('')
const tecnicos = ref([])

const hayFiltros = computed(() => CAMPOS_FILTRO.some((campo) => filtros[campo] !== ''))

// Prevención de errores (heurística 5): no se busca con un rango de fechas imposible
const errorFechas = computed(() =>
  filtros.desde && filtros.hasta && filtros.desde > filtros.hasta
    ? 'La fecha "hasta" no puede ser anterior a "desde".'
    : '',
)

// Cada búsqueda lleva un número; si llega tarde la respuesta de una búsqueda
// vieja (por ejemplo, al cambiar filtros rápido), se descarta.
let numeroDeConsulta = 0

async function cargarTickets() {
  if (errorFechas.value) return
  const consulta = ++numeroDeConsulta
  cargando.value = true
  error.value = ''
  try {
    const respuesta = await listarTickets({
      ...filtros,
      page: pagina.value,
      limit: porPagina.value,
    })
    if (consulta === numeroDeConsulta) resultado.value = respuesta
  } catch (e) {
    if (consulta === numeroDeConsulta) error.value = e.message
  } finally {
    if (consulta === numeroDeConsulta) cargando.value = false
  }
}

// La lista de técnicos para el filtro sale del ranking de métricas
async function cargarTecnicos() {
  try {
    const metricas = await obtenerMetricas()
    tecnicos.value = (metricas.porTecnico ?? []).map((t) => ({
      id: String(t.id),
      nombre: t.nombre,
    }))
  } catch {
    // Si falla, el filtro queda solo con "Todos" y la pantalla sigue funcionando
  }
}

function actualizarUrl() {
  const query = {}
  for (const campo of CAMPOS_FILTRO) if (filtros[campo] !== '') query[campo] = filtros[campo]
  if (pagina.value > 1) query.page = pagina.value
  if (porPagina.value !== 20) query.limit = porPagina.value
  router.replace({ query })
}

function limpiarFiltros() {
  for (const campo of CAMPOS_FILTRO) filtros[campo] = ''
}

// Si cambia algún filtro, volvemos a la primera página
watch(filtros, () => {
  pagina.value = 1
})

// Ante cualquier cambio de filtros, página o cantidad: actualizar URL y volver a pedir
watch([() => ({ ...filtros }), pagina, porPagina], () => {
  actualizarUrl()
  cargarTickets()
})

// Si la URL cambia desde afuera (por ejemplo, al tocar "Tickets" en el menú
// o un técnico en el dashboard), copiamos esos valores a los filtros
watch(
  () => route.query,
  (query) => {
    for (const campo of CAMPOS_FILTRO) {
      const valor = query[campo] ?? ''
      if (filtros[campo] !== valor) filtros[campo] = valor
    }
  },
)

onMounted(() => {
  cargarTickets()
  cargarTecnicos()
})

// ---------- Exportación ----------
const exportando = ref(false)
const progreso = ref('')
const mensajeExportacion = ref('')

async function exportar() {
  const total = resultado.value.total
  if (
    total > 5000 &&
    !window.confirm(
      `Vas a descargar ${formatearNumero(total)} tickets. Puede tardar unos segundos. ¿Continuar?`,
    )
  ) {
    return
  }

  exportando.value = true
  mensajeExportacion.value = ''
  try {
    const { archivo, cantidad } = await exportarTicketsCSV(
      { ...filtros },
      (actual, totalPaginas) => {
        progreso.value = `${actual} de ${totalPaginas}`
      },
    )
    // Creamos un enlace temporal al archivo y lo "clickeamos" para descargarlo
    const url = URL.createObjectURL(archivo)
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = `tickets-${new Date().toISOString().slice(0, 10)}.csv`
    enlace.click()
    URL.revokeObjectURL(url)
    mensajeExportacion.value = `Listo: se descargó un archivo con ${formatearNumero(cantidad)} tickets.`
  } catch (e) {
    mensajeExportacion.value = `No se pudo generar el archivo. ${e.message}`
  } finally {
    exportando.value = false
    progreso.value = ''
  }
}
</script>

<template>
  <div>
    <header class="encabezado-pagina">
      <div>
        <h1>Tickets</h1>
        <p class="texto-suave resumen" aria-live="polite">
          <template v-if="cargando">Buscando tickets…</template>
          <template v-else-if="!error">
            {{ formatearNumero(resultado.total) }} tickets encontrados
            {{ hayFiltros ? 'con los filtros aplicados' : 'en total' }}
          </template>
        </p>
      </div>
      <div class="acciones">
        <button
          type="button"
          class="boton boton-principal"
          :disabled="exportando || cargando || !!error || resultado.total === 0"
          @click="exportar"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 4v11" />
            <path d="M7 10l5 5 5-5" />
            <path d="M5 20h14" />
          </svg>
          <template v-if="exportando">Exportando… {{ progreso }}</template>
          <template v-else>Exportar CSV</template>
        </button>
        <p v-if="mensajeExportacion" class="mensaje-exportacion" role="status">
          {{ mensajeExportacion }}
        </p>
      </div>
    </header>

    <section class="tarjeta filtros" aria-label="Filtros">
      <div class="campo">
        <label for="f-tecnico">Técnico</label>
        <select id="f-tecnico" v-model="filtros.tecnico_id">
          <option value="">Todos</option>
          <option v-for="t in tecnicos" :key="t.id" :value="t.id">{{ t.nombre }}</option>
        </select>
      </div>
      <div class="campo">
        <label for="f-estado">Estado</label>
        <select id="f-estado" v-model="filtros.estado">
          <option value="">Todos</option>
          <option v-for="(datos, clave) in ESTADOS" :key="clave" :value="clave">
            {{ datos.etiqueta }}
          </option>
        </select>
      </div>
      <div class="campo">
        <label for="f-prioridad">Prioridad</label>
        <select id="f-prioridad" v-model="filtros.prioridad">
          <option value="">Todas</option>
          <option v-for="(datos, clave) in PRIORIDADES" :key="clave" :value="clave">
            {{ datos.etiqueta }}
          </option>
        </select>
      </div>
      <div class="campo">
        <label for="f-categoria">Categoría</label>
        <select id="f-categoria" v-model="filtros.categoria">
          <option value="">Todas</option>
          <option v-for="c in CATEGORIAS" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="campo">
        <label for="f-desde">Creado desde</label>
        <input id="f-desde" v-model="filtros.desde" type="date" :max="filtros.hasta || undefined" />
      </div>
      <div class="campo">
        <label for="f-hasta">Creado hasta</label>
        <input id="f-hasta" v-model="filtros.hasta" type="date" :min="filtros.desde || undefined" />
      </div>
      <button v-if="hayFiltros" type="button" class="boton boton-texto" @click="limpiarFiltros">
        Limpiar filtros
      </button>
      <p v-if="errorFechas" class="error-fechas" role="alert">{{ errorFechas }}</p>
    </section>

    <section class="tarjeta resultados" aria-label="Resultados">
      <div v-if="error" class="aviso aviso-error" role="alert">
        <span>{{ error }}</span>
        <button type="button" class="boton" @click="cargarTickets">Reintentar</button>
      </div>

      <p v-else-if="cargando && !resultado.data.length" class="aviso">Cargando tickets…</p>

      <div v-else-if="!resultado.data.length" class="aviso vacio">
        <span>No hay tickets que coincidan con los filtros elegidos.</span>
        <button v-if="hayFiltros" type="button" class="boton boton-texto" @click="limpiarFiltros">
          Limpiar filtros
        </button>
      </div>

      <template v-else>
        <!-- Mientras llega la página nueva, la anterior queda visible pero atenuada -->
        <div :class="{ actualizando: cargando }" :aria-busy="cargando">
          <TablaTickets :tickets="resultado.data" />
        </div>
        <PaginacionTickets
          :pagina="pagina"
          :total-paginas="Number(resultado.totalPages) || 0"
          :total="Number(resultado.total) || 0"
          :por-pagina="porPagina"
          @cambiar-pagina="pagina = $event"
          @cambiar-por-pagina="porPagina = $event"
        />
      </template>
    </section>
  </div>
</template>

<style scoped>
.resumen {
  margin: 4px 0 0;
  min-height: 20px;
}

.acciones {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.mensaje-exportacion {
  margin: 0;
  font-size: 13px;
  color: var(--color-texto-suave);
}

.filtros {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 14px;
  margin-bottom: 16px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 150px;
}

.campo label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-texto-suave);
}

.campo select,
.campo input {
  min-height: 42px;
  padding: 0 10px;
  border: 1px solid var(--color-borde-fuerte);
  border-radius: var(--radio-chico);
  background: #ffffff;
  color: var(--color-texto);
  font: inherit;
}

.error-fechas {
  flex-basis: 100%;
  margin: 0;
  color: var(--pill-rojo-texto);
  font-weight: 600;
}

.resultados {
  padding: 8px 16px 16px;
}

.resultados > .aviso {
  margin-top: 8px;
}

.vacio {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.actualizando {
  opacity: 0.5;
  transition: opacity 0.15s;
}
</style>
