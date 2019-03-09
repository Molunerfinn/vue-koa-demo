import Vue from 'vue'

export default {
  install(vm) {
    const EventBus = new Vue()
    vm.prototype.$bus = EventBus
  }
}
