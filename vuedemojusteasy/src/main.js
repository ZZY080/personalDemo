import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
Vue.use(ElementUI);
axios.defaults.baseURL="http://192.168.1.140:8081";

// 将Axios 挂载到Vue原型上
Vue.prototype.$http=axios;
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
