import crypto from 'crypto'  //加载crypto库

const {GameRoundStates} = require('../../constant')
var moment = require('moment')
import { Sequelize, BargainGameRound  } from '../../../schema'

// BargainGameRound.addHook( 'beforeCreate', 'generate_number', (game, options) => {
//  var buf = crypto.randomBytes(16)
//  game.number =  buf.toString('hex')
// })

export default BargainGameRound
