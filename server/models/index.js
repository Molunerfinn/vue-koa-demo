import GameRound from './GameRound'
import GameRoundBargain from './GameRoundBargain'
import GamePlayer from './GamePlayer'
import GameResult from './GameResult'
import GameDay from './GameDay'
import IDoGameRound from './IDoGameRound'
import IDoGameRoundStoreGift from './IDoGameRoundStoreGift'
import IDoGift from './IDoGift'
import IDoPlayer from './IDoPlayer'
import IDoPlayerInfo from './IDoPlayerInfo'
import IDoResult from './IDoResult'
import IDoStroe from './IDoStroe'

import {
  Sequelize
} from '../schema'


GameResult.belongsTo(GamePlayer, {
  foreignKey: 'game_player_id'
})

export {
  Sequelize,
  GameRound,
  GameRoundBargain,
  GamePlayer,
  GameResult,
  GameDay,
  IDoGameRound,
  IDoGameRoundStoreGift,
  IDoGift,
  IDoPlayer,
  IDoPlayerInfo,
  IDoResult,
  IDoStroe
}
