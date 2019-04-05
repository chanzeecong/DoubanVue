<template>
  <div class="history-list">
    <ul>
      <li :key="item" @click="selectItem(item)" class="history-item" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-close"></i>
        </span>
      </li>
    </ul>
    <div class="no-history" v-show="!searches.length">还没有任何的搜索记录哟~</div>
  </div>
</template>

<script>
  export default {
    name: "history-list",
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select',item)
      },
      deleteOne(item) {
        this.$emit('delete',item)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~base/stylus/variable.styl"
  @import "~base/stylus/mixin.styl"
  .history-list
    .history-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      .text
        flex: 1
        font-size: $font-size-medium
        .icon
          extend-click()
          .icon-close
            font-size: $font-size-small
            color: $color-text-f
  .no-history
    width: 100%
    text-align: center
    margin-top: 10px
</style>