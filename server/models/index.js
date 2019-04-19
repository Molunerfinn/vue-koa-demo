import GameRound from './GameRound'
import BargainGameRound from './bargain/GameRound'
import GamePlayer from './GamePlayer'
import GameResult from './GameResult'
import GameDay from './GameDay'
import IdoGameRound from './ido/GameRound'
import IdoGameRoundStoreGift from './ido/GameRoundStoreGift'
import IdoGift from './ido/Gift'
import IdoPlayer from './ido/Player'
import IdoPlayerInfo from './ido/PlayerInfo'
import IdoResult from './ido/Result'
import IdoStroe from './ido/Stroe'

import {
  Sequelize
} from '../schema'


GameResult.belongsTo(GamePlayer, {
  foreignKey: 'game_player_id'
})

export {
  Sequelize,
  GameRound,
  GamePlayer,
  GameResult,
  GameDay
}
export {
  BargainGameRound
}
export {
  IdoGameRound,
  IdoGameRoundStoreGift,
  IdoGift,
  IdoPlayer,
  IdoPlayerInfo,
  IdoResult,
  IdoStroe
}
