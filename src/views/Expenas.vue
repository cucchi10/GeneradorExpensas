<script setup>
import useExpensas from '../composable/useExpensas.js';
import useStrorage from '../composable/useStorage.js';

import InputComponentVue from "../components/InputComponent.vue";
import GastosEdificioTableVue from "../components/GastosEdificioTable.vue";
import GastosDepartamentoTableVue from '../components/GastosDepartamentoTable.vue';
import DeptoInfoExtraVue from '../components/DeptoInfoExtra.vue';
import TableSaldoCierreVue from '../components/TableSaldoCierre.vue';

import SelectedMonthVue from '../components/SelectMonth.vue'

const {
    gastos_habituales,cochera,otros_pagos,edificio,deptos,expensas_generadas,resultados,createNewPago,deleteNewPago,doGenerateExpensas,checkNewSaldo,
    show_depto_info_extra, showDeptoSelect, doExportPDF, valueMonth, setValueMonth, otras_extraordinarias, deleteNewExtraordinaria, 
    createNewExtraordinaria} = useExpensas()

const {datos_session} = useStrorage()
</script>

<template>
  <div class="d-flex justify-content-around align-items-center flex-wrap pt-5 pb-2">
    <div class="">
      <h3 class="text-center">Selecciona un Mes</h3>
      <selected-month-vue class="mb-3" @setValueMonth="setValueMonth"/>
      <h3 class="text-center">Edificio</h3>
        <input-component-vue titleValue="Pretención de Fondo Final del Edificio" descriptionValue="$" 
          @onChange="(value)=>edificio.pretencion_fondo=value"
        />
        <input-component-vue titleValue="Saldo Anterior Resevera" descriptionValue="$" 
          @onChange="(value)=>edificio.saldo_anterior_fondo_edificio=value"
        />
        <input-component-vue titleValue="ARBA Cocheras" descriptionValue="$" 
          @onChange="(value)=>cochera.gastos_arba_cocheras=value"
        />
    </div>
    <div class="">
      <h3 class="text-center">Gastos Habituales</h3>
        <input-component-vue titleValue="Edenor" descriptionValue="$" 
          @onChange="(value)=>gastos_habituales.edenor=value"
        />
        <input-component-vue titleValue="Aysa" descriptionValue="$" 
          @onChange="(value)=>gastos_habituales.aysa=value"
        />
        <input-component-vue titleValue="Impuesto V.Lopez" descriptionValue="$" 
          @onChange="(value)=>gastos_habituales.v_lopez_abl=value"
        />
        <input-component-vue titleValue="Personal Limpieza" descriptionValue="$" 
          @onChange="(value)=>gastos_habituales.limpieza=value"
        />
    </div>
  </div>

  <div class="container">
    <div class="d-flex justify-content-start pb-3">
      <button type="button" class="btn btn-success" @click="createNewPago"><font-awesome-icon icon="fa-solid fa-plus" /> Crear Nuevo Campo de Pago</button>
    </div>
  
    <div class="d-flex justify-content-around align-items-center flex-wrap"> 
      <template v-for="(otro_pago ,index) in otros_pagos" :key="index">
        <input-component-vue :titleValue="`Otro Pago N° ${index+1}`" descriptionValue="$"
          descriptionValueDobleText="Descripción" :dobleComponentText="true"
          @onChange="(value)=>otro_pago.otro_pago=value" @onChangeDobleText="(textValue)=>otro_pago.description=textValue"
        />
      </template>
    </div>

    <div class="d-flex justify-content-end mt-3 pb-3">
      <button v-if="otros_pagos.length" type="button" class="btn btn-danger" @click="deleteNewPago"><font-awesome-icon icon="fa-solid fa-trash"/>
         Eliminar Ultimo Campo de Pago </button>
    </div>

    <div class="d-flex justify-content-start pb-3">
      <button type="button" class="btn btn-success" @click="createNewExtraordinaria"><font-awesome-icon icon="fa-solid fa-plus" /> Crear Nuevo Campo de Extraordinarias</button>
    </div>
  
    <div class="d-flex justify-content-around align-items-center flex-wrap"> 
      <template v-for="(otra_extraordinaria ,index) in otras_extraordinarias" :key="index">
        <input-component-vue :titleValue="`Extraordinaria N° ${index+1}`" descriptionValue="$"
          descriptionValueDobleText="Descripción" :dobleComponentText="true"
          @onChange="(value)=>otra_extraordinaria.otra_extraordinaria=value" @onChangeDobleText="(textValue)=>otra_extraordinaria.description=textValue"
        />
      </template>
    </div>

    <div class="d-flex justify-content-end mt-3 pb-3">
      <button v-if="otras_extraordinarias.length" type="button" class="btn btn-danger" @click="deleteNewExtraordinaria"><font-awesome-icon icon="fa-solid fa-trash"/>
         Eliminar Ultimo Campo de Extraordinarias </button>
    </div>

    <h3 class="text-center">Departamentos</h3>
    <div class="d-flex justify-content-around align-items-center flex-wrap">
      <template v v-for="depto, index in deptos" :key="index">
        <input-component-vue :titleValue="`Depto N° ${index}`" descriptionValue="Deuda $"
          descriptionValueDoble="A Favor $" :dobleComponent="true"
          @onChange="(value)=>depto.deuda_depto=value" @onChangeDoble="(secondValue)=>depto.saldo_favor=secondValue"
        />
      </template>
    </div>
  </div>


  <div class="container mt-5">
    <div class="d-flex justify-content-around flex-wrap mb-3 gap-3">
      <button type="button" class="btn btn-primary" @click="doGenerateExpensas">Calcular Expensas</button>
      <button type="button" class="btn btn-primary" @click="doExportPDF(show_depto_info_extra, valueMonth)" :disabled="!expensas_generadas">Exportar PDF</button>
    </div>
    <div class="d-flex flex-column justify-content-end align-items-end mb-3 gap-3">
      <button v-if="expensas_generadas" type="button" class="btn btn-outline-primary" @click="doLocaleStorage"><font-awesome-icon icon="fa-solid fa-floppy-disk" />
         Guardar Datos En Session </button>
      <button v-if="datos_session" type="button" class="btn btn-outline-primary" @click="deleteLocaleStorage"><font-awesome-icon icon="fa-solid fa-trash"/>
         Eliminar Datos de Session </button>
    </div>
    <div v-if="expensas_generadas" id="ExpensasPDF">
      <h2 class="text-center mb-5 class-title-pdf" id="TittlePdf">{{ `Expensas Correspondientes al Mes de ${valueMonth}` }}</h2>
      <gastos-edificio-table-vue
        :gastos_habituales="gastos_habituales"
        :cochera="cochera"
        :otros_pagos="otros_pagos"
        :otras_extraordinarias="otras_extraordinarias"
        :edificio="edificio"
        :resultados="resultados"
      />
      <div class="html2pdf__page-break"></div>
      <gastos-departamento-table-vue
        @showDeptoSelect="showDeptoSelect"
        :cochera="cochera"
        :deptos="deptos"
        :resultados="resultados"
      />
      <div class="html2pdf__page-break"></div>
      <table-saldo-cierre-vue descriptionFinal="Saldo al cierre de Caja" :saldoFinal="edificio.saldo_al_cierre"
        descriptionSaldosFavores="Suma de Saldos a Favores de los Departamentos" :saldosFavores="Object.values(deptos).reduce((acc,value)=>{
      return acc+=value.new_saldo_favor
    }, 0)"
      descriptionARecaudar="Saldo a recaudar Por Pagos" :saldoARecaudar="resultados.suma_pagos_deptos"
      descriptionPagos="Pagos a Realizar por Gastos" :pagos="(resultados.deuda_total-edificio.dif_saldo_pretencion_fondo_edificio)"
      descriptionExtraordinarias="Detalle por Extraordinarias"
      :extraordinarias="otras_extraordinarias.reduce((acc,value)=>{
      return acc+=value.otra_extraordinaria
    }, 0)"/>
      <depto-info-extra-vue :show_depto_info_extra="show_depto_info_extra" :cochera="cochera" :extraordinarias="otras_extraordinarias.reduce((acc,value)=>{
      return acc+=value.otra_extraordinaria
    }, 0)"/>
    </div>
  </div>
  <div style="min-height: 50px"></div>
</template>



<style>
.class-title-pdf{
  display: none;
}
</style>