import VueRouter from 'vue-router'
import Account from './page/Account.vue'
import Works from './page/Works.vue'
import CreateAlbum from './page/CreateAlbum.vue'
import Index from './page/Index.vue'
import Review from './page/Review.vue'
import MyAccount from './page/Account.vue'
// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: Index },
  { path: '/account', component: Account },
  { path: '/works', component: Works },
  { path: '/apply', component: CreateAlbum },
  { path: '/review', component: Review },
  { path: '/myaccount', component: MyAccount }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
})

export default router
