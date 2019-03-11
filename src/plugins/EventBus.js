
export default {
  install(vm) {
    const { EventBus } = require('../lib/EventBus')
    vm.prototype.$bus = EventBus
  }
}
