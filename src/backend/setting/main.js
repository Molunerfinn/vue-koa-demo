// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import 'weui/dist/style/weui.css'
import '@/assets/common/css/base2.css'
import '@/assets/game/ztoupiao/css/game.css'


/* eslint-disable no-new */
new Vue({
  render: h => h(App)
}).$mount('#app')
