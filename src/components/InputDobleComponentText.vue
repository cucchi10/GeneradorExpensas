<template>
  <div class="input-group mt-2">
    <div class="input-group-prepend">
      <span class="input-group-text">{{ descriptionValue }}</span>
    </div>
    <input type="text" class="form-control"  v-model="value">
  </div>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue';
import { ref } from "@vue/reactivity";
import { watch, onMounted } from "@vue/runtime-core";
const value = ref('')

onMounted(()=>{
  if(props.item){
    value.value = props.item
  }
})
const props = defineProps({
  descriptionValue: String,
  item:{
    type: String,
    default: null
  }
})
const emit = defineEmits(['onChangeDobleText'])
watch(value, (value)=>{
  emit('onChangeDobleText',value)
})
</script>

<style lang="scss" scoped>
</style>