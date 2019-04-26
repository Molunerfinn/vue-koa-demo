import { DpPintuGamePlayer  } from '../../../schema'
const Model = DpPintuGamePlayer


//打败了多少 %
Model.prototype.beat= async function(){
  let position = await this.current_position()
  let count = await Model.count({where:{ game_round_id: this.game_round_id}})
  return parseInt( (count-position)/(count-1)*100 )
}

Model.prototype.percent_position= async function(){
  let count = await Model.count({where:{ game_round_id: this.game_round_id}})

  return parseInt((await this.current_position())/count * 100)
}
Model.prototype.current_position= async function() {
    //游戏排名得分数相同情况下，以得分挑战用时最短者优先排名；如游戏得分及挑战时间相同，以先达到者优先排名；
    //找到比他成绩好的
    let gtcount = await Model.count({where:{ game_round_id: this.game_round_id, score: {[Op.gt]: this.score}}})
    //成绩相同，但是先玩的
    let eqcount = await Model.count({where:{ game_round_id: this.game_round_id, score: this.score, created_at: {[Op.lt]: this.created_at}, id: {[Op.ne]: this.id} }})
    return (gtcount + eqcount + 1)
}


export default DpPintuGamePlayer
