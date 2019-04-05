<template>
  <div id="app">
    <keep-alive exclude="movieDetail,search,celebrity">
    </keep-alive>
    <router-view @has-load="loadingFlag"></router-view>
    <tab-bar></tab-bar>
  </div>
</template>

<script>
  import TabBar from "components/content/tabbar/TabBar";
  export default {
    components: {
      TabBar
    },
    data() {
      return {
        loadingFlag: false
      }
    },
    methods: {
      hasLoad() {
        this.loadingFlag = true;
      }
    }

  };
</script>

<style scoped lang="stylus">

</style>
