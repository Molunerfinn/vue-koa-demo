import crypto from 'crypto'  //加载crypto库
import { Sequelize, bargain_game_rounds  } from '../../schema'
const BargainGameRound = bargain_game_rounds

BargainGameRound.addHook( 'beforeCreate', 'generate_number', (game, options) => {
  var buf = crypto.randomBytes(16)
  game.number =  buf.toString('hex')//密钥用于更新用户信息；
})

export default BargainGameRound
