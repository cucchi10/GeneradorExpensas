<template>
  <div class="input-group mt-2">
    <div class="input-group-prepend">
      <span class="input-group-text">{{ descriptionValue }}</span>
    </div>
    <input type="text" class="form-control" :value="item" @input="sendItem($event.target.value)">
  </div>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue';
defineProps({
  descriptionValue: String,
  item:{
    type: String,
    default: null
  }
})
const emit = defineEmits(['onChangeDobleText'])
const sendItem =(item) => {
  emit('onChangeDobleText',item,'onChangeDobleText')
}
</script>

<style lang="scss" scoped>
</style>