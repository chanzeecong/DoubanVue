<template>
  <div class="rank-wrapper">
    <div class="fixed-title">
      <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
      <span class="type">
        <span>{{rankType}}</span>
      </span>
    </div>
    <switches v-if="rankType === '豆瓣 Top250'"
              :switches="switches"
              :small-font="smallFont"
              :current-index="currentIndex"
              @switch="switchTab"
    >
    </switches>
    <scroll v-for="(scrollItem,index) in switches"
            v-show="currentIndex === index"
            :data="rankList[index]"
            :pullup="pullup"
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            :key="index"
            @scrollToEnd="loadMore"
            @scroll="scroll"
            class="rank-list-wrapper"
            ref="scroll"
    >
      <div class="rank-content" :class="{'more-padding': rankType === '豆瓣 Top250'}">
        <rank-list :rankItems="rankList[index]"
                   :page="index"
                   @select="selectMovie"
                   :has-more="hasMore[index]">
        </rank-list>
      </div>
      <loadmore :full-screen="fullScreen" v-if="!rankList[index].length "></loadmore>
    </scroll>
  </div>
</template>

<script>
  import Switches from "../../components/common/switch/Switches";
  import {createRankList} from "../../components/common/js/moveList";
  import {top250Rank,usBoxRank,weeklyRank,newMoviesRank} from "network/movie-rank";
  import { mapMutations } from 'vuex'
  import Scroll from "../../components/common/scroll/scroll";
  import RankList from "../rank-list/rank-list";
  import Loadmore from "../../components/common/loadmore/loadmore";

  const SEARCH_MORE = 10;
  export default {
    name: "rank-detail",
    components: {Loadmore, RankList, Scroll, Switches},
    data() {
      return {
        rankType: '',
        dataFn: null,
        top250Index: 0,
        rankList: {},
        fullScreen: true,
        currentIndex: 0,
        switches: [
          {name: '1-50'},
          {name: '51-100'},
          {name: '101-150'},
          {name: '151-200'},
          {name: '201-250'}
        ],
        smallFont:true,
        pullup: true,
        hasMore: [false, false, false, false, false], // 是否存在更多数据，仅针对top250
        movieIndex: [0, 50, 100, 150, 200], // 每页起始索引
        scrollY: [0, 0, 0, 0, 0], // 每页滚动位置
      }
    },
    created() {
      this.probeType = 3; // 需要实时派发事件
      this.listenScroll = true; // 需要监听事件
      this.loadingFlag = true; // 控制滚动加载速度
      this._selectType();
      this._getRankList();
    },
    beforeMount() {
      for (let i = 0; i < this.switches.length; i++) {
        this.$set(this.rankList,i,[]);
      }
    },
    methods: {
      back() {
        this.$router.back()
      },
      scroll(pos) {
        this.scrollY[this.currentIndex] = pos.y
      },
      switchTab(index)  {
        this.currentIndex = index;
        this.loadingFlag = true;
        this.$refs.scroll.forEach((item) =>   {
          item.scrollTo(0,this.scrollY[index]);
          setTimeout(() => {
            item.refresh();
          },20)
        });
        if (this.rankList[index].length === 0) {
          this.hasMore[index] = true;
          this.dataFn(this.movieIndex[index],SEARCH_MORE).then((res) => {
            this.rankList[index] = createRankList(res.subjects);
            // console.log(this.rankList);
          })
        }
      },
      selectMovie(movie) {
        this.setMovie(movie)
        this.$router.push({
          path:`/movie/${movie.id}`
        })
      },
      loadMore() {
        const index = this.currentIndex;
        if (!this.loadingFlag) {
          return;
        }
        this.loadingFlag = false;
        if (!this.hasMore[index]) {
          return;
        }
        this.movieIndex[index] += SEARCH_MORE;
        this.dataFn(this.movieIndex[index],SEARCH_MORE).then((res) => {
          this.rankList[index] = this.rankList[index].concat(createRankList(res.subjects));
          this._checkMore(res);
          this.loadingFlag = true;
        })
      },
      _selectType() {
        let type = this.$route.params.rankType;
        switch (type) {
          case 'top250':
            this.dataFn = top250Rank;
            this.rankType = '豆瓣 Top250';
            break;
          case 'weekly':
            this.dataFn = usBoxRank;
            this.rankType = '本周口碑榜';
            break;
          case 'new-movie':
            this.dataFn = weeklyRank;
            this.rankType = '新片榜';
            break;
          case 'us-box':
            this.dataFn = newMoviesRank;
            this.rankType ='北美票房榜';
            break;
        }
      },
      _getRankList() {
        if (this.rankType !== '豆瓣 Top250') {
          this.dataFn().then((res) => {
            this.rankList[0] = createRankList(res.subjects);
          })
        } else {
          this.dataFn(this.movieIndex[0],SEARCH_MORE).then((res) => {
            this.rankList[0] = createRankList(res.subjects);
          })
        }
      },
      _checkMore(data) {
        let movies = data.subjects;
        let end = 50 * (this.currentIndex + 1);
        if (!movies.length || data.start + data.count >= end) {
          this.hasMore[this.currentIndex] =false;
        }
      },
      ...mapMutations({
        setMovie: 'SET_MOVIE'
      })
    }
  }
</script>

<style scoped lang="stylus">
  @import "~base/stylus/variable.styl"
  @import "~base/stylus/mixin.styl"
  .rank-wrapper
    position: relative
    z-index: 10
    .fixed-title
      border-bottom-1px(#ccc)
      background-color: $color-background
      top: 0
      width: 100%
      height: 50px
      z-index: 200
      position: fixed
      .back
        position: absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: inline-block
          padding: 15px
          font-size: $font-size-large
          color: $color-theme-f
      .type
        line-height: 50px
        padding-left: 60px
        font-size: $font-size-medium-x
        color: $color-text-f
    .switches
      position: fixed
      top: 50px
      width: 100%
      height: 40px
      z-index: 200
      background-color: $color-background
    .rank-list-wrapper
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      background-color: $color-background
      .rank-content
        padding: 50px 15px 40px 15px
        &.more-padding
          padding-top: 90px
</style>