<template>
  <div class="container-inputs mb-3">
    <label>{{ titleValue }}</label>
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">{{ descriptionValue }}</span>
      </div>
      <input lang="es" type="number" class="form-control" aria-label="Amount (to the nearest dollar)" :value="item" @input="sendItem($event.target.value,'onChange')" 
      :disabled="datos_session">
    </div>
    <input-doble-component-vue v-if="dobleComponent" @onChangeDoble="(value)=>sendItem(value,'onChangeDoble')"
      :descriptionValue="descriptionValueDoble" :item="itemDoble" :datos_session="datos_session"
    />
    <input-doble-component-text-vue v-if="dobleComponentText" @onChangeDobleText="(value)=>sendItem(value,'onChangeDobleText')"
      :descriptionValue="descriptionValueDobleText"
    />
  </div>
</template>+

<script setup>
import InputDobleComponentTextVue from './InputDobleComponentText.vue';
import InputDobleComponentVue from './InputDobleComponent.vue';
import {defineProps, defineEmits} from 'vue';

defineProps({
  item:{
    type: Number,
    default: 0
  },
  itemDoble:{
    type: Number,
    default: 0
  },
  itemText:{
    type: String,
    default: ''
  },
  titleValue: {
    type: String,
    default: 'Valor'
  },
  descriptionValue: {
    type: String,
    default: 'Valor'
  },
  dobleComponent:{
    type: Boolean,
    default: false,
  },
  dobleComponentText:{
    type: Boolean,
    default: false,
  },
  descriptionValueDoble:{
    type: String,
    default: 'Valor'
  },
  descriptionValueDobleText:{
    type: String,
    default: 'Valor'
  },
  datos_session:{
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['onChange', 'onChangeDoble' ,'onChangeDobleText'])

const sendItem =(item, typeEmit) => {
  if(typeEmit !== 'onChangeDobleText'){
    if(item === ''){
     emit(typeEmit,0)
    }else{
      emit(typeEmit,Number(item))
    }
  }else{
     emit(typeEmit,item)
  }
  
}
</script>

<style lang="scss" scoped>
.container-inputs{
  width: 350px;
}

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