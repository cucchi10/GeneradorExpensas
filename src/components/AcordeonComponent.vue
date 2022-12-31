<template>
  <div class="accordion" :id="idAccordion">
    <div class="accordion-item">
      <h2 class="accordion-header" :id="idHeading">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="`#${idCollapse}`" aria-expanded="true" 
        :aria-controls="idCollapse">
        <h3 class="text-center"> {{ title }}</h3>
        </button>
      </h2>
      <div :id="idCollapse" class="accordion-collapse collapse show" :aria-labelledby="idHeading" :data-bs-parent="`#${idAccordion}`">
        <div class="accordion-body d-flex justify-content-around align-items-center flex-wrap">
          <slot name="inner"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue';

defineProps({
  title: String,
  idAccordion:{
    type: String,
    default: 'accordionExample'
  },
  idHeading:{
    type: String,
    default: 'headingOne'
  },
  idCollapse:{
    type: String,
    default: 'collapseOne'
  },
})
</script>

<style>
.accordion{
  background-color: transparent !important;
}

</style>
