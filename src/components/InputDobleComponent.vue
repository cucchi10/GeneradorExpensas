<template>
  <div class="input-group mt-2">
    <div class="input-group-prepend">
      <span class="input-group-text">{{ descriptionValue }}</span>
    </div>
    <input type="number" class="form-control" aria-label="Amount (to the nearest dollar)" v-model="value" :disabled="datos_session">
  </div>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue';
import { ref } from "@vue/reactivity";
import { watch, onMounted } from "@vue/runtime-core";
const value = ref(0)

onMounted(()=>{
  if(props.item){
    value.value = props.item
  }
})
const props = defineProps({
  descriptionValue: String,
  item:{
    type: Number,
    default: null
  },
   datos_session:{
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['onChangeDoble'])
watch(value, (value)=>{
  emit('onChangeDoble',value)
})
</script>

<style lang="scss" scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>