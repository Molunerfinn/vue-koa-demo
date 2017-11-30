import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import TodoList from './components/TodoList'

Vue.use(Router)
export function createRouter () {
  const router = new Router({
    mode: 'history',
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
  if (typeof window !== 'undefined') {
    router.beforeEach((to, from, next) => {
      const token = sessionStorage.getItem('demo-token')
      if (to.path === '/') { // 如果是跳转到登录页的
        if (token !== 'null' && token !== null) {
          next('/todolist') // 如果有token就转向todolist不返回登录页
        }
        next() // 否则跳转回登录页
      } else {
        if (token !== 'null' && token !== null) {
          Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token // 注意Bearer后有个空格
          next() // 如果有token就正常转向
        } else {
          next('/') // 否则跳转回登录页
        }
      }
    })
  }
  return router
}
