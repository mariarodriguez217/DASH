<!--
  Ranking de técnicos: tickets asignados, resueltos, % de resolución y días promedio.
  Cada nombre lleva al listado de tickets ya filtrado por ese técnico.
-->
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { formatearNumero } from '../utils/formato'

const props = defineProps({
  tecnicos: { type: Array, required: true },
})

// Ordenamos de mayor a menor porcentaje de resolución
const ordenados = computed(() =>
  [...props.tecnicos].sort((a, b) => Number(b.porcentaje) - Number(a.porcentaje)),
)
</script>

<template>
  <section class="tarjeta" aria-labelledby="titulo-ranking">
    <h2 id="titulo-ranking" class="titulo-seccion">Desempeño por técnico</h2>
    <p class="texto-suave subtitulo">Ordenado por porcentaje de tickets resueltos</p>

    <p v-if="!ordenados.length" class="aviso">Todavía no hay técnicos con tickets asignados.</p>

    <div v-else class="tabla-contenedor">
      <table>
        <thead>
          <tr>
            <th scope="col">Técnico</th>
            <th scope="col" class="numero">Tickets</th>
            <th scope="col" class="numero">Resueltos</th>
            <th scope="col" class="columna-barra">% de resolución</th>
            <th scope="col" class="numero">Días promedio</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in ordenados" :key="t.id">
            <td>
              <RouterLink :to="{ path: '/tickets', query: { tecnico_id: t.id } }" class="nombre">
                {{ t.nombre }}
              </RouterLink>
            </td>
            <td class="numero">{{ formatearNumero(t.total) }}</td>
            <td class="numero">{{ formatearNumero(t.realizados) }}</td>
            <td class="columna-barra">
              <div class="barra-celda">
                <div class="barra-fondo" aria-hidden="true">
                  <div class="barra-relleno" :style="{ width: Number(t.porcentaje) + '%' }"></div>
                </div>
                <span class="porcentaje">{{ formatearNumero(t.porcentaje, 1) }} %</span>
              </div>
            </td>
            <td class="numero">{{ formatearNumero(t.dias_promedio, 1) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.titulo-seccion {
  font-size: 16px;
  font-weight: 800;
}

.subtitulo {
  margin: 2px 0 14px;
  font-size: 13px;
}

.tabla-contenedor {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
}

th {
  text-align: left;
  font-size: 12px;
  color: var(--color-texto-suave);
  padding: 8px 10px;
  border-bottom: 1px solid var(--color-borde);
}

td {
  padding: 12px 10px;
  border-bottom: 1px solid #f2f3f8;
}

.numero {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.nombre {
  font-weight: 700;
}

.columna-barra {
  width: 34%;
}

.barra-celda {
  display: flex;
  align-items: center;
  gap: 10px;
}

.barra-fondo {
  flex: 1;
  height: 10px;
  border-radius: 6px;
  background: var(--color-principal-claro);
}

.barra-relleno {
  height: 100%;
  border-radius: 6px;
  background: var(--color-principal);
}

.porcentaje {
  min-width: 56px;
  text-align: right;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
</style>
