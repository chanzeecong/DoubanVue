<template>
  <div class="discussion-wrapper">
    <div class="fixed-title">
      <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
      <span class="type">{{title}}</span>
      <span class="to-top" @click="toTop">
      <i class="icon-circle-up"></i>
      </span>
    </div>
    <scroll class="all-discuss"
            :data="discussions"
            :pullup="pullup"
            @scrollToEnd="loadMore"
            ref="scroll"
    >
      <div class="discuss-content">
        <movie-comment
                v-if="currentDiscussionType === 'comment'"
                :comments="discussions"
                :comment-num="discussionNum"
                :need-title="needTitle"
                :has-more="hasMore"
        >
        </movie-comment>
        <movie-review
                v-else
                :reviews="discussions"
                :reviews-num="discussionNum"
                :need-title="needTitle"
                :has-more="hasMore"
                @selectReview="selectReview"
        >
        </movie-review>
      </div>
      <loadmore :full-screen="fullScreen" v-if="!discussions.length && !noResult"></loadmore>
      <div class="no-result" v-if="noResult">要啥啥没有</div>
    </scroll>
  </div>
</template>

<script>



  import { mapGetters, mapMutations } from 'vuex';
  import Scroll from "components/common/scroll/scroll";
  import {getAllComments, getAllReviews} from "network/movie-detail";
  import MovieComment from "../movie-comment/movie-comment";
  import MovieReview from "../movie-review/movie-review";
  import Loadmore from "../../components/common/loadmore/loadmore";

  const SEARCH_MORE = 20;

  export default {
    name: "all-discussion",
    components: {Loadmore, MovieReview, MovieComment, Scroll},
    data() {
      return {
        discussionIndex: 0,
        discussions: [],
        discussionNum: 0,
        pullup: true,
        hasMore: true,
        noResult: false,// 存在更多数据
      }
    },
    computed: {
      title() {
        return `${this.movie.title}的全部${this.type}`;
      },
      type() {
        return this.currentDiscussionType === 'comment' ? '短评' : '影评'
      },
      ...mapGetters([
        'currentDiscussionType',
        'movie'
      ])
    },
    created() {
      this.fullScreen = true;
      this.needTitle = true;
      this.loadingFlag = true; // 控制滚动加载速度
      this._getAllDiscussions()
    },
    methods: {
      back() {
        this.$router.back()
      },
      toTop() {
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
      selectReview(id) {
        this.setReview(id);
        this.$router.push({
          path:`/movie/${this.movie.id}/review/${id}`
        })

      },
      loadMore() { // 加载更多数据
        if (!this.loadingFlag || !this.hasMore) { // 上一次加载还未完成时候，忽略此次事件
          return;
        }
        this.loadingFlag = false;
        this.discussionIndex += SEARCH_MORE; // 增加查找索引
        this.getData(this.movie.id,this.discussionIndex,SEARCH_MORE).then((res) => {
          this.discussions = this.discussions.concat(res[this.discussType]);
          this._checkMore(res);
          this.loadingFlag = true
        })
      },
      _getAllDiscussions() {
        if (!this.currentDiscussionType) {
          this.$router.push('/home');
          return
        }
        let isComment = this.currentDiscussionType === 'comment';
        this.discussType =isComment ? 'comments' : 'reviews';
        this.getData = isComment ? getAllComments : getAllReviews;
        this.getData(this.movie.id, this.discussionIndex, SEARCH_MORE).then((res) => {
          this.discussions = res[this.discussType];
          this.noResult = this.discussions.length ? this.noResult : true; //是否存在结果
          this.discussionNum = res.total;
          this._checkMore(res)
        })
      },
      _checkMore(data) {
        const discussions = data.comments ? data.comments : data.reviews;
        if (!discussions.length || data.start + data.count > data.total) {
          this.hasMore = false;
        }
      },
      ...mapMutations({
        setReview: 'SET_REVIEW_ID'
      })
    },
  }
</script>

<style scoped lang="stylus">
  @import "~base/stylus/variable.styl"
  @import "~base/stylus/mixin.styl"
  .discussion-wrapper
    height: 100%
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
          display: block
          padding: 15px
          font-size: $font-size-large
          color: $color-theme-f
      .type
        line-height: 50px
        padding-left: 50px
        font-size: $font-size-medium-x
      .to-top
        position: absolute
        top: 0
        right: 6px
        z-index: 50
        .icon-circle-up
          display: block
          padding: 15px
          font-size: $font-size-large-x
          color: $color-theme-f
    .all-discuss
      position: fixed
      background-color: $color-background
      top: 0
      right: 0
      left: 0
      bottom: 0
      z-index: 150
    .discuss-content
      padding-top: 50px
    .no-result
      position: absolute
      top: 50%
      width: 100%
      text-align: center
</style>