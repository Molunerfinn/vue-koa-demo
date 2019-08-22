import { mapState, mapActions } from 'vuex'

export default {
  // ...
  computed:{
    ...mapState([
      // 箭头函数可使代码更简练
      'number','gameRound', 'gameResults', 'gameAlbums', 'slides', 'playerCount', 'resultCount'
    ])
  },
  methods:{
    ...mapActions([
      'setNumber','setGameRound','setGameResults', 'setGameAlbums', 'setSlides', 'setResultCount', 'setPlayerCount'
    ])
  }
}
