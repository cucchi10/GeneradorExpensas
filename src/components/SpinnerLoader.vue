<template>
  <div class="loading-indicator">
    <div class="spinner"> </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.loading-indicator {
  position: fixed;
  z-index: 10003;
  inset: 0;
  background-color: rgba(104, 103, 103, 0.9);
  display: grid;
  place-items: center;
}
/* .content-spinner{
  display: flex;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
} */
.spinner{
  /* border: 4px solid rgba(0,0,0,.1); */
  /* border-left-color: #65c178; */
  width: 150px;
  height: 150px;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.spinner::before,
.spinner::after{
  content: '';
  position: absolute;
  border-radius: inherit;
}

.spinner::before{
  width: 100%;
  height: 100%;
  background-image: linear-gradient(0deg, #f0c 0%, #90f 100%);
}

.spinner::after{
  width: 80%;
  height: 80%;
  background: rgba(104, 103, 103, 0.9);
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

@keyframes spin {
  to{
    transform: rotate(360deg);
  }
}
</style>