<!--
  Gráfico de barra apilada: qué parte del total está realizada, en progreso o pendiente.
  Está hecho solo con HTML y CSS (sin librerías), así no suma peso a la página.
-->
<script setup>
import { computed } from 'vue'
import { ESTADOS, formatearNumero } from '../utils/formato'

const props = defineProps({
  realizados: { type: Number, required: true },
  enProgreso: { type: Number, required: true },
  pendientes: { type: Number, required: true },
})

const segmentos = computed(() => {
  const total = props.realizados + props.enProgreso + props.pendientes || 1
  return [
    { clave: 'realizado', cantidad: props.realizados },
    { clave: 'en_progreso', cantidad: props.enProgreso },
    { clave: 'pendiente', cantidad: props.pendientes },
  ].map((s) => ({
    ...s,
    etiqueta: ESTADOS[s.clave].etiqueta,
    color: ESTADOS[s.clave].color,
    porcentaje: (s.cantidad / total) * 100,
  }))
})

// Descripción en texto para lectores de pantalla (accesibilidad)
const descripcion = computed(() =>
  segmentos.value.map((s) => `${s.etiqueta}: ${formatearNumero(s.porcentaje, 1)} %`).join(', '),
)
</script>

<template>
  <section class="tarjeta" aria-labelledby="titulo-estados">
    <h2 id="titulo-estados" class="titulo-seccion">Tickets por estado</h2>
    <p class="texto-suave subtitulo">Proporción de cada estado sobre el total</p>

    <div class="barra" role="img" :aria-label="descripcion">
      <span
        v-for="s in segmentos"
        :key="s.clave"
        class="segmento"
        :style="{ width: s.porcentaje + '%', background: s.color }"
      ></span>
    </div>

    <ul class="leyenda">
      <li v-for="s in segmentos" :key="s.clave">
        <span class="leyenda-punto" :style="{ background: s.color }" aria-hidden="true"></span>
        <span class="leyenda-texto">{{ s.etiqueta }}</span>
        <strong>{{ formatearNumero(s.porcentaje, 1) }} %</strong>
        <span class="texto-suave">({{ formatearNumero(s.cantidad) }})</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.titulo-seccion {
  font-size: 16px;
  font-weight: 800;
}

.subtitulo {
  margin: 2px 0 16px;
  font-size: 13px;
}

.barra {
  display: flex;
  height: 18px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--color-borde);
  gap: 2px;
}

.segmento {
  height: 100%;
}

.leyenda {
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
}

.leyenda li {
  display: flex;
  align-items: center;
  gap: 6px;
}

.leyenda-punto {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.leyenda-texto {
  font-weight: 600;
}
</style>
