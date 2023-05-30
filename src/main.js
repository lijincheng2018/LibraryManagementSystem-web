import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import $ from 'jquery'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import Vuex from 'vuex'
import echarts from 'echarts'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(Vuex)

Vue.prototype.$echarts = echarts
Vue.prototype.$ = $
Vue.config.productionTip = false

Vue.prototype.axios = axios;

router.beforeEach((to, from, next) => {
  let isLogin = localStorage.getItem('isLogin')

  if(to.path != '/qqlogin') {
    if (to.path == '/login') {
      if (isLogin != null && isLogin != false) {
        next({ path: '/user/dashboard' })
      }
    } else if (isLogin == null || isLogin == false) {
      let now_request_url = window.location.pathname
      next({ path: '/login?refer=' + now_request_url })
    } else if (to.path == '/' || to.path == '/user' || to.path == '/user/') {
      next({ path: '/user/dashboard' })
    }
  }
  
  if (to.meta.title) {
    document.title = to.meta.title
  }

  next()
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  $,
  render: h => h(App)
})
