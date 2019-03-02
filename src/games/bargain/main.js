// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
// import VueRouter from 'vue-router'
import axios from 'axios'
import wx from 'weixin-js-sdk'
import 'weui'
import weui from 'weui.js'
import QRCode from 'qrcode'

import '@/assets/bargain/css/common-wx.css'
import '@/assets/bargain/css/game-wx.css'

Vue.prototype.$http = axios // 类似于vue-resource的调用方法
Vue.prototype.$wx = wx
Vue.prototype.$weui = weui
Vue.prototype.$QRCode  = QRCode
/* eslint-disable no-new */
new Vue({
  render: h => h(App)
}).$mount('#app')
