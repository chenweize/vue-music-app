import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/icon/iconfont.css'
import $ from 'jquery'
import VueLazyload from 'vue-lazyload'
import { MessageBox, Lazyload, Toast } from 'mint-ui'
import 'mint-ui/lib/style.css'
 
// 对封装完成的 axios, localStorage 全局引入
// import Api from '@/utils/http.js';
// Vue.prototype.$http = Api;
import storage from '@/utils/storage'
Vue.prototype.$storage = storage;

// 全局使用 elementui, VueLazyload
Vue.use(ElementUI);
Vue.use(VueLazyload)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
