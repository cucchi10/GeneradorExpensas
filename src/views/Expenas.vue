<script setup>
import useExpensas from '../composable/useExpensas.js';
import useStrorage from '../composable/useStorage.js';

import InputComponentVue from "../components/InputComponent.vue";
import GastosEdificioTableVue from "../components/GastosEdificioTable.vue";
import GastosDepartamentoTableVue from '../components/GastosDepartamentoTable.vue';
import DeptoInfoExtraVue from '../components/DeptoInfoExtra.vue';
import TableSaldoCierreVue from '../components/TableSaldoCierre.vue';
import AcordeonComponentVue from '../components/AcordeonComponent.vue';

import SelectedMonthVue from '../components/SelectMonth.vue'
import {onBeforeMount } from '@vue/runtime-core';

const {
    gastos_habituales,cochera,otros_pagos,edificio,deptos,expensas_generadas,resultados,createNewPago,deleteNewPago,doGenerateExpensas,
    show_depto_info_extra, showDeptoSelect, valueMonth, setValueMonth, otras_extraordinarias, deleteNewExtraordinaria, 
    createNewExtraordinaria, ExpensasPDF,SendPagoResult} = useExpensas()

const {datos_session, doLocaleStorage, setLocaleStorage, deleteLocaleStorage, refTxt, uploadTxt, downloadTxt,doExportPDF,
SendPagoStorage} = useStrorage(SendPagoResult)


onBeforeMount(()=>{
  setLocaleStorage(deptos, edificio, valueMonth)
})

</script>

<template>
  <div v-if="datos_session" class="pt-5 pb-2">
     <AcordeonComponentVue title="Pagos Realizados Por Deptos" :deptos="deptos" @onSendPago="SendPagoStorage"/>
  </div>
  <div class="d-flex justify-content-around align-items-center flex-wrap pt-5 pb-2">
    <div class="">
      <h3 class="text-center">Selecciona un Mes</h3>
      <selected-month-vue class="mb-3" @setValueMonth="setValueMonth" :item="valueMonth"/>
      <h3 class="text-center">Edificio</h3>
        <input-component-vue titleValue="Pretención de Fondo Final del Edificio" descriptionValue="$" 
          @onChange="(value)=>edificio.pretencion_fondo=value" :item="edificio.pretencion_fondo"
        />
        <input-component-vue titleValue="Saldo Anterior Resevera" descriptionValue="$" 
          @onChange="(value)=>edificio.saldo_anterior_fondo_edificio=value" :item="edificio.saldo_anterior_fondo_edificio"
        />
        <input-component-vue titleValue="ARBA Cocheras" descriptionValue="$" 
          @onChange="(value)=>cochera.gastos_arba_cocheras=value" :item="cochera.gastos_arba_cocheras"
        />
    </div>
    <div class="">
      <h3 class="text-center">Gastos Habituales</h3>
        <input-component-vue titleValue="Edenor" descriptionValue="$" 
          @onChange="(value)=>gastos_habituales.edenor=value" :item="gastos_habituales.edenor"
        />
        <input-component-vue titleValue="Aysa" descriptionValue="$" 
          @onChange="(value)=>gastos_habituales.aysa=value" :item="gastos_habituales.aysa"
        />
        <input-component-vue titleValue="Impuesto V.Lopez" descriptionValue="$" 
          @onChange="(value)=>gastos_habituales.v_lopez_abl=value" :item="gastos_habituales.v_lopez_abl"
        />
        <input-component-vue titleValue="Personal Limpieza" descriptionValue="$" 
          @onChange="(value)=>gastos_habituales.limpieza=value" :item="gastos_habituales.limpieza"
        />
    </div>
  </div>
    
  <div class="container">
    <div class="d-flex justify-content-start pb-3">
      <button type="button" class="btn btn-success btn-extra" @click="createNewPago"><font-awesome-icon icon="fa-solid fa-plus" /> Crear Nuevo Campo de Pago</button>
    </div>
  
    <div class="d-flex justify-content-around align-items-center flex-wrap"> 
      <template v-for="(otro_pago ,index) in otros_pagos" :key="index">
        <input-component-vue :titleValue="`Otro Pago N° ${index+1}`" descriptionValue="$" 
          descriptionValueDobleText="Descripción" :dobleComponentText="true" :item="otro_pago.otro_pago" :itemText="otro_pago.description"
          @onChange="(value)=>otro_pago.otro_pago=value" @onChangeDobleText="(textValue)=>otro_pago.description=textValue"
        />
      </template>
    </div>

    <div class="d-flex justify-content-end mt-3 pb-3">
      <button v-if="otros_pagos.length" type="button" class="btn btn-danger btn-extra-del" @click="deleteNewPago"><font-awesome-icon icon="fa-solid fa-trash"/>
         Eliminar Ultimo Campo de Pago </button>
    </div>

    <div class="d-flex justify-content-start pb-3">
      <button type="button" class="btn btn-success" @click="createNewExtraordinaria"><font-awesome-icon icon="fa-solid fa-plus" /> Crear Nuevo Campo de Extraordinarias</button>
    </div>
  
    <div class="d-flex justify-content-around align-items-center flex-wrap"> 
      <template v-for="(otra_extraordinaria ,index) in otras_extraordinarias" :key="index">
        <input-component-vue :titleValue="`Extraordinaria N° ${index+1}`" descriptionValue="$"
          descriptionValueDobleText="Descripción" :dobleComponentText="true" :item="otra_extraordinaria.otra_extraordinaria" 
          :itemText="otra_extraordinaria.description"
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
        <input-component-vue :titleValue="`Depto N° ${index.replace('_',' ')}`" descriptionValue="Deuda $"
          descriptionValueDoble="A Favor $" :dobleComponent="true"  :item="depto.deuda_depto" :itemDoble="depto.saldo_favor"
          @onChange="(value)=>depto.deuda_depto=value" @onChangeDoble="(secondValue)=>depto.saldo_favor=secondValue"
        />
      </template>
    </div>
  </div>

  <div class="container mt-5">
    <div class="d-flex justify-content-between flex-wrap align-items-center">
      <div class="d-flex flex-column justify-content-center align-items-start mb-3 gap-3">
      <label v-if="!datos_session" type="button" class="btn btn-outline-primary" ><font-awesome-icon icon="fa-solid fa-folder-open"/>
         Subir Archivo de Session<input type="file" ref="refTxt" @change="uploadTxt(deptos, edificio, valueMonth)" hidden></label>
           
      <button v-if="datos_session" type="button" class="btn btn-outline-primary" @click="downloadTxt(valueMonth)"><font-awesome-icon icon="fa-solid fa-download" />
         Guardar Archivo de Session </button>
    </div>
    <div class="d-flex flex-column justify-content-center align-items-end mb-3 gap-3">
      <button v-if="expensas_generadas" type="button" class="btn btn-outline-primary" @click="doLocaleStorage(deptos, edificio, valueMonth)"><font-awesome-icon icon="fa-solid fa-floppy-disk" />
         Guardar Datos En Session </button>
      <button v-if="datos_session" type="button" class="btn btn-outline-primary" @click="deleteLocaleStorage"><font-awesome-icon icon="fa-solid fa-trash"/>
         Eliminar Datos de Session </button>
    </div>
    </div>
    <div class="d-flex justify-content-around flex-wrap mb-5 gap-3">
      <button type="button" class="btn btn-primary" @click="doGenerateExpensas"><font-awesome-icon icon="fa-solid fa-calculator" /> Calcular Expensas</button>
      <button type="button" class="btn btn-primary" @click="doExportPDF(show_depto_info_extra, valueMonth)" :disabled="!expensas_generadas">
        <font-awesome-icon icon="fa-solid fa-file-pdf" /> Exportar PDF</button>
    </div>
    <div v-if="expensas_generadas" id="ExpensasPDF" ref="ExpensasPDF">
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
    }, 0)"
      descriptionSaldoReserva="Saldo Anterior de Reserva" :saldoReserva="edificio.saldo_anterior_fondo_edificio"/>
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

.btn {
  min-width: 240.17px;
}

.btn-extra{
    min-width: 318.64px;
  }

.btn-extra-del{
  min-width: 338.25px;
}

@media (max-width: 383px) {
  .btn {
    min-width: 100%;
  }
}
</style>