import Vue from 'vue'
import App from './App'

import 'weui'
import weui from 'weui.js'

Vue.prototype.$weui = weui

/* eslint-disable no-new */
new Vue({
  render: h => h(App)
}).$mount('#app')
