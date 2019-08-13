// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
// 1. Use plugin.
// This installs <router-view> and <router-link>,
// and injects $router and $route to all router-enabled child components
Vue.use(VueRouter)

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import 'weui/dist/style/weui.css'
import '@/assets/common/css/base2.css'
import '@/assets/game/ztoupiao/css/game.css'
import '@/assets/game/ztoupiao/css/font.css'
import '@/assets/game/ztoupiao/css/skin.css'

import router from './router'
import store from './store'
import storeMixin from './store_mixin'

Vue.mixin(storeMixin)
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
