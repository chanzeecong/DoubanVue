import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import VueLazyLoad from 'vue-lazyload';

import 'base/stylus/index.styl';


Vue.use(VueLazyLoad, {
  loading: require('components/common/image/loading.gif')
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
