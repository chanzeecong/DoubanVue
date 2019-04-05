<template>
  <div class="rank-list">
    <ul>
      <li v-for="(item,index) in rankItems" class="rank-item" @click.stop="selectItem(item,$event)" :class="{'compact':!needRank}">
        <div class="rank-rating" v-show="needRank">
          <div class="line"></div>
          <span class="text">{{page * 50 + (index + 1)}}</span>
        </div>
        <div class="rank-info" :class="{'compact': !needRank}">
          <div class="info-img">
            <img v-lazy="replaceUrl(item.image)" alt="" height="100" width="70">
          </div>
          <div class="info-desc">
            <p class="title">{{item.title}}</p>
            <star :size="24" :score="item.rating" :showScore="showScore"></star>
            <div class="directors">导演:{{item.director}}</div>
            <div class="casts">主演:{{item.casts}}</div>
          </div>
        </div>
      </li>
    </ul>
    <loadmore :hasMore="hasMore" v-show="rankItems.length && needLoading"></loadmore>
  </div>
</template>

<script>
  import Star from "components/common/star/star";
  import Loadmore from "components/common/loadmore/loadmore";
  export default {
    name: "rank-list",
    components: {Loadmore, Star},
    props: {
      rankItems: {
        type: Array ,
        default:[]
      },
      page: {
        type: Number,
        default: 0
      },
      hasMore: {
        type: Boolean,
        default: false
      },
      needRank: {
        type: Boolean,
        default: true
      },
      needLoading: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        showScore: true
      }
    },
    methods: {
      replaceUrl(srcUrl) {
        if (srcUrl !== undefined) { // 图片防盗链处理
          return ('https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, ''));
        }
      },
      selectItem(movie) {
        if (!event._constructed) {
          return;
        }
        this.$emit('select',movie)
      }
    },
  }
</script>

<style scoped lang="stylus">
  @import "~base/stylus/variable.styl"
  @import "~base/stylus/mixin.styl"
  .rank-item
    padding-top: 30px
    &.compact
      padding-top: 0
    .rank-rating
      position: relative
      margin: 30px auto
      text-align: center
      height: 10px
      width: 50%
      .line
        border-bottom-1px(#ccc)
      .text
        padding-top: 0 10px
        display: inline-block
        background-color: $color-background
        position: absolute
        left: 50%
        top: -8px
        transform:translateX(-50%)
        font-size: $font-size-large
        color: $color-theme-f
    .rank-info
      display: flex
      align-items: top
      box-sizing: border-box
      height: 130px
      padding: 15px
      border: 1px solid $color-line
      &.compact
        border: 0
        border-bottom-1px($color-line)
      .info-img
        flex: 70px 0 0
        margin-right: 10px
      .info-desc
        flex: 1
        box-sizing: border-box
        height: 100px
        padding-bottom: 20px
        display: flex
        flex-direction: column
        justify-content: space-around
        overflow: hidden
        .title
          font-size: $font-size-medium-x
          color: $color-text-f
        .directors
          font-size:$font-size-small
        .casts
          font-size:$font-size-small
          no-wrap()
    &:last-child
      margin-bottom: 30px
</style>