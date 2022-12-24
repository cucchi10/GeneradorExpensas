<template>
  <div class="accordion" id="accordionExample">
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        <h3 class="text-center"> {{ title }}</h3>
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
        <div class="accordion-body d-flex justify-content-around align-items-center flex-wrap">
          <template v v-for="depto, index in Object.keys(deptos)" :key="index">
            <input-component-vue :titleValue="`Depto N° ${depto.replace('_',' ')}`" descriptionValue="Pago $"
            @onChange="(value)=>SendPago(value,depto,index, deptos)" 
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputComponentVue from "./InputComponent.vue";
import {defineProps} from 'vue';

defineProps({
  title: String,
  deptos: Object,
})
const emit = defineEmits(['onSendPago'])
const SendPago = (value, depto,index,deptos)=>{
   if(value === ''){
      emit('onSendPago',0, depto,index,deptos)
  }else{
     emit('onSendPago',value, depto,index,deptos)
  }
}

</script>

<style>
.accordion{
  background-color: transparent !important;
}

</style>
