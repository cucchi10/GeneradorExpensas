<template>
  <div v-if="Object.values(show_depto_info_extra).length">
      <div class="table table-responsive ">
        <table class="table table-striped table-bordered">
          <caption>{{ ` Detalle de ${show_depto_info_extra.index.replace('_', ' ')}` }}</caption>
          <thead>
            <tr class="table-headers">
              <th scope="col">Descripción</th>

              <th scope="col">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Superficie Depto</th>
              <td>{{ `${show_depto_info_extra.superficie} %` }}</td>
            </tr>
            <tr v-if="Object.values(cochera).length && cochera?.gastos_arba_cocheras !==0">
              <th scope="row">Superficie Cochera</th>
              <td>{{ `${cochera.superficie.toFixed(2)} %` }}</td>
            </tr>
            <tr>
              <th scope="row">Deuda Anterior</th>
              <td>{{ `$ ${show_depto_info_extra.deuda_depto.toFixed(2)}` }}</td>
            </tr>
            <tr>
              <th scope="row">Saldo a Favor Anterior</th>
              <td>{{ `$ ${show_depto_info_extra.saldo_favor.toFixed(2)}` }}</td>
            </tr>
            <tr>
              <th scope="row">{{ `A Pagar por ${show_depto_info_extra.superficie} % de Superficie Departamento` }}</th>
              <td>{{`$ ${show_depto_info_extra.a_pagar.toFixed(2)}`}}</td>
            </tr>
            <tr v-if="Object.values(cochera).length && cochera?.gastos_arba_cocheras !==0">
              <th scope="row">{{ `A Pagar por ${cochera.superficie.toFixed(2)} % de Superficie Cochera` }}</th>
              <td>{{`$ ${cochera.a_pagar_por_cochera.toFixed(2)}`}}</td>
            </tr>
            <tr v-if="show_depto_info_extra.new_saldo_favor !== 0" >
              <th scope="row">Nuevo Saldo a Favor <small>-- Sobrante del Saldo a Favor Anterior --</small></th>
              <td>{{ `$ ${show_depto_info_extra.new_saldo_favor.toFixed(2)}` }}</td>
            </tr>
            <tr class="table-results">
              <th scope="row">Total a Abonar</th>
              <th>{{ `$ ${show_depto_info_extra.a_pagar_total.toFixed(2)}` }}</th>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
</template>

<script setup>
defineProps({
  show_depto_info_extra: {
    type: Object,
    default(){
      return {}
    }
  },
  cochera:{
    type: Object,
    default(){
      return {}
    }
  },
})
</script>

<style>

</style>