<script setup>
import {defineProps} from 'vue';

defineProps({
    gastos_habituales: Object,
    cochera: Object,
    otros_pagos: Array,
    otras_extraordinarias: Array,
    edificio: Object,
    resultados: Object,
  })
</script>

<template>
  <div class="table table-responsive ">
    <table class="table table-striped table-bordered">
      <caption>Gastos del Edificio</caption>
      <thead>
        <tr class="table-headers">
          <th scope="col">Item</th>
          <th scope="col">Descripcion</th>
          <th scope="col">Valor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="edificio.pretencion_fondo !== 0 && edificio.pretencion_fondo > edificio.saldo_anterior_fondo_edificio">
          <th scope="row">Fondo Reserva</th>
          <td>{{ `Saldo Anterior de Reserva $ ${edificio.saldo_anterior_fondo_edificio.toFixed(2)}. 
          Faltante para llegar a $  ${edificio.pretencion_fondo.toFixed(2)}` }}</td>
          <td>{{`$ ${edificio.dif_saldo_pretencion_fondo_edificio.toFixed(2)}`}}</td>
        </tr>
        <tr v-if="cochera.gastos_arba_cocheras !== 0">
          <th scope="row">ARBA Cocheras</th>
          <td>{{ `Impuesto Arba sobre cocheras $  ${cochera.gastos_arba_cocheras.toFixed(2)}` }}</td>
          <td>{{`$ ${cochera.gastos_arba_cocheras.toFixed(2)}`}}</td>
        </tr>
        <tr v-if="gastos_habituales.edenor !==0">
          <th scope="row">Edenor</th>
          <td>{{ `Servico de Luz partes comunes/cocheras $ ${gastos_habituales.edenor.toFixed(2)}` }}</td>
          <td>{{`$ ${gastos_habituales.edenor.toFixed(2)}`}}</td>
        </tr>
        <tr v-if="gastos_habituales.aysa !==0">
          <th scope="row">Aysa</th>
          <td>{{ `Servicio de Agua $ ${gastos_habituales.aysa.toFixed(2)}` }}</td>
          <td>{{`$ ${gastos_habituales.aysa.toFixed(2)}`}}</td>
        </tr>
        <tr v-if="gastos_habituales.v_lopez_abl !==0">
          <th scope="row">V.Lopez</th>
          <td>{{ `Impuesto V.Lopez $ ${gastos_habituales.v_lopez_abl.toFixed(2)}` }}</td>
          <td>{{`$ ${gastos_habituales.v_lopez_abl.toFixed(2)}`}}</td>
        </tr>
        <tr v-if="gastos_habituales.limpieza !==0">
          <th scope="row">Personal Limpieza</th>
          <td>{{ `Personal Limpieza $ ${gastos_habituales.limpieza.toFixed(2)}` }}</td>
          <td>{{`$ ${gastos_habituales.limpieza.toFixed(2)}`}}</td>
        </tr>
        <tr v-for="(otro_pago ,index) in otros_pagos" :key="index">
          <template v-if="otro_pago.otro_pago !==0">
            <th scope="row">{{`Otro Pago N° ${index+1}`}}</th>
            <td>{{ otro_pago?.description || `Otro Pago N° ${index+1}`}}</td>
            <td>{{`$ ${otro_pago.otro_pago.toFixed(2)}`}}</td>
          </template>
        </tr>
        <tr v-for="(otra_extraordinaria ,index) in otras_extraordinarias" :key="index">
          <template v-if="otra_extraordinaria.otra_extraordinaria !==0">
            <th scope="row">{{`Extraordinaria N° ${index+1}`}}</th>
            <td>{{ otra_extraordinaria?.description || `Extraordinaria N° ${index+1}`}}</td>
            <td>{{`$ ${otra_extraordinaria.otra_extraordinaria.toFixed(2)}`}}</td>
          </template>
        </tr>
        <tr class="table-results">
          <th scope="row">Total</th>
          <td></td>
          <th>{{`$ ${resultados.deuda_total.toFixed(2)}`}}</th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
</style>