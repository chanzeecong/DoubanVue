<template>
  <div class="suggest-wrapper">
    <div class="to-top" @click="toTop" v-show="result.length">
      <span>返回顶部</span>
    </div>
    <scroll class="suggest"
            :data="result"
            :pullup="pullup"
            :before-scroll="beforeScroll"
            @before-scroll="listScroll"
            @scrollToEnd="searchMore"
            ref="suggest">
      <ul class="suggest-list">
        <li class="suggest-item" v-for="item in result" v-if="item.subtype !== 'tv'" @click="selectItem(item)">
          <div class="item-pic">
            <img :src="replaceUrl(item.image)" width="50" height="70">
          </div>
          <div class="item-info">
            <div class="title">{{item.title}}</div>
            <div class="info">
              <span class="rating">{{getRating(item.rating)}}</span>
              <span class="pubdate">{{getPubdate(item.pubdates)}}</span>
            </div>
          </div>
        </li>
        <loadmore :has-more="hasMore" v-if="result.length"></loadmore>
      </ul>
      <div class="no-result" v-if="noResult">没有搜索结果啦ε=(´ο｀*)))</div>
      <loadmore :full-screen="fullScreen" v-if="!result.length && !noResult"></loadmore>
    </scroll>
  </div>
</template>

<script>

  import Scroll from "components/common/scroll/scroll";
  import {movieSearch,tagSearch} from "../../network/movie-search";
  import {createSearchList} from "../../components/common/js/moveList";
  import { mapMutations } from 'vuex';
  import Loadmore from "../../components/common/loadmore/loadmore";

  const SEARCH_MORE = 20;
  export default {
    name: "suggest",
    components: {Loadmore, Scroll},
    props: {
      query: {
        type: String,
        default: ''
      },
      tagSearch: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        searchIndex: 0,
        result: [],
        pullup: true,
        hasMore: true,
        beforeScroll: true,
        loadingFlag: true,
        fullScreen: true,
        dataFn: null,
        noResult: false
      }
    },
    created() {
      this._selectType();
    },
    methods: {
      toTop() {
        this.$refs.suggest.scrollTo(0,0,500)
      },
      selectItem(item) {
        this.$router.push({
          path:`movie/${item.item}`
        });
        this.setMovie(item);
        this.$emit('select');
      },
      search(){
        this.result = [];
        this.hasMore = true;
        this.loadingFlag = true;
        this.searchIndex = 0; // 变更搜索内容时重置
        this.$refs.suggest.scrollTo(0, 0); // 回滚到顶部
        this.dataFn(this.query,this.searchIndex,SEARCH_MORE).then((res) => {
          const queryRet = res.title.split('"');
          if (this.query !== queryRet[1]) {
            console.log('old request + 1', queryRet[1]);
            return; // 舍弃过时的请求
          }
          if (!res.subjects.length) {
            this.noResult = true;
          } else {
            this.noResult = false;
          }
          this.result = createSearchList(res.subjects);
          this._checkMore(res);
        })
      },
      listScroll() {
        this.$emit('listScroll')
      },
      getPubdate(date) {
        let pubdate = '';
        for (let i = 0; i< date.length;i++) {
          if (date[i].indexOf('电影节') === -1) {
            pubdate = date[i];
          }
          if (date[i].indexOf('中国大陆') > -1) {
            pubdate = date[i];
            break;
          }
        }
        if (!pubdate) {
          return ''
        }
        return '/' + pubdate
      },
      getRating(rate) {
        if (rate === 0) {
          return '暂无评分'
        }
        return rate + '分'
      },
      replaceUrl(srcUrl) {
        if (srcUrl !== undefined) { // 图片防盗链处理
          return ('https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, ''));
        }
      },
      _checkMore(data) {
        let movies = data.subjects;
        if (!movies.length || data.star + data.count >= data.total) {
          this.hasMore = false;
        }
      },
      searchMore() {
        if (!this.loadingFlag) {
          return;
        }
        this.loadingFlag = false;
        if (!this.hasMore) {
          return
        }
        this.searchIndex +=SEARCH_MORE;
        console.log('need more');
        this.dataFn(this.query,this.searchIndex,SEARCH_MORE).then((res) => {
          this.result = this.result.concat(createSearchList(res.subjects));
          this._checkMore(res);
          this.loadingFlag = true;
        })
      },
      _selectType() {
        this.dataFn = this.tagSearch ? tagSearch : movieSearch;
      },
      ...mapMutations({
        'setMovie': 'SET_MOVIE'
      })
    },
    watch: {
      query() {
        this._selectType();
        if (this.query) {
          this.result = [];
          this.search();
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~base/stylus/variable.styl"
  .suggest-wrapper
    height: 100%
    .to-top
      box-sizing: border-box
      height: 22px
      position: fixed
      right: 0
      top: 80%
      z-index: 800
      padding: 5px
      background: $color-theme-f
      color: $color-background
      text-align: center
      font-size: $font-size-small
    .suggest
      height: 100%
      overflow: hidden
      .suggest-list
        padding: 15px
        .suggest-item
          margin-top: 15px
          height: 70px
          display: flex
          &:first-child
            margin-top: 0
          .item-pic
            flex: 50px 0 0
            width: 50px
            margin-right: 10px
          .item-info
            flex: 1
            padding-bottom: 30px
            .title
              font-size: $font-size-medium
              color: $color-text-f
              margin-bottom: 10px
            .info
              font-size: 0
              span
                font-size: $font-size-small
      .no-result
        position: absolute
        top: 50%
        width: 100%
        text-align: center
</style>