import { mapState, mapActions } from 'vuex'

export default {
  // ...
  computed:{
    ...mapState([
      // 箭头函数可使代码更简练
      'gameRound', 'gameResults', 'gameAlbums'
    ])
  },
  methods:{
    ...mapActions([
      'setGameRound','setGameResults', 'setGameAlbums'
    ])
  }
}
