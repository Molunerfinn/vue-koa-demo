import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  version: '0', // read from package.json
  userInfo: {
    avatar: 'default.jpg',
    apiKey: '',
  },
  storeId: 0,  
  loading: false // fetch or ajax
}


export default new Vuex.Store({
  state
})
