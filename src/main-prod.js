import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import './plugins/element.js';

// css初始化
import './assets/css/normalize.css';
// 导入iconfont图标css
import './assets/css/iconfont.css';
// 导入全局样式
import './assets/css/global.css';
// 导入网络请求模块
import request from './network/request';
Vue.prototype.$http = request;

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
