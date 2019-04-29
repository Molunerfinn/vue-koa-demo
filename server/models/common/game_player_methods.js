export function bindGamePlayerMethods( db ){

  let models = Object.keys(db)
  models.forEach((model)=>{
    let rex = /([\w]+)GamePlayer$/
    if( rex.test(model.name)){
      //打败了多少 %
      model.prototype.beat= async function(){
        let position = await this.current_position()
        let count = await model.count({where:{ game_round_id: this.game_round_id}})
        if( count == 1) return 100;
        //if( position == 1) return 100;
        return parseInt( (count-position)/(count-1)*100 )
      }

      model.prototype.percent_position= async function(){
        let count = await model.count({where:{ game_round_id: this.game_round_id}})

        return parseInt((await this.current_position())/count * 100)
      }
      model.prototype.current_position= async function() {
          //游戏排名得分数相同情况下，以得分挑战用时最短者优先排名；如游戏得分及挑战时间相同，以先达到者优先排名；
          //找到比他成绩好的
          let gtcount = await model.count({where:{ game_round_id: this.game_round_id, score: {[Op.gt]: this.score}}})
          //成绩相同，但是先玩的
          let eqcount = await model.count({where:{ game_round_id: this.game_round_id, score: this.score, created_at: {[Op.lt]: this.created_at}, id: {[Op.ne]: this.id} }})
          return (gtcount + eqcount + 1)
      }
    }

  })


}
