import Vue from 'vue'
import App from './App'
import http from './http/http.js'
import router from '@/router'
Vue.prototype.$http = http

Vue.config.productionTip = false
App.mpType = 'app'
App.router = router
const app = new Vue({
	...App
})



app.$mount()
