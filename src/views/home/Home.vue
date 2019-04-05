<template>
  <div class="home">
    <move-show/>
  </div>

</template>

<script>
  import MoveShow from "./childComps/Move-show";


  export default {
    name: "Home",
    components: {
      MoveShow,
    },
  }
</script>

<style scoped>

</style>