import GameRound from './GameRound'
import BargainGameRound from './bargain/GameRound'
import GamePlayer from './GamePlayer'
import GameResult from './GameResult'
import GameDay from './GameDay'

import { Sequelize } from '../schema'


GameResult.belongsTo( GamePlayer, {foreignKey: 'game_player_id'})

export { Sequelize, GameRound, GamePlayer,GameResult, GameDay }
export { BargainGameRound }
