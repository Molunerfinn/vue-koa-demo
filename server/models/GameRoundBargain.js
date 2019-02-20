import crypto from 'crypto'  //加载crypto库
import { Sequelize, game_round_bargains  } from '../schema'
const Model = game_round_bargains

Model.addHook( 'beforeCreate', 'generate_number', (game, options) => {
  var buf = crypto.randomBytes(16);
  game.number =  buf.toString('hex');//密钥用于更新用户信息；
})

export default game_round_bargains
