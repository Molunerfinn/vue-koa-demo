import GameRound from './GameRound'
import GameRoundBargain from './GameRoundBargain'
import GamePlayer from './GamePlayer'
import GameResult from './GameResult'
import GameDay from './GameDay'

import { Sequelize } from '../schema'


GameResult.belongsTo( GamePlayer, {foreignKey: 'game_player_id'})

export  { Sequelize, GameRound, GameRoundBargain, GamePlayer,GameResult, GameDay }
