<template>
  <div class="input-group mt-2">
    <div class="input-group-prepend">
      <span class="input-group-text">{{ descriptionValue }}</span>
    </div>
    <input type="number" class="form-control" aria-label="Amount (to the nearest dollar)" :value="item" @input="sendItem($event.target.value)"
     :disabled="datos_session">
  </div>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue';

defineProps({
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
const sendItem =(item) => {
  if(item === ''){
     emit('onChangeDoble',0,'onChangeDoble')
  }else{
    emit('onChangeDoble',Number(item),'onChangeDoble')
  }
}
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