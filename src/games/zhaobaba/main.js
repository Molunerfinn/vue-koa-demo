// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import 'weui/dist/style/weui.css'
import '@/assets/kouhong/css/new_base.css'
import '@/assets/kouhong/css/new_game.css'

//import EventBus  from '@/plugins/EventBus'
//Vue.use(EventBus)

/* eslint-disable no-new */
new Vue({
  render: h => h(App)
}).$mount('#app')
