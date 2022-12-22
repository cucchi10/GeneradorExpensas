import {  reactive, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

import { createToaster } from "@meforma/vue-toaster";

const toaster = createToaster();

import html2pdf from 'html2pdf.js';

export default function useExpensas(emit){

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
  })

  const otros_pagos= ref([])

  // EDIFICIO

  const edificio = reactive({
    pretencion_fondo: ref(0),
    saldo_anterior_fondo_edificio: ref(0),
    saldo_al_cierre: ref(0),
    dif_saldo_pretencion_fondo_edificio: ref(0),
  })

  // DEPTOS

  const deptos = reactive({
    UF_01:  {superficie: 9.186, saldo_favor: ref(0),  new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0)},
    UF_02:  {superficie: 7.971, saldo_favor: ref(0),  new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0)},
    UF_03:  {superficie: 14.281, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0)},
    UF_04:  {superficie: 13.065, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0)},
    UF_05:  {superficie: 10.994, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0)},
    UF_06:  {superficie: 7.971, saldo_favor: ref(0),  new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0)},
    UF_07:  {superficie: 9.186, saldo_favor: ref(0),  new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0)},
    UF_08:  {superficie: 13.065, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0)},
    UF_09:  {superficie: 14.281, saldo_favor: ref(0), new_saldo_favor: ref(0), deuda_depto: ref(0), a_pagar: ref(0), a_pagar_total: ref(0)},
  })

  // PAGOS Y DEUDAS
  const expensas_generadas = ref(false)

  const resultados = reactive({
    suma_pagos_deptos: ref(0),
    deuda_total: ref(0),
    deuda_deptos: ref(0),
    superficie_deptos: Object.values(deptos).reduce((acc,value)=>{
      return acc+=value.superficie
    }, 0),
    superficie_cochera: (cochera.superficie * 9),
  })

  // Para que no me caguen, si cambian algun campo con REF
  watch([gastos_habituales,cochera,edificio,otros_pagos.value,deptos], ([gasto_habitual, coch, edi, otro_pago, depto])=>{
    if(coch) {
      cochera.a_pagar_por_cochera= coch.gastos_arba_cocheras*cochera.superficie/100
    }
    if(edi){
      if(edi.pretencion_fondo > edi.saldo_anterior_fondo_edificio){
        edificio.dif_saldo_pretencion_fondo_edificio = edi.pretencion_fondo - (edi.saldo_anterior_fondo_edificio -
         Object.values(deptos).reduce((acc,value)=>{
        return acc+=value.saldo_favor
        }, 0))
      }else{
        edificio.dif_saldo_pretencion_fondo_edificio = 0
      }
    }
    if(depto){
      if(edi.pretencion_fondo > edi.saldo_anterior_fondo_edificio){
        edificio.dif_saldo_pretencion_fondo_edificio = edi.pretencion_fondo - (edi.saldo_anterior_fondo_edificio -
         Object.values(deptos).reduce((acc,value)=>{
        return acc+=value.saldo_favor
        }, 0))
      }else{
        edificio.dif_saldo_pretencion_fondo_edificio = 0
      }
    }
    return expensas_generadas.value = false
  })

  // Function

  const createNewPago = () => {
    let initial_value = 0
    let initial_text = ''
    return otros_pagos.value.push({otro_pago: initial_value, description: initial_text})
  }
  const deleteNewPago = () => {
    if (otros_pagos.value.length){
      return otros_pagos.value.pop()
    }
  }

  const doGenerateExpensas = () => { 

    // Se suma Toda la Deuda total Deptos
    resultados.deuda_deptos = Object.values(gastos_habituales).reduce((acc,value)=>{
      return acc+=value
    }, 0)
    if(otros_pagos.value.length){
      resultados.deuda_deptos+=otros_pagos.value.reduce((acc,value)=>{
      return acc+=value.otro_pago
    }, 0)
    }
    resultados.deuda_deptos+=edificio.dif_saldo_pretencion_fondo_edificio

    // Se hace la Suma de Deuda Total
    resultados.deuda_total=resultados.deuda_deptos+cochera.gastos_arba_cocheras

    // Se crea cuenta para Deptos
    Object.values(deptos).map(x=>{
      x.a_pagar = (resultados.deuda_deptos*x.superficie/100)
    })
    Object.values(deptos).map(x=>{
      let value = 0
      value = ((x.a_pagar + x.deuda_depto + cochera.a_pagar_por_cochera)-x.saldo_favor)
      if(Math.sign(value) === 0 || Math.sign(value) === 1){
        x.a_pagar_total=value, x.new_saldo_favor=0
      }else if (Math.sign(value) === -0 ||Math.sign(value) === -1){
        x.a_pagar_total=0, x.new_saldo_favor=(value*-1)
      }
      return x
    })
    resultados.suma_pagos_deptos = Object.values(deptos).reduce((acc,value)=>{
      return acc+=value.a_pagar_total
    }, 0)
    show_depto_info_extra.value = {}
    // Sacamos la cuenta de cuanto nos tiene que quedar al cerrar cuentas
    edificio.saldo_al_cierre =  
    ((edificio.dif_saldo_pretencion_fondo_edificio+edificio.saldo_anterior_fondo_edificio+resultados.suma_pagos_deptos)-resultados.deuda_total)

    

    setTimeout(()=>{
      expensas_generadas.value = true
    },200)
  }
  const checkNewSaldo = (element) => {
    return element.new_saldo_favor !== 0
  }

  const selectDepto = (item, index)=>{
    emit('showDeptoSelect', item, index)
  }

  const showDeptoSelect = (item, index) => {
    show_depto_info_extra.value = {...item, index: index}
  }

  const selectValueMonth = (item) => {
   emit('setValueMonth', item)
  }
  const setValueMonth = (item) => {
    console.log(item)
    return valueMonth.value = item
  }

  const doExportPDF = (item, month) => {
    if(!Object.values(item).length){
      return toaster.error('Selecciona un Departamento en la Tabla',{position: 'bottom'});
    }
    if(month === 'Seleccione un Mes'){
      return toaster.error('Selecciona un Mes',{position: 'top'});
    }
    let depto = item.index
    let mes = month

    
    let element = document.getElementById('ExpensasPDF');
    element.classList.add('class-pdf');
    
    let opt = {
      margin:       0.6,
      filename:     `Expensas_${mes}_${depto}.pdf`,
      image:        { type: 'jpg', quality: 0.9 },
      html2canvas:  { scale: 2  },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait',compressPDF: false },
      pagebreak: {mode: ['avoid-all']}
    };

    let title = document.getElementById('TittlePdf');
    title.classList.remove('class-title-pdf');

    html2pdf().from(element).set(opt).save().finally(()=>{element.classList.remove('class-pdf'),  title.classList.add('class-title-pdf')});
    
  }
  

  return{
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
    doExportPDF,
    setValueMonth,
    valueMonth,
    selectValueMonth,
  }
}