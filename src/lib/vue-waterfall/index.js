// copy frin https://github.com/geng452654716/vue-waterfall
import waterfallSilde from './waterfall-silde.vue'
import waterfall from './waterfall.vue'
const install = function (Vue) {
  Vue.component(waterfall.name, waterfall)
  Vue.component(waterfallSilde.name, waterfallSilde)
}
const VueWaterfall = { waterfallSilde, waterfall, install }
export default VueWaterfall
export { waterfallSilde, waterfall, install }
