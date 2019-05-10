import Sequelize from 'sequelize'
import {
  generateCode
} from './helper'

const Op = Sequelize.Op

export function bindGamePlayerMethods(db) {

  let models = Object.values(db)
  models.forEach((model) => {
    let rex = /([\w]+)GamePlayer$/
    if (rex.test(model.name)) {
      bindMethods(model)
      addHooks(model)
    }

  })


}

function bindMethods(model) {
  console.log("bindGamePlayerMethods", model.name)
  // 当前最好成绩击败了 多少%
  model.prototype.beat = async function() {
    let position = await this.currentPositionDesc()
    let count = await model.count({
      where: {
        game_round_id: this.game_round_id
      }
    })
    if (count == 1) return 100;
    //if( position == 1) return 100;
    return parseInt((count - position) / (count - 1) * 100)
  }

  model.prototype.beatAsc = async function() {
    let position = await this.currentPositionAsc()
    let count = await model.count({
      where: {
        game_round_id: this.game_round_id
      }
    })
    if (count == 1) return 100;
    //if( position == 1) return 100;
    return parseInt((count - position) / (count - 1) * 100)
  }

  model.prototype.percentPositionDesc = async function() {
    let count = await model.count({
      where: {
        game_round_id: this.game_round_id
      }
    })

    return parseInt((await this.currentPositionDesc()) / count * 100)
  }
  model.prototype.currentPositionDesc = async function() {
    //游戏排名得分数相同情况下，以得分挑战用时最短者优先排名；如游戏得分及挑战时间相同，以先达到者优先排名；
    //找到比他成绩好的
    let gtcount = await model.count({
      where: {
        game_round_id: this.game_round_id,
        score: {
          [Op.gt]: this.score
        }
      }
    })
    //成绩相同，但是先玩的
    let eqcount = await model.count({
      where: {
        game_round_id: this.game_round_id,
        score: this.score,
        created_at: {
          [Op.lt]: this.created_at
        },
        id: {
          [Op.ne]: this.id
        }
      }
    })
    return (gtcount + eqcount + 1)
  }

  model.prototype.percentPositionAsc = async function() {
    let count = await model.count({
      where: {
        game_round_id: this.game_round_id
      }
    })

    return parseInt((await this.currentPositionAsc()) / count * 100)
  }
  model.prototype.currentPositionAsc = async function() {
    //游戏排名得分数相同情况下，以得分挑战用时最短者优先排名；如游戏得分及挑战时间相同，以先达到者优先排名；
    //找到比他成绩好的
    let gtcount = await model.count({
      where: {
        game_round_id: this.game_round_id,
        score: {
          [Op.lt]: this.score
        }
      }
    })
    //成绩相同，但是先玩的
    let eqcount = await model.count({
      where: {
        game_round_id: this.game_round_id,
        score: this.score,
        created_at: {
          [Op.lt]: this.created_at
        },
        id: {
          [Op.ne]: this.id
        }
      }
    })

    let count = await model.count({
      where: {
        game_round_id: this.game_round_id
      }
    })

    if (count == 1) {
      return 1
    }
    return (gtcount + eqcount + 1)
  }
}

function addHooks(model) {
  model.addHook('beforeCreate', 'generate_number', (game, options) => {

    game.token = generateCode()
  })

}
