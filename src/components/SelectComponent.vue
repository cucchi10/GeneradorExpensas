<template>
  <select class="form-select" aria-label="Default select example" :value="item" @change="selectDepto($event.target.value)">
    <option disabled>Selecciona un Depto</option>
    <template v-for="option in options" :key="option">
      <option :value="option">Depto N° {{ option }}</option>
    </template>
  </select>
</template>

<script setup>
import {defineEmits, defineProps} from 'vue';
const emit = defineEmits(['onSelectDepto'])
const selectDepto = (item)=>{
  if (item !== 'Selecciona un Depto'){ emit('onSelectDepto', item, 'onSelectDepto')}
}
defineProps({
  item: {
    type: String,
    default: 'Selecciona un Depto'
  },
  options:{
    type: Array,
    default() {
      return []
    }
  }
})
</script>

<style scoped>
option{
  color: black;
}
</style>