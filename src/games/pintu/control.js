// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Control from './Control.vue'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
// import VueRouter from 'vue-router'
import '@/assets/common/css/control-base.css'
import '@/assets/dp-pintu/css/control.css'

import axios from 'axios'

Vue.prototype.$http = axios // 类似于vue-resource的调用方法

//import EventBus  from '@/plugins/EventBus'
//Vue.use(EventBus)

/* eslint-disable no-new */
new Vue({
  render: h => h(Control)
}).$mount('#app')
