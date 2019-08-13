// Make sure to call Vue.use(Vuex) first if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    gameRound: {},
    gameResults: [],
    gameAlbums: [],
    slides: [],
    playerCount: 0,
    resultCount: 0
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
    },
    setSlides (state, newSlides) {
      state.slides = newSlides
    },
    setResultCount (state, count) {
      state.resultCount = count
    },
    setPlayerCount (state, count) {
      state.playerCount = count
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
    },
    setSlides (context, newSlides) {
      context.commit('setSlides', newSlides)
    },
    setResultCount (context, count) {
      context.commit('setResultCount', count)
    },
    setPlayerCount (context, count) {
      context.commit('setPlayerCount', count)
    }
  }
})

export default store
