import { ZhaobabaGameRound, ZhaobabaGamePlayer, ZhaobabaGameResult, ZhaobabaGameDay  } from '../../../schema'

// keep association name same for all games
ZhaobabaGameRound.hasMany( ZhaobabaGamePlayer, { foreignKey: 'game_round_id', as: 'gamePlayers'})

ZhaobabaGamePlayer.hasMany( ZhaobabaGameResult, {foreignKey: 'game_player_id', as: 'gameResults'})


export {
  ZhaobabaGameRound, ZhaobabaGamePlayer, ZhaobabaGameResult, ZhaobabaGameDay
}
