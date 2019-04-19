import Vue from 'vue'
import App from './App'
import '../../../node_modules/swiper/dist/css/swiper.min.css'
import '../../../node_modules/weui/dist/style/weui.css'
import 'weui'
import weui from 'weui.js'

Vue.prototype.$weui = weui

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
