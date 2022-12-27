<template>
  <select class="form-select" aria-label="Default select example" :value="item" @change="selectValueMonth($event.target.value)" :disabled="datos_session">
    <option disabled>Seleccione un Mes</option>
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
import {defineEmits, defineProps} from 'vue';
const emit = defineEmits(['setValueMonth'])
const selectValueMonth = (item)=>{
  emit('setValueMonth', item)
}
defineProps({
  item: {
    type: String,
    default: null
  },
  datos_session:{
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
option{
  color: black;
}
</style>