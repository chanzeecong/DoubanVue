<template>
  <transition name="slide">
    <div class="info-wrapper" v-show="showFlag">
      <div class="fixed-title">
        <span class="back" @click="close">
          <i class="icon-close"></i>
        </span>
        <span class="type">
          影人简介
        </span>
      </div>
      <scroll class="celebrity-info" ref="scroll">
        <div class="scroll-wrapper">
          <h1 class="name">{{infoLists.name}}</h1>
          <h1 class="name_en">{{infoLists.name_en}}</h1>
          <div class="info-lists">
            <div class="gender">
              <span class="item">性别:</span>
              <span>{{infoLists.gender ? infoLists.gender : '暂无信息'}}</span>
            </div>
            <div class="constellation">
              <span class="item">星座:</span>
              <span>{{infoLists.constellation ? infoLists.constellation : '暂无信息'}}</span>
            </div>
            <div class="birthday">
              <span class="item">出生日期:</span>
              <span>{{infoLists.birthday ? infoLists.birthday : '暂无信息'}}</span>
            </div>
            <div class="born_place">
              <span class="item">出生地:</span>
              <span>{{infoLists.born_place ? infoLists.born_place : '暂无信息'}}</span>
            </div>
            <div class="more-name">
              <span class="item">别名:</span>
              <span class="more">{{getName(infoLists.aka)}}</span>
          </div>
          </div>
          <p class="summary">{{infoLists.summary}}</p>
        </div>
      </scroll>
      <loadmore></loadmore>
    </div>
  </transition>
</template>

<script>
  import Scroll from "components/common/scroll/scroll";
  import Loadmore from "components/common/loadmore/loadmore";
  export default {
    name: "celebrity-info",
    components: {Loadmore, Scroll},
    props: {
      infoLists: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      close() {
        this.showFlag = false;
      },
      show() {
        this.showFlag = true;
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        })
      },
      getName(lists){
        if (!lists || lists.length ===0 || lists[0] === '') {
          return '暂无信息'
        }
        return lists.join('/')
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~base/stylus/variable.styl"
  @import "~base/stylus/mixin.styl"
  .info-wrapper
    position: fixed
    top: 0
    width: 100%
    bottom: 0
    z-index: 500
    background-color: $color-background
  &.slide-enter-active,&.slide-leave-active
    transition: all 0.3s
  &.slide-enter,&.slide-leave-to
    transform: translate3d(0, 100%, 0)
  .fixed-title
    position: fixed
    top: 0
    width: 100%
    height: 40px
    z-index: 100
    text-align: center
    color: $color-text-f
    background-color: $color-background
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-close
        display: block
        padding: 11px
        font-size: $font-size-large
    .type
      display: inline-block
      padding-top: 12px
      font-size: $font-size-medium-x
  .celebrity-info
    position: fixed
    top: 0
    width: 100%
    bottom: 0
    .scroll-wrapper
      padding: 50px 20px 10px 20px
      color: $color-text-f
      .name
        margin-top: 30px
        font-size: $font-size-large
        font-weight: 600
      .name-en
        margin-top: 10px
        font-size: $font-size-small
      .info-lists
        padding: 20px 0
        font-size: $font-size-medium
        div
          line-height: 25px
          font-size: 0
          span
            vertical-align: middle
            font-size: $font-size-medium
          .item
            display: inline-block
            width: 80px
        .more-name
          display: flex
          align-items: top
          .item
            flex: 80px 0 0
            width: 80px
          .more
            flex: 1
      .summary
        font-size: $font-size-medium
        line-height: 22px
</style>