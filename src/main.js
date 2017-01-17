// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import Axios from 'axios'

Vue.prototype.$http = Axios // 类似于vue-resource的调用方法

Vue.use(ElementUI);
Vue.use(VueRouter);

import Login from './components/Login'
import TodoList from './components/TodoList'

const router =  new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/todolist',
      component: TodoList
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to,from,next) =>{
  const token = sessionStorage.getItem('demo-token');
  if(to.path == '/'){ // 如果是跳转到登录页的
    if(token != 'null' && token != null){
      next('/todolist') // 如果有token就转向todolist不返回登录页
    }
    next(); // 否则跳转回登录页
  }else{
    if(token != 'null' && token != null){
      Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token; // 注意Bearer后有个空格
      next() // 如果有token就正常转向
    }else{
      next('/') // 否则跳转回登录页
    }
  }
})


/* eslint-disable no-new */
const app = new Vue({
  router: router,
  render: h => h(App) 
}).$mount('#app')
