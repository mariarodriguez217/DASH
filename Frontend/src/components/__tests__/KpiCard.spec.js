// Test de componente con Vitest: se ejecuta con "npm run test:unit"
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KpiCard from '../KpiCard.vue'

describe('KpiCard', () => {
  it('muestra el título, el valor y el detalle', () => {
    const tarjeta = mount(KpiCard, {
      props: { titulo: 'Realizados', valor: '7.000', detalle: '70 % del total' },
    })
    expect(tarjeta.text()).toContain('Realizados')
    expect(tarjeta.text()).toContain('7.000')
    expect(tarjeta.text()).toContain('70 % del total')
  })

  it('no muestra el detalle si no se lo pasa', () => {
    const tarjeta = mount(KpiCard, { props: { titulo: 'Total', valor: '10.000' } })
    expect(tarjeta.find('.kpi-detalle').exists()).toBe(false)
  })
})
