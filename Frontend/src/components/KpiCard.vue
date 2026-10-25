<!--
  Tarjeta de indicador (KPI): un título, un número grande y un detalle.
  Es un componente reutilizable: el dashboard la usa seis veces con datos distintos.
-->
<script setup>
defineProps({
  titulo: { type: String, required: true },
  valor: { type: String, required: true },
  detalle: { type: String, default: '' },
  // color del punto: una variable CSS, por ejemplo 'var(--estado-realizado)'
  color: { type: String, default: 'var(--color-principal)' },
})
</script>

<template>
  <article class="tarjeta kpi">
    <div class="kpi-encabezado">
      <h2 class="kpi-titulo">{{ titulo }}</h2>
      <span class="kpi-punto" :style="{ background: color }" aria-hidden="true"></span>
    </div>
    <p class="kpi-valor">{{ valor }}</p>
    <p v-if="detalle" class="kpi-detalle">{{ detalle }}</p>
  </article>
</template>

<style scoped>
.kpi {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kpi-encabezado {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.kpi-titulo {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-texto-suave);
}

.kpi-punto {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex: none;
}

.kpi-valor {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.kpi-detalle {
  margin: 0;
  font-size: 12px;
  color: var(--color-texto-suave);
}
</style>
