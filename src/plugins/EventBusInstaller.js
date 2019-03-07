export default {
  install(Vue) {
    import { EventBus } from('./EventBus')
    Vue.prototype.$bus = EventBus
  }
}
