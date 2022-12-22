<template>
  <select class="form-select" aria-label="Default select example" v-model="valueMonth" @change="selectValueMonth(valueMonth)">
    <option disabled>{{ valueMonth }}</option>
    <option value="Enero">Enero</option>
    <option value="Febrero">Febrero</option>
    <option value="Marzo">Marzo</option>
    <option value="Abril">Abril</option>
    <option value="Mayo">Mayo</option>
    <option value="Junio">Junio</option>
    <option value="Julio">Julio</option>
    <option value="Agosto">Agosto</option>
    <option value="Septiembre">Septiembre</option>
    <option value="Octubre">Octubre</option>
    <option value="Noviembre">Noviembre</option>
    <option value="Diciembre">Diciembre</option>
  </select>
</template>

<script setup>
import useExpensas from '../composable/useExpensas.js';
const emit = defineEmits(['setValueMonth'])
const {valueMonth, selectValueMonth} = useExpensas(emit)
</script>

<style scoped>
option{
  color: black;
}
</style>