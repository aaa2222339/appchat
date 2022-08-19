import Vue from 'vue'
import App from './App'
import io from './components/weapp.socket.io.js';
import $ from 'jquery'
Vue.prototype.$jquery = $;
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.min.js'
// import 'bootstrap-table/dist/bootstrap-table.min.css'
// import 'bootstrap-table/dist/bootstrap-table.min.js'
// import 'bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js'
import axios from 'axios'   //引入axios
Vue.prototype.$axios = axios;//把axios挂载到vue上



Vue.config.productionTip = false
// Vue.prototype.socket = io('http://192.168.79.1:8082') // 客户端访问服务器的socket

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
