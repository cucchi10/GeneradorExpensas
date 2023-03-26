import { reactive, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster();

export default function useExpensas(emit) {

  const show_depto_info_extra = ref({})
  const valueMonth = ref('Seleccione un Mes')


  // GASTOS
  const gastos_habituales = reactive({
    edenor: ref(0),
    aysa: ref(0),
    v_lopez_abl: ref(0),
    limpieza: ref(0),
  })

  const cochera = reactive({
    superficie: 11.11111111111111,
    gastos_arba_cocheras: ref(0),
    a_pagar_por_cochera: ref(0),
    cuota: ref()
  })

  const otros_pagos = ref([])

  const otras_extraordinarias = ref([])

  // EDIFICIO

  const edificio = reactive({
    pretencion_fondo: ref(0),
    saldo_anterior_fondo_edificio: ref(0),
    saldo_al_cierre: ref(0),
    dif_saldo_pretencion_fondo_edificio: ref(0),
    saldos_favores_actuales: ref(0),
  })

  // DEPTOS

  const deptos = reactive({
    '01': { superficie: 9.186, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0), individual: ref(0), pago: ref(0), pagado: ref(false) },
    '02': { superficie: 7.971, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0), individual: ref(0), pago: ref(0), pagado: ref(false) },
    '03': { superficie: 14.281, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0), individual: ref(0), pago: ref(0), pagado: ref(false) },
    '04': { superficie: 13.065, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0), individual: ref(0), pago: ref(0), pagado: ref(false) },
    '05': { superficie: 10.994, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0), individual: ref(0), pago: ref(0), pagado: ref(false) },
    '06': { superficie: 7.971, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0), individual: ref(0), pago: ref(0), pagado: ref(false) },
    '07': { superficie: 9.186, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0), individual: ref(0), pago: ref(0), pagado: ref(false) },
    '08': { superficie: 13.065, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0), individual: ref(0), pago: ref(0), pagado: ref(false) },
    '09': { superficie: 14.281, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0), individual: ref(0), pago: ref(0), pagado: ref(false) }
  })

  const gastos_individual_deptos = ref([])

  // PAGOS Y DEUDAS
  const expensas_generadas = ref(false)

  const resultados = reactive({
    suma_pagos_deptos: ref(0),
    deuda_total: ref(0),
    deuda_deptos: ref(0),
    superficie_deptos: Object.values(deptos).reduce((acc, value) => {
      return acc += value.superficie
    }, 0),
    superficie_cochera: (cochera.superficie * 9),
  })

  // Para que no me caguen, si cambian algun campo con REF
  watch([gastos_habituales, cochera, edificio, otros_pagos.value, deptos, otras_extraordinarias.value, valueMonth, gastos_individual_deptos.value],
    ([gasto_habitual, coch, edi, otro_pago, depto, otra_extraordinaria, mes, gastos_ind_depto]) => {
      if (coch) {
        cochera.a_pagar_por_cochera = coch.gastos_arba_cocheras * cochera.superficie / 100
      }
      if (edi) {
        edificio.saldos_favores_actuales = Object.values(deptos).reduce((acc, value) => {
          return acc += value.saldo_favor
        }, 0)
        edificio.dif_saldo_pretencion_fondo_edificio = edificio.saldos_favores_actuales + edi.pretencion_fondo - (edi.saldo_anterior_fondo_edificio)
      }
      return expensas_generadas.value = false
    })

  // Function

  const createNewExtraordinaria = () => {
    let initial_value = 0
    let initial_text = ''
    return otras_extraordinarias.value.push({ otra_extraordinaria: initial_value, description: initial_text })
  }
  const deleteNewExtraordinaria = () => {
    if (otras_extraordinarias.value.length) {
      return otras_extraordinarias.value.pop()
    }
  }

  const createNewPago = () => {
    let initial_value = 0
    let initial_text = ''
    return otros_pagos.value.push({ otro_pago: initial_value, description: initial_text })
  }
  const deleteNewPago = () => {
    if (otros_pagos.value.length) {
      return otros_pagos.value.pop()
    }
  }

  const createNewGastoIndividualDepto = () => {
    let initial_value = 0
    let initial_text = ''
    let initial_depto
    return gastos_individual_deptos.value.push({ valor: initial_value, depto: initial_depto, description: initial_text })
  }
  const deleteNewGastoIndividualDepto = () => {
    if (gastos_individual_deptos.value.length) {
      return gastos_individual_deptos.value.pop()
    }
  }

  const doGenerateExpensas = () => {

    if (valueMonth.value === 'Seleccione un Mes') return toaster.error(`Seleccione un mes, por favor`, { position: 'top' })

    Object.entries(deptos).forEach(([key, depto]) => {
      depto.individual = 0
      gastos_individual_deptos.value.forEach(element => {
        if (element.depto === key) { depto.individual += element.valor }
      })
    })

    edificio.saldos_favores_actuales = Object.values(deptos).reduce((acc, value) => {
      return acc += value.saldo_favor
    }, 0)
    edificio.dif_saldo_pretencion_fondo_edificio = edificio.saldos_favores_actuales + edificio.pretencion_fondo - (edificio.saldo_anterior_fondo_edificio)
    // Se suma Toda la Deuda total Deptos
    resultados.deuda_deptos = Object.values(gastos_habituales).reduce((acc, value) => {
      return acc += value
    }, 0)
    if (otros_pagos.value.length) {
      resultados.deuda_deptos += otros_pagos.value.reduce((acc, value) => {
        return acc += value.otro_pago
      }, 0)
    }
    if (otras_extraordinarias.value.length) {
      resultados.deuda_deptos += otras_extraordinarias.value.reduce((acc, value) => {
        return acc += value.otra_extraordinaria
      }, 0)
    }
    resultados.deuda_deptos += edificio.dif_saldo_pretencion_fondo_edificio

    // Se hace la Suma de Deuda Total
    resultados.deuda_total = resultados.deuda_deptos + cochera.gastos_arba_cocheras

    // Se crea cuenta para Deptos
    Object.values(deptos).map(x => {
      x.a_pagar = (resultados.deuda_deptos * x.superficie / 100)
    })

    Object.values(deptos).map(x => {
      let value = 0
      value = ((x.a_pagar + x.deuda_depto + x.individual + cochera.a_pagar_por_cochera) - x.saldo_favor)
      if (Math.sign(value) === 0 || Math.sign(value) === 1) {
        x.a_pagar_total = value, x.new_saldo_favor = 0
      } else if (Math.sign(value) === -0 || Math.sign(value) === -1) {
        x.a_pagar_total = 0, x.new_saldo_favor = (value * -1)
      }
      return x
    })
    resultados.suma_pagos_deptos = Object.values(deptos).reduce((acc, value) => {
      return acc += value.a_pagar_total
    }, 0)
    show_depto_info_extra.value = {}
    // Sacamos la cuenta de cuanto nos tiene que quedar al cerrar cuentas
    const diferencia_entre_pagos_y_deudas_deptos = resultados.suma_pagos_deptos - Object.values(deptos).reduce((acc, value) => {
      return acc += (value.deuda_depto + value.individual)
    }, 0)
    edificio.saldo_al_cierre =
      ((edificio.dif_saldo_pretencion_fondo_edificio + edificio.saldo_anterior_fondo_edificio + diferencia_entre_pagos_y_deudas_deptos) - resultados.deuda_total)



    setTimeout(() => {
      expensas_generadas.value = true
    }, 200)
  }
  const checkNewSaldo = (element) => {
    return element.new_saldo_favor !== 0
  }
  const checkIndividual = (element) => {
    return element.individual !== 0
  }

  const selectDepto = (item, index) => {
    emit('showDeptoSelect', item, index)
  }

  const getIndividual = (index) => {
    const individual = []
    gastos_individual_deptos.value.forEach(e => {
      if (e.depto === index) { individual.push({ valor: e.valor, description: e.description }) }
    })
    return individual
  }

  const showDeptoSelect = (item, index) => {
    if (!item) {
      show_depto_info_extra.value = {}
    } else {
      let individual = getIndividual(index)
      show_depto_info_extra.value = { ...item, index: index, individual: individual }
    }
  }

  const SendPagoResult = ({ deuda_depto_value, saldo_favor_value, index, deptos, pago }) => {
    if (pago !== 0) {
      deptos[index].pagado = true
    } else {
      deptos[index].pagado = false
    }
    return deptos[index].deuda_depto = deuda_depto_value, deptos[index].saldo_favor = saldo_favor_value, deptos[index].pago = pago
  }

  const setValueMonth = (item) => {
    return valueMonth.value = item
  }

  return {
    gastos_habituales,
    cochera,
    otros_pagos,
    edificio,
    deptos,
    expensas_generadas,
    resultados,
    createNewPago,
    deleteNewPago,
    doGenerateExpensas,
    checkNewSaldo,
    selectDepto,
    show_depto_info_extra,
    showDeptoSelect,
    valueMonth,
    otras_extraordinarias,
    createNewExtraordinaria,
    deleteNewExtraordinaria,
    SendPagoResult,
    setValueMonth,
    gastos_individual_deptos,
    createNewGastoIndividualDepto,
    deleteNewGastoIndividualDepto,
    checkIndividual,
  }
}