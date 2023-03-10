<template>
  <select class="form-select" aria-label="Default select example" :value="item" @change="selectItem($event.target.value)">
    <option disabled>Selecciona numero de cuota</option>
    <template v-for="option in options" :key="option">
      <option :value="option">Cuota N° {{ option }} de 5</option>
    </template>
  </select>
</template>

<script setup>
import {defineEmits, defineProps} from 'vue';
const emit = defineEmits(['onSelectArbaCuota'])
const selectItem = (item)=>{
  if (item !== 'Selecciona numero de cuota'){ emit('onSelectArbaCuota', item)}
}
defineProps({
  item: {
    type: String,
    default: 'Selecciona numero de cuota'
  },
  options:{
    type: Array,
    default() {
      return ['1', '2', '3', '4', '5']
    }
  }
})
</script>

<style scoped>
option{
  color: black;
}
</style>