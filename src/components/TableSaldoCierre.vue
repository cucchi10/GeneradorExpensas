<template>
  <div class="table table-responsive ">
    <table class="table table-striped table-bordered">
      <caption>Detalles Sobre Movimientos</caption>
    <thead>
      <tr class="table-headers">
        <th scope="col">Descripción</th>
        <th scope="col">Valor</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">{{ descriptionSaldoReserva }}</th>
        <td>{{ `$ ${saldoReserva.toFixed(2)}` }}</td>
      </tr>
      <tr>
        <th scope="row">{{ descriptionExtraordinarias }}</th>
        <td>{{ `$ ${extraordinarias.toFixed(2)}` }}</td>
      </tr>
      <tr>
        <th scope="row">{{ descriptionPagos }}</th>
        <td>{{ `$ ${pagos.toFixed(2)}` }}</td>
      </tr>
      <tr>
        <th scope="row">{{ descriptionARecaudar }}</th>
        <td>{{ `$ ${saldoARecaudar.toFixed(2)}` }}</td>
      </tr>
      <tr v-if="saldosFavores > 0">
        <th scope="row">{{ descriptionSaldosFavores }}</th>
        <td>{{ `$ ${saldosFavores.toFixed(2)}` }}</td>
      </tr>
      <tr>
        <th scope="row">{{ descriptionFinal }}</th>
        <td>{{ `$ ${saldoFinal.toFixed(2)}` }}</td>
      </tr>
      <tr class="table-results">
        <th scope="row">Dinero Real del Edificio</th>
        <th>{{ `$ ${(saldoFinal-saldosFavores).toFixed(2)}` }}</th>
      </tr>
      </tbody>
    </table>
</div>
</template>

<script setup>
import {defineProps} from 'vue';
defineProps({
  descriptionFinal: String,
  saldoFinal: Number,
  descriptionSaldosFavores: String,
  saldosFavores: Number,
  descriptionARecaudar:String,
  saldoARecaudar: Number,
  descriptionPagos: String,
  pagos: Number,
  descriptionExtraordinarias: String,
  extraordinarias: Number,
  descriptionSaldoReserva:String,
  saldoReserva:Number,
})
</script>

<style>

</style>