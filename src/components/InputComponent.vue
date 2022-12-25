<template>
  <div class="container-inputs mb-3">
    <label>{{ titleValue }}</label>
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">{{ descriptionValue }}</span>
      </div>
      <input lang="es" type="number" class="form-control" aria-label="Amount (to the nearest dollar)" v-model="value" :disabled="datos_session">
    </div>
    <input-doble-component-vue v-if="dobleComponent" @onChangeDoble="(value)=>secondValue=value"
      :descriptionValue="descriptionValueDoble" :item="itemDoble" :datos_session="datos_session"
    />
    <input-doble-component-text-vue v-if="dobleComponentText" @onChangeDobleText="(value)=>textValue=value"
      :descriptionValue="descriptionValueDobleText"
    />
  </div>
</template>

<script setup>
import InputDobleComponentTextVue from './InputDobleComponentText.vue';
import InputDobleComponentVue from './InputDobleComponent.vue';
import {defineProps, defineEmits} from 'vue';
import { ref } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
const value = ref(0)
const secondValue = ref(0)
const textValue = ref('')

onMounted(()=>{
  if(props.item){
    value.value = props.item
  }
})

const props = defineProps({
  item:{
    type: Number,
    default: null
  },
  itemDoble:{
    type: Number,
    default: null
  },
  itemText:{
    type: String,
    default: null
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
watch(value, (value)=>{
  if(value === ''){
     emit('onChange',0)
  }else{
    emit('onChange',value)
  }
  
})
watch(secondValue, (secondValue)=>{
  if(secondValue === ''){
     emit('onChangeDoble',0)
  }else{
    emit('onChangeDoble',secondValue)
  }
  
})
watch(textValue, (textValue)=>{
  emit('onChangeDobleText',textValue)
})
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