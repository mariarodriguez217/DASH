<!--
  Controles de paginación. Avisa a la pantalla con eventos ("emit")
  cuando el usuario cambia de página o de cantidad por página.
-->
<script setup>
import { formatearNumero } from '../utils/formato'

const props = defineProps({
  pagina: { type: Number, required: true },
  totalPaginas: { type: Number, required: true },
  total: { type: Number, required: true },
  porPagina: { type: Number, required: true },
})

const emit = defineEmits(['cambiarPagina', 'cambiarPorPagina'])

function desde() {
  return props.total === 0 ? 0 : (props.pagina - 1) * props.porPagina + 1
}

function hasta() {
  return Math.min(props.pagina * props.porPagina, props.total)
}
</script>

<template>
  <nav class="paginacion" aria-label="Paginación">
    <div class="resumen">
      <span>
        Mostrando <strong>{{ formatearNumero(desde()) }}–{{ formatearNumero(hasta()) }}</strong> de
        <strong>{{ formatearNumero(total) }}</strong>
      </span>
      <label for="por-pagina">Por página</label>
      <select
        id="por-pagina"
        :value="porPagina"
        @change="emit('cambiarPorPagina', Number($event.target.value))"
      >
        <option :value="20">20</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
    </div>

    <div class="botones">
      <button
        type="button"
        class="boton"
        :disabled="pagina <= 1"
        @click="emit('cambiarPagina', pagina - 1)"
      >
        Anterior
      </button>
      <span class="pagina-actual" aria-current="page">
        Página {{ formatearNumero(pagina) }} de {{ formatearNumero(Math.max(totalPaginas, 1)) }}
      </span>
      <button
        type="button"
        class="boton"
        :disabled="pagina >= totalPaginas"
        @click="emit('cambiarPagina', pagina + 1)"
      >
        Siguiente
      </button>
    </div>
  </nav>
</template>

<style scoped>
.paginacion {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 4px 0;
}

.resumen {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  color: var(--color-texto-suave);
}

.resumen strong {
  color: var(--color-texto);
}

select {
  min-height: 36px;
  padding: 0 8px;
  border: 1px solid var(--color-borde-fuerte);
  border-radius: 8px;
  background: #ffffff;
  font: inherit;
}

.botones {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagina-actual {
  font-weight: 600;
  white-space: nowrap;
}
</style>
