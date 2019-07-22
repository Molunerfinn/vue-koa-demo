// Make sure to call Vue.use(Vuex) first if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    gameRound: {},
    gameResults: [],
    gameAlbums: []
  },
  mutations: {
    setGameRound (state, newGameRound) {
      state.gameRound = newGameRound
    },
    setGameResults (state, newGameResults) {
      state.gameResults = newGameResults
    },
    setGameAlbums (state, newGameAlbums) {
      state.gameAlbums = newGameAlbums
    }
  },
  actions: {
    setGameRound (context, newGameRound) {
      context.commit('setGameRound', newGameRound)
    },
    setGameResults (context, newGameResults) {
      context.commit('setGameResults', newGameResults)
    },
    setGameAlbums (context, newGameAlbums) {
      context.commit('setGameAlbums', newGameAlbums)
    }
  }
})

export default store
