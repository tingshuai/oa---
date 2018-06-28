import Vue from 'vue'
import backlog from './backlog.vue'
import '../src/assets/css/common.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ajax from './api/base.js'
import myToast from './components/common/Toast.vue'
import myTable from './components/common/Table.vue'
import toolbar from './components/common/toolbar.vue'
import './assets/css/iconfont.css'
import store from './vuex/store'
Vue.prototype.$http = ajax;
Vue.component('my-toast',myToast)
Vue.component('my-table',myTable)
Vue.component('toolbar',toolbar)
Vue.use(ElementUI);
new Vue({
	store,
  el: '#app',
  components:{
  	backlog
  }
})
