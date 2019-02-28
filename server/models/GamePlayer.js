import crypto from 'crypto'  //加载crypto库
import { Sequelize, game_players  } from '../schema'

const Model = game_players

// 不要使用openid作为token，*希望游戏可以在微信、支付宝，网页等打开*
Model.addHook( 'beforeCreate', 'generate_token', (player, options) => {
  var buf = crypto.randomBytes(16);
  player.token =  buf.toString('hex');//密钥用于更新用户信息；
})
//打败了多少 %
Model.prototype.beat= async function(){
  let model = Model
  let position = await this.current_position()
  let count = await model.count({where:{ game_round_id: this.game_round_id}})
  return parseInt( (count-position)/(count-1)*100 )
}

Model.prototype.percent_position= async function(){
  let model = Model
  let count = await model.count({where:{ game_round_id: this.game_round_id}})

  return parseInt((await this.current_position())/count * 100)
}
Model.prototype.current_position= async function() {
    //游戏排名得分数相同情况下，以得分挑战用时最短者优先排名；如游戏得分及挑战时间相同，以先达到者优先排名；
    let model = Model
    //找到比他成绩好的
    let gtcount = await model.count({where:{ game_round_id: this.game_round_id, score: {[Op.gt]: this.score}}})
    //成绩相同，但是先玩的
    let eqcount = await model.count({where:{ game_round_id: this.game_round_id, score: this.score, created_at: {[Op.lt]: this.created_at}, id: {[Op.ne]: this.id} }})
    return (gtcount + eqcount + 1)
}


export default Model