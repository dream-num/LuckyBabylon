<!-- app.vue -->
<template>
  <div id="app">
    <model></model>
  </div>
</template>

<script>
  import model from '@/master/3dModel'
  export default {
    name: 'app',
    components: {
      model
    }
  }
</script>

<style scoped>
/* #app {
} */
</style>