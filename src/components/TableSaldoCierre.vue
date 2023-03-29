<template>
  <div class="table table-responsive ">
    <table class="table table-striped table-bordered" id="PlanillaDetalles" ref="PlanillaDetalles">
      <caption>Detalles Sobre Movimientos</caption>
    <thead>
      <tr class="table-headers">
        <th scope="col">Descripción</th>
        <th scope="col">Valor</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Saldo Anterior de Reserva</th>
        <td>{{ `$ ${saldoReserva.toFixed(2)}` }}</td>
      </tr>
      <tr>
        <th scope="row">Detalle por Extraordinarias</th>
        <td>{{ `$ ${extraordinarias.toFixed(2)}` }}</td>
      </tr>
      <tr>
        <th scope="row">Pagos a Realizar por Gastos</th>
        <td>{{ `$ ${pagos.toFixed(2)}` }}</td>
      </tr>
      <tr>
        <th scope="row">Saldo a recaudar Por Pagos</th>
        <td>{{ `$ ${saldoARecaudar.toFixed(2)}` }}</td>
      </tr>
      <tr v-if="deudas > 0">
        <th scope="row">Deudas de Saldos Impagos Deptos</th>
        <td>{{ `$ ${deudas.toFixed(2)}` }}</td>
      </tr>
      <tr v-if="saldosFavores > 0">
        <th scope="row">Suma de Saldos a Favores de los Departamentos</th>
        <td>{{ `$ ${saldosFavores.toFixed(2)}` }}</td>
      </tr>
      <tr>
        <th scope="row">Saldo al cierre de Caja</th>
        <td>{{ `$ ${saldoFinal.toFixed(2)}` }}</td>
      </tr>
      <tr class="table-results">
        <th scope="row">Dinero Real del Edificio | <small style="font-size: .5em">Se Descuenta Saldos Favores, Deudas Impagas y Gastos Individual de Deptos</small></th>
        <th>{{ `$ ${(saldoFinal-saldosFavores-deudas).toFixed(2)}` }}</th>
      </tr>
      </tbody>
    </table>
</div>
</template>

<script setup>
import {defineProps} from 'vue';
defineProps({
  saldoFinal: Number,
  saldosFavores: Number,
  saldoARecaudar: Number,
  pagos: Number,
  extraordinarias: Number,
  saldoReserva:Number,
  deudas:Number,
})
</script>

<style>

</style>