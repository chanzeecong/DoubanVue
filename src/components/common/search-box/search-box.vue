<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" class="box" :placeholder="placeholder" v-model="query" ref="query">
    <span class="cancel" @click="back">取消</span>
  </div>
</template>

<script>
  export default {
    name: "search-box",
    props: {
      placeholder: {
        type: String,
        default: '搜索电影/影人'
      },
      tagSearch: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      back() {
        this.$router.back()
      },
      setQuery(query) {
        this.query = query;
      },
      clear() {
        this.query = '';
      },
      blur() {
        this.$refs.query.blur();
      },
      focus() {
        this.$refs.query.focus();
      }
    },
    watch: {
      query(newquery) {
        if (!this.tagSearch) {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.$emit('query',newquery)
          },200);
        } else {
          this.$emit('query',newquery)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~base/stylus/variable.styl"
  .search-box
    box-sizing: border-box
    width: 100%
    height: 50px
    display: flex
    align-items: center
    padding: 10px 0 10px 20px
    background-color: $color-theme-f
    .icon-search
      position: absolute
      top: 18px
      left: 28px
      font-size:$font-size-medium
      color: $color-text
    .box
      flex: 75% 0 0
      padding-left: 35px
      height: 30px
      line-height: 30px
      border-radius: 5px
      background: $color-background
      color: $color-text
      font-size: $font-size-medium
      caret-color: $color-theme-f
      &::placeholder
        color: $color-text
    .cancel
      flex: 1
      text-align: center
      font-size: 16px
      color: $color-background
</style>