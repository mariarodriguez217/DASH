<!--
  Tabla del listado de tickets. Solo muestra lo que recibe:
  no pide datos ni filtra (eso lo hace la pantalla TicketsView).
-->
<script setup>
import { ESTADOS, PRIORIDADES, formatearFecha } from '../utils/formato'

defineProps({
  tickets: { type: Array, required: true },
})
</script>

<template>
  <div class="tabla-contenedor">
    <table>
      <caption class="solo-lectores">
        Listado de tickets
      </caption>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Título</th>
          <th scope="col">Técnico</th>
          <th scope="col">Estado</th>
          <th scope="col">Prioridad</th>
          <th scope="col">Categoría</th>
          <th scope="col">Creado</th>
          <th scope="col">Resuelto</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in tickets" :key="t.id">
          <td class="id">#{{ t.id }}</td>
          <td class="titulo">{{ t.titulo }}</td>
          <td class="sin-corte">{{ t.tecnico ?? '—' }}</td>
          <td>
            <span class="estado">
              <span
                class="estado-punto"
                :style="{ background: ESTADOS[t.estado]?.color }"
                aria-hidden="true"
              ></span>
              {{ ESTADOS[t.estado]?.etiqueta ?? t.estado }}
            </span>
          </td>
          <td>
            <span class="pill" :class="PRIORIDADES[t.prioridad]?.clase ?? 'pill-gris'">
              {{ PRIORIDADES[t.prioridad]?.etiqueta ?? t.prioridad }}
            </span>
          </td>
          <td>{{ t.categoria }}</td>
          <td class="fecha">{{ formatearFecha(t.fecha_creacion) }}</td>
          <td class="fecha">{{ formatearFecha(t.fecha_resolucion) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* En pantallas angostas la tabla se desplaza de costado, sin romper la página */
.tabla-contenedor {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
}

th {
  text-align: left;
  font-size: 12px;
  color: var(--color-texto-suave);
  padding: 12px 10px;
  border-bottom: 1px solid var(--color-borde);
}

td {
  padding: 12px 10px;
  border-bottom: 1px solid #f2f3f8;
  vertical-align: middle;
}

tbody tr:hover {
  background: #fafaff;
}

.id,
.fecha {
  color: var(--color-texto-suave);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.titulo {
  font-weight: 600;
}

.sin-corte {
  white-space: nowrap;
}

.estado {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  white-space: nowrap;
}

.estado-punto {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
</style>
