<template>
  <div class="container-inputs mb-3">
    <label>{{ titleValue }}</label>
    <select-component-vue class="mb-2" v-if="selectComponent" :item="itemDepto" :options="array_deptos" 
    @onSelectDepto="(value, typeEmit)=>sendItem(value,typeEmit)"></select-component-vue>
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">{{ descriptionValue }}</span>
      </div>
      <input type="text" class="form-control" :value="item" @input="sendItem($event.target.value,'onChange')" 
      :disabled="datos_session">
    </div>
    <input-doble-component-vue v-if="dobleComponent" @onChangeDoble="(value, typeEmit)=>sendItem(value,typeEmit)"
      :descriptionValue="descriptionValueDoble" :item="itemDoble" :datos_session="datos_session"
    />
    <input-doble-component-text-vue v-if="dobleComponentText" @onChangeDobleText="(value, typeEmit)=>sendItem(value,typeEmit)"
      :descriptionValue="descriptionValueDobleText"
    />
     <div class="mt-2">
      <slot name="innerInput"></slot>
     </div>
  </div>
</template>

<script setup>
import InputDobleComponentTextVue from './InputDobleComponentText.vue';
import InputDobleComponentVue from './InputDobleComponent.vue';
import SelectComponentVue from './SelectComponent.vue';
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
  },
  selectComponent:{
    type: Boolean,
    default: false,
  },
  itemDepto:{
    type: String,
    default: 'Selecciona un Depto'
  },
  array_deptos:{
    type: Array,
    default() {
      return []
    }
  }
})
const emit = defineEmits(['onChange', 'onChangeDoble' ,'onChangeDobleText', 'onSelectDepto'])

const sendItem =(item, typeEmit) => {
  if(typeEmit !== 'onChangeDobleText' && typeEmit !== 'onSelectDepto'){
    let number = Number(item)
    if(!number){
     emit(typeEmit,0)
    }else{
      emit(typeEmit,number)
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