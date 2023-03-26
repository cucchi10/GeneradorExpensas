<template>
  <div class="d-flex justify-content-center">
    <div class="form-check">
    <input class="form-check-input" type="radio" :name="index" :id="index" :checked="checked" disabled style="opacity: 1 !important;">
    <label class="form-check-label" :for="index">
      {{ titleValue }}
    </label>
  </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue';
defineProps({
  titleValue: {
    type: String,
    default: 'Valor'
  },
   checked:{
    type: Boolean,
    default: false
  },
  index:{
    type: String,
    default: '00'
  }
})
</script>

<style></style>