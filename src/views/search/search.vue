<template>
  <transition name="fade">
    <div class="search">
      <search-box
              @query="onQueryChange"
              :tag-search="tagSearch"
              ref="searchBox"
              v-show="!tagSearch">
      </search-box>
      <div class="fixed-title" v-show="tagSearch">
        <span class="back" @click="back">
          <i class="icon-back"></i>
        </span>
        <span class="type">
          <span>关于{{query}}的电影</span>
        </span>
      </div>
      <div class="shortcut-wrapper" v-show="!query">
        <scroll class="shortcut"
                :before-scroll="beforeScroll"
                @before-scroll="listenScroll"
                ref="shortcut"
        >
          <div class="">
            <div class="tag-list">
              <div class="douban-tag tag">
                <span v-for="(item,index) in doubanTag" class="item-tag" @click="tagQuery(item)"
                      :key="index">{{item}}</span>
              </div>
              <div class="movie-tag tag">
                <span v-for="(item,index) in movieTag" class="item-tag" @click="tagQuery(item)"
                      :key="index">{{item}}</span>
              </div>
              <div class="country-tag tag">
                <span v-for="(item,index) in countryTag" class="item-tag" @click="tagQuery(item)"
                      :key="index">{{item}}</span>
              </div>
            </div>
            <div class="search-history">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="showConfirm">
                  <i class="icon-bin"></i>
                </span>
              </h1>
              <history-list :searches="searchHistory" @select="addQuery" @delete="deleteOne"></history-list>
            </div>
          </div>
        </scroll>
      </div>
      <div class="search-result" :class="{'tag-search': tagSearch}" v-show="query" ref="searchResult">
        <suggest :query="query" :tag-search="tagSearch" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
      </div>
      <confirm text="是否清空所有的搜索历史"
               confirmBtnText="清空"
               ref="confirm"
               @confirm="clearSearchHistory"
      ></confirm>
    </div>
  </transition>
</template>

<script>
  import SearchBox from 'components/common/search-box/search-box';
  import Suggest from "../suggest/suggest";
  import Scroll from "../../components/common/scroll/scroll";
  import HistoryList from "../../components/common/history-list/history-list";
  import { mapActions, mapGetters  } from 'vuex'
  import Confirm from "../../components/common/confirm/confirm";

  export default {
    name: "search",
    components: {Confirm, Suggest, HistoryList, Scroll, SearchBox},
    data() {
      return {
        query: '',
        doubanTag: ['经典', '豆瓣高分', '冷门佳片'],
        movieTag: ['剧情', '爱情', '喜剧', '科幻', '动作', '悬疑', '治愈', '青春', '文艺'],
        countryTag: ['日本', '韩国'],
        tagSearch: false,
        beforeScroll: true,
      }
    },
    computed: {
      ...mapGetters([
          'searchHistory'
      ])
    },
    mounted() {
      this.$nextTick(() => {
        this.focusInput();
      })
    },
    methods: {
      back() {
        this.tagSearch = false;
        this.query = ''
      },
      listenScroll() {
        this.blurInput();
      },
      onQueryChange(query) {
        this.query = query;
      },
      tagQuery(query) {
        this.tagSearch = true;
        this.query = query;
      },
      addQuery(query) {
        this.$refs.searchBox.setQuery(query);
      },
      saveSearch() {
        if (!this.tagSearch) {
          this.saveSearchHistory(this.query)
        }
      },
      deleteOne(item) {
        this.deleteSearchHistory(item)
      },
      blurInput() {
        this.$refs.searchBox.blur()
      },
      focusInput() {
        this.$refs.searchBox.focus()
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "~base/stylus/variable.styl"
  @import "~base/stylus/mixin.styl"
  .search
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    background-color: $color-background
    z-index: 500
    &.fade-enter-active,&.fade-leave-active
      transition: all 0.3s
    &.fade-enter,&.fade-leave-to
      opacity: 0
    .fixed-title
      border-bottom-1px($color-line)
      position: fixed
      top: 0
      width: 100%
      height: 50px
      z-index: 200
      background-color: $color-background
      .back
        position: absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: inline-block
          padding: 15px
          font-size: $font-size-large;
          color: $color-theme-f
      .type
        line-height: 50px
        padding-left:60px
        color: $color-text-f
    .shortcut-wrapper
      position: fixed
      width: 100%
      top: 50px
      background-color: $color-background
      .shortcut
        height: 100%
        overflow: hidden
        .tag-list
          padding:0 15px
          width: 90%
          .tag
            border-bottom-1px($color-line)
            padding: 20px 0
            &:last-child
              border-bottom-1px($color-theme-f)
            &.movie-tag
              .item-tag
                margin-bottom: 15px
            .item-tag
              display: inline-block
              border: 1px solid $color-theme-f
              padding: 8px 16px
              border-radius: 10px
              font-size: $font-size-medium
              color: $color-theme-f
              margin-right: 15px
      .search-history
        position: relative
        margin: 20px 20px 0 20px
        .title
          display: flex
          align-items: top
          height: 40px
          color: $color-theme-f
          font-size: $font-size-large
          .text
            flex: 1
          .clear
            extend-click()
            .icon-bin
              font-size: $font-size-large
              color: $color-theme-f
    .search-result
      position: fixed
      width: 100%
      top: 50px
      bottom: 0
      background: $color-background

</style>