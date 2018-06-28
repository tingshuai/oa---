import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/index.js';
import store from './vuex/store'
import './assets/css/common.css'
import './assets/icon/iconfont.css'
import load from './component/common/loading.vue'
import myToast from './component/common/Toast.vue'
import myTable from './component/common/Table.vue'
import toolbar from './component/common/toolbar.vue'
import pocHeader from './component/common/pocHeader.vue'
import page from './component/common/page.vue'
import Sidebar from './component/common/Sidebar.vue'
// import uploading from './component/common/uploading.vue'
// import './api/mock'
import ajax from './api/base'

Vue.prototype.$http = ajax;
// Vue.prototype.rule=rule
Vue.use(ElementUI);
Vue.component('load', load)
Vue.component('my-toast',myToast)
Vue.component('my-table',myTable)
Vue.component('toolbar',toolbar)
Vue.component('pocHeader', pocHeader)
Vue.component('Page', page)
Vue.component('Sidebar', Sidebar);
// Vue.component('uploading',uploading)
// const router = new VueRouter({
// 	routes
// });
new Vue({
  store,
  router,
  el: '#app',
  components: {
    App
  }
})
Array.prototype.unique = function(){
  var res = [];
  var json = {};
  for(var i = 0; i < this.length; i++){
   if(!json[this[i].id]){
    res.push(this[i]);
    json[this[i].id] = 1;
   }
  }
  return res;
}