<script setup>
import useExpensas from '../composable/useExpensas.js';
import useStrorage from '../composable/useStorage.js';
import useExport from '../composable/useExport.js';

import InputChechedVue from '../components/InputChecked.vue'
import InputComponentVue from "../components/InputComponent.vue";
import GastosEdificioTableVue from "../components/GastosEdificioTable.vue";
import GastosDepartamentoTableVue from '../components/GastosDepartamentoTable.vue';
import DeptoInfoExtraVue from '../components/DeptoInfoExtra.vue';
import TableSaldoCierreVue from '../components/TableSaldoCierre.vue';
import AcordeonComponentVue from '../components/AcordeonComponent.vue';
import SelectedMonthVue from '../components/SelectMonth.vue';
import SelectComponentCuotaVue from '../components/SelectComponentCuota.vue';

import {onBeforeMount } from '@vue/runtime-core';
import {defineEmits} from 'vue';

const emit = defineEmits(['setLoaderEmit'])

const {
    gastos_habituales,cochera,otros_pagos,edificio,deptos,expensas_generadas,resultados,createNewPago,deleteNewPago,doGenerateExpensas,
    show_depto_info_extra, showDeptoSelect, valueMonth, otras_extraordinarias, deleteNewExtraordinaria, 
    createNewExtraordinaria,SendPagoResult,setValueMonth,gastos_individual_deptos,createNewGastoIndividualDepto,
    deleteNewGastoIndividualDepto,createNewPagoCochera,deleteNewPagoCochera} = useExpensas()

const {datos_session, doLocaleStorage, setLocaleStorage, deleteLocaleStorage, refTxt, uploadTxt, downloadTxt,
SendPagoStorage,datos_act_session,uploadTxtPagos} = useStrorage(SendPagoResult,emit)

const {doExportPDF, doExportPDFMasive,doExportXSLX,uploadExcel,refExcel} = useExport(showDeptoSelect,emit)

onBeforeMount(()=>{
  setLocaleStorage(deptos, edificio, setValueMonth)
})

</script>

<template>
  <div v-if="datos_session && !datos_act_session" class="pt-5 pb-2">
     <AcordeonComponentVue title="Pagos Realizados Por Departamentos" idAccordion="PagosDeptos" idHeading="PagosDeptosHeading" 
      idCollapse="PagosDeptosCollapse">
      <template #inner>
        <template v v-for="depto, index in deptos" :key="index">
          <input-component-vue :titleValue="`Depto N° ${index.replace('_',' ')}`" descriptionValue="Pago $"
            :item="depto.pago"
            @onChange="(value)=>SendPagoStorage(value,index, deptos)"
            >
            <template #innerInput>
              <input-cheched-vue titleValue="Pago" :checked="depto.pagado" :index="index"/>
            </template>
          </input-component-vue>
        </template>
      </template>
     </AcordeonComponentVue>
     <div class="d-flex flex-wrap justify-content-around align-items-stretch mt-3 gap-3">
      <label type="button" class="btn btn-outline-primary" ><font-awesome-icon icon="fa-solid fa-folder-open"/>
         Subir Archivo de Pagos<input type="file" ref="refTxt" @change="uploadTxtPagos(deptos)" hidden></label>
        <button type="button" class="btn btn-outline-primary" @click="downloadTxt(valueMonth,deptos)"><font-awesome-icon icon="fa-solid fa-download" />
         Descargar Archivo de Pagos </button>
    </div>
  </div>
  <div class="d-flex justify-content-around align-items-stretch flex-wrap pt-5 pb-2">
    <div class="">
      <h3 class="text-center">Selecciona un Mes</h3>
      <selected-month-vue class="mb-3" @setValueMonth="(value)=>valueMonth=value" :item="valueMonth" :datos_session="datos_session"/>
      <h3 class="text-center">Edificio</h3>
        <input-component-vue titleValue="Pretención de Fondo Final del Edificio" descriptionValue="$" 
          @onChange="(value)=>edificio.pretencion_fondo=value" :item="edificio.pretencion_fondo"
        />
        <input-component-vue titleValue="Saldo Anterior Resevera" descriptionValue="$" 
          @onChange="(value)=>edificio.saldo_anterior_fondo_edificio=value" :item="edificio.saldo_anterior_fondo_edificio"
        />
        <input-component-vue titleValue="Saldo a Favores Totales" descriptionValue="$" 
          @onChange="(value)=>edificio.saldos_favores_actuales=value" :item="edificio.saldos_favores_actuales"
        :datos_session="true"/>
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
        <input-component-vue titleValue="ARBA Cocheras" descriptionValue="$" 
            @onChange="(value)=>cochera.gastos_arba_cocheras=value" :item="cochera.gastos_arba_cocheras"
          >
          <template #innerInput>
            <select-component-cuota-vue :item="cochera.cuota" @onSelectArbaCuota="(value)=>cochera.cuota=value"/>
          </template>
        </input-component-vue>
    </div>
  </div>
    
  <div class="container">

    <!-- Otro Pago -->

    <div class="d-flex justify-content-start pb-3">
      <button type="button" class="btn btn-success btn-extra" @click="createNewPago"><font-awesome-icon icon="fa-solid fa-plus" /> Crear Nuevo Campo de Pago</button>
    </div>
  
    <div class="d-flex justify-content-around align-items-stretch flex-wrap"> 
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

    <!-- Extraordinarias -->

    <div class="d-flex justify-content-start pb-3">
      <button type="button" class="btn btn-success" @click="createNewExtraordinaria"><font-awesome-icon icon="fa-solid fa-plus" /> Crear Nuevo Campo de Extraordinarias</button>
    </div>
  
    <div class="d-flex justify-content-around align-items-stretch flex-wrap"> 
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

    <!-- Otro Pago Cocheras -->

    <div class="d-flex justify-content-start pb-3">
      <button type="button" class="btn btn-success btn-extra" @click="createNewPagoCochera"><font-awesome-icon icon="fa-solid fa-plus" /> Crear Nuevo Campo de Pago Cochera</button>
    </div>
  
    <div class="d-flex justify-content-around align-items-stretch flex-wrap"> 
      <template v-for="(gastoCochera ,index) in cochera.push" :key="index">
        <input-component-vue :titleValue="`Gasto Cochera N° ${index+1}`" descriptionValue="$" 
          descriptionValueDobleText="Descripción" :dobleComponentText="true" :item="gastoCochera.gasto" :itemText="gastoCochera.description"
          @onChange="(value)=>gastoCochera.gasto=value" @onChangeDobleText="(textValue)=>gastoCochera.description=textValue"
        />
      </template>
    </div>

    <div class="d-flex justify-content-end mt-3 pb-3">
      <button v-if="cochera.push.length" type="button" class="btn btn-danger btn-extra-del" @click="deleteNewPagoCochera"><font-awesome-icon icon="fa-solid fa-trash"/>
         Eliminar Ultimo Campo de Pago Cochera</button>
    </div>


    <!-- Gatos Individuales -->

    <div class="d-flex justify-content-start pb-3">
      <button type="button" class="btn btn-success" @click="createNewGastoIndividualDepto"><font-awesome-icon icon="fa-solid fa-plus" /> Crear Nuevo Campo Individual de Pago</button>
    </div>
  
    <div class="d-flex justify-content-around align-items-stretch flex-wrap"> 
      <template v-for="(gasto_individual_depto ,index) in gastos_individual_deptos" :key="index">
       <input-component-vue :titleValue="`Pago Individual N° ${index+1}`" descriptionValue="$"
          descriptionValueDobleText="Descripción" :dobleComponentText="true" :item="gasto_individual_depto.valor" 
          :itemText="gasto_individual_depto.description"
          :selectComponent="true"
          :itemDepto="gasto_individual_depto.depto"
          :array_deptos="Object.keys(deptos)"
          @onChange="(value)=>gasto_individual_depto.valor=value" @onChangeDobleText="(textValue)=>gasto_individual_depto.description=textValue"
          @onSelectDepto="(selectValue)=>gasto_individual_depto.depto=selectValue"
        />
      </template>
    </div>

    <div class="d-flex justify-content-end mt-3 pb-3">
      <button v-if="gastos_individual_deptos.length" type="button" class="btn btn-danger" @click="deleteNewGastoIndividualDepto"><font-awesome-icon icon="fa-solid fa-trash"/>
         Eliminar Ultimo Campo Individual de Pago </button>
    </div>
  </div>

  <AcordeonComponentVue title="Deuda y Saldo a Favor Departamentos" idAccordion="DeudasFavorDeptos" idHeading="DeudasFavorDeptosHeading" 
    idCollapse="DeudasFavorDeptosCollapse">
    <template #inner>
      <template v v-for="depto, index in deptos" :key="index">
        <input-component-vue :titleValue="`Depto N° ${index}`" descriptionValue="Deuda $"
          descriptionValueDoble="A Favor $" :dobleComponent="true"  :item="depto.deuda_depto" :itemDoble="depto.saldo_favor"
          @onChange="(value)=>depto.deuda_depto=value" @onChangeDoble="(secondValue)=>depto.saldo_favor=secondValue" :datos_session="datos_session"
        />
      </template>
    </template>
  </AcordeonComponentVue>

  <div class="container mt-5">
    <div class="d-flex justify-content-between flex-wrap align-items-stretch">
      <div class="d-flex flex-column justify-content-center align-items-stretch mb-3 gap-3">
        <label v-if="expensas_generadas" type="button" class="btn btn-outline-warning" ><font-awesome-icon icon="fa-solid fa-folder-open"/>
         Subir Archivo EXCEL<input type="file" ref="refExcel" @change="uploadExcel(valueMonth)" hidden></label>
      <button v-if="expensas_generadas" type="button" class="btn btn-warning" @click="doExportXSLX(valueMonth)" :disabled="!expensas_generadas">
        <font-awesome-icon icon="fa-solid fa-file-excel" /> Export EXCEL</button>
    </div>
    <div class="d-flex flex-column justify-content-center align-items-stretch mb-3 gap-3">
      <label v-if="!datos_session" type="button" class="btn btn-outline-primary" ><font-awesome-icon icon="fa-solid fa-folder-open"/>
         Subir Archivo de Session<input type="file" ref="refTxt" @change="uploadTxt(deptos, edificio, setValueMonth)" hidden></label>
        <button v-if="datos_session&&datos_act_session" type="button" class="btn btn-outline-primary" @click="downloadTxt(valueMonth)"><font-awesome-icon icon="fa-solid fa-download" />
         Descargar Archivo de Session </button>
      <button v-if="expensas_generadas" type="button" class="btn btn-outline-primary" @click="doLocaleStorage(deptos, edificio, valueMonth)"><font-awesome-icon icon="fa-solid fa-floppy-disk" />
         Guardar Datos En Session </button>
      <button v-if="datos_session" type="button" class="btn btn-outline-primary" @click="deleteLocaleStorage"><font-awesome-icon icon="fa-solid fa-trash"/>
         Eliminar Datos de Session </button>
    </div>
    </div>
    <div class="d-flex justify-content-around flex-wrap mb-5 gap-3">
      <button type="button" class="btn btn-info" @click="doGenerateExpensas"><font-awesome-icon icon="fa-solid fa-calculator" /> Calcular Expensas</button>
      <button type="button" class="btn btn-primary" @click="doExportPDF(show_depto_info_extra, valueMonth)" :disabled="!expensas_generadas">
        <font-awesome-icon icon="fa-solid fa-file-pdf" /> Exportar PDF</button>
      <button type="button" class="btn btn-primary" @click="doExportPDFMasive(valueMonth,deptos)" :disabled="!expensas_generadas">
        <font-awesome-icon icon="fa-solid fa-file-pdf" /> Export All PDF</button>
    </div>
    <div v-if="expensas_generadas" id="ExpensasPDF" ref="ExpensasPDF">
      <h2 v-if="valueMonth === 'Enero' && new Date().getMonth() === 11" class="text-center mb-5 class-title-pdf" id="TittlePdf">{{ `Expensas Correspondientes al Mes de ${valueMonth} del ${ mes = (new Date().getFullYear()+1)}` }}</h2>
      <h2 v-else class="text-center mb-5 class-title-pdf" id="TittlePdf">{{ `Expensas Correspondientes al Mes de ${valueMonth} del ${new Date().getFullYear()}` }}</h2>
      <gastos-edificio-table-vue
        :gastos_habituales="gastos_habituales"
        :cochera="cochera"
        :otros_pagos="otros_pagos"
        :otras_extraordinarias="otras_extraordinarias"
        :edificio="edificio"
        :resultados="resultados"
        :valueMonth="valueMonth"
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
        descriptionSaldosFavores="Suma de Saldos a Favores de los Departamentos" 
        descriptionARecaudar="Saldo a recaudar Por Pagos" descriptionSaldoReserva="Saldo Anterior de Reserva" 
        descriptionPagos="Pagos a Realizar por Gastos" descriptionExtraordinarias="Detalle por Extraordinarias"
        :saldoReserva="edificio.saldo_anterior_fondo_edificio" descriptionDeudas="Deudas de Saldos Impagos Deptos"
        :pagos="(resultados.deuda_total-edificio.dif_saldo_pretencion_fondo_edificio)" :saldoARecaudar="resultados.suma_pagos_deptos"
        :deudas="Object.values(deptos).reduce((acc,value)=>{
          return acc+=value.deuda_depto}, 0)"
        :extraordinarias="otras_extraordinarias.reduce((acc,value)=>{
          return acc+=value.otra_extraordinaria}, 0)+edificio.dif_saldo_pretencion_fondo_edificio"
        :saldosFavores="Object.values(deptos).reduce((acc,value)=>{
          return acc+=value.new_saldo_favor}, 0)"
      />
      <depto-info-extra-vue :show_depto_info_extra="show_depto_info_extra" :cochera="cochera" :extraordinarias="otras_extraordinarias.reduce((acc,value)=>{
        return acc+=value.otra_extraordinaria}, 0)+edificio.dif_saldo_pretencion_fondo_edificio"
      />
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