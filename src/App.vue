<script setup>
import ExpenasVue from './views/Expenas.vue';
import HeaderVue from './components/Header.vue';
import FooterVue from './components/Footer.vue';

import SpinnerLoaderVue from './components/SpinnerLoader.vue';
import useStorage from './composable/useStorage';
const {Loader,setLoader} = useStorage()
</script>

<template>
  <spinner-loader-vue v-if="Loader"/>
  <header-vue />
  <div class="dark">
    <div class="container">
    <expenas-vue @setLoaderEmit="setLoader"/>
  </div>
  </div>
  <footer-vue/>
</template>

<style>
</style>
