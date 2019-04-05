import Vue from 'vue'
import Vuerouter from 'vue-router'
import {currentCelebrityId} from "../store/getters";


Vue.use(Vuerouter);

const Home = () => import('views/home/Home');
const Column = () => import('views/column/Column');
const RankDetail = () => import('views/rank-detail/rank-detail');
const Profile = () => import('views/profile/Profile');
const Search = () => import('views/search/search');
const MovieDetail = () => import('views/movie-detail/movie-detail');
const AllDiscussion = () => import('views/all-discussion/all-discussion');
const ReviewDetail = () => import('views/review-detail/review-detail');
const CelebrityDetail = ()=> import('views/celebrity-detail/celebrity-detail');
const CelebrityWorks = () => import('views/celebrity-works/celebrity-works');

const router = new Vuerouter({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/column',
      component: Column,
      children: [
        {
          path:':rankType',
          component:RankDetail
        }
      ]
    },
    {
      path:'/search',
      component:Search,
    },
    {
      path: '/profile',
      component: Profile
    },
    {
      path: '/movie/:movieId',
      component: MovieDetail,
      children: [
        {
          path: 'review/:reviewId',
          component: ReviewDetail
        },
        {
          path: ':discussType',
          component: AllDiscussion
        }
      ]
    },
    {
      path: '/celebrity/:celebrityId',
      component: CelebrityDetail,
      children: [
        {
          path: 'works',
          component: CelebrityWorks
        }
      ]
    }
  ],
  mode: 'history'
});


export default router