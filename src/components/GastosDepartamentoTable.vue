<script setup>
import {defineProps, defineEmits} from 'vue';
import useExpensas from '../composable/useExpensas.js';
defineProps({
    cochera: Object,
    deptos: Object,
    resultados: Object,
  })
const emit = defineEmits(['showDeptoSelect'])
const {checkNewSaldo, selectDepto} = useExpensas(emit)
</script>

<template>
  <div class="form-check position-relative">
  <div class="table table-responsive ">
    <table class="table table-striped table-bordered">
      <caption>Calculo de pago para Deptos</caption>
      <thead>
        <tr class="table-headers">
          <th scope="col">Depto</th>
          <th scope="col">Deuda</th>
          <th scope="col">Saldo Favor</th>
          <th scope="col">Superficie Depto</th>
          <th scope="col">A Pagar Depto</th>
          <th v-if="cochera.gastos_arba_cocheras !==0" scope="col">Superficie Cochera</th>
          <th v-if="cochera.gastos_arba_cocheras !==0" scope="col">A Pagar Cochera</th>
          <th v-if="Object.values(deptos).some(checkNewSaldo)" scope="col">Nuevo Saldo a Favor</th>
          <th scope="col">Total a Pagar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(depto ,index) in deptos" :key="index" >
          <th scope="row"><input class="form-check-input position-absolute ckeck-item-depto" type="radio" name="flexRadioDefault" 
            @click="selectDepto(depto,index)">
            {{`Depto N° ${index}` }}</th>
          <td>{{ `$ ${depto.deuda_depto}` }}</td>
          <td>{{ `$ ${depto.saldo_favor}` }}</td>
          <td>{{ `Superficie ${depto.superficie} %` }}</td>
          <td>{{`$ ${depto.a_pagar.toFixed(2)}`}}</td>
          <td v-if="cochera.gastos_arba_cocheras !==0">{{ `Superficie ${cochera.superficie.toFixed(2)} %` }}</td>
          <td v-if="cochera.gastos_arba_cocheras !==0">{{`$ ${cochera.a_pagar_por_cochera.toFixed(2)}`}}</td>
          <td v-if="Object.values(deptos).some(checkNewSaldo)">{{ `$ ${depto.new_saldo_favor.toFixed(2)}` }}</td>
          <td>{{`$ ${depto.a_pagar_total.toFixed(2)}`}}</td>
        </tr>
        <tr class="table-results">
          <th scope="row">Total</th>
          <td>{{ `$ ${Object.values(deptos).reduce((acc,value)=>{
          return acc+=value.deuda_depto}, 0).toFixed(2)}` }}</td>
          <td>{{ `$ ${Object.values(deptos).reduce((acc,value)=>{
          return acc+=value.saldo_favor}, 0).toFixed(2)}` }}</td>
          <td>{{ `Superficie ${resultados.superficie_deptos} %` }}</td>
          <td>{{ `$ ${resultados.deuda_deptos.toFixed(2)}` }}</td>
          <td v-if="cochera.gastos_arba_cocheras !==0">{{`Superficie ${resultados.superficie_cochera} %`}}</td>
          <td v-if="cochera.gastos_arba_cocheras !==0">{{ `$ ${cochera.gastos_arba_cocheras.toFixed(2)}` }}</td>
          <td v-if="Object.values(deptos).some(checkNewSaldo)">{{ `$ ${Object.values(deptos).reduce((acc,value)=>{
          return acc+=value.new_saldo_favor}, 0).toFixed(2)}` }}</td>
          <th>{{`$ ${resultados.suma_pagos_deptos.toFixed(2)}`}}</th>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form-check{
padding-left: 0 !important;
}
.ckeck-item-depto{
  left: 0%;
  transform: translateX(-0%)
}
</style>