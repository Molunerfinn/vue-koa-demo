const messageContent = require('../constant')
const db = require('../../models')
const {
  getGameRoundModelByCode,
  getRoundInstance
} = require('../../helpers/model')

const {
  addGameRoundJob
} = require('../../helpers/game_round_state_job')
// const WechatAPI = require('co-wechat-api');
// var OAuth = require('co-wechat-oauth');
// const config = require(`../../../config/wechat.${process.env.NODE_ENV}.json`);
// const wechat_config = config.wechat;
// const wechatApi = new WechatAPI(wechat_config.appid, wechat_config.secret);
// var wechatOAuth = new OAuth(wechat_config.appid, wechat_config.secret);
//


export default class GameRoundController {


  /**
   * get the rounds with options
   * @param {*} ctx
   */
  async getRounds(ctx) {
    try {
      var opts = {}
      if (ctx.request.body) {
        var {
          ids,
          limit,
          offset
        } = ctx.request.body
        opts = {
          ids,
          limit,
          offset
        }
      }
      var allrounds = [] //await dbOperation.MySqlOperation.GetRounds(opts)
      if (allrounds) {
        ctx.body = allrounds
        ctx.status = 200
      }
    } catch (error) {
      ctx.throw(messageContent.ResponeStatus.CommonError, 'can not get rounds', {
        expose: true
      })
    }
  }
  /**
   * create one round of a game, and add the round to the mememory db
   * @param {*} req
   * @param {*} res
   */
  static async createRound(ctx) {
    let gameRoundParams = ctx.request.body.game_round
    try {

      // code 在 url 中 或者 在参数中 game_round
      let code = ctx.params.code || gameRoundParams.code
      let Model = getGameRoundModelByCode(gameRoundParams.code)

      let model = await Model.create(gameRoundParams)

      if (model) {
        // 如果有开始和结束时间，默认需要自动根据时间改变游戏状态
        if (model.start_at != null && model.end_at != null) {
          addGameRoundJob(model)
        }
        ctx.body = model
        ctx.status = 201
      }
    } catch (error) {
      console.log(" error ", error)
      ctx.throw(messageContent.ResponeStatus.UnprocessableEntity, `create round fail: ` + error, {
        expose: true
      })
    }
  }
  /**
   * update round information, such as name, description
   * /:code/:id  在路径中,  ctx.params 获取
   * @param {*} ctx
   */
  static async updateRound(ctx) {
    var gameroundid = parseInt(ctx.params.id)

    console.log( "ctx.query, ctx.params", ctx.query, ctx.params)
    var gameRoundPamam = ctx.request.body.game_round
    let code = ctx.params.code

    try {
      let round = await getRoundInstance( code, gameroundid )
      await round.update(gameRoundPamam)
      ctx.body = round

    } catch (error) {
      ctx.throw( error, {
        expose: true
      })
    }
  }
  /**
   * show game round
   * @param {*} req
   * @param {*} res
   */
  static async showRound(ctx) {
    try {
      var gameroundid = parseInt(ctx.params.id)
      let code = ctx.params.code
      let round = await getRoundInstance( code, gameroundid )
      ctx.body = round
      ctx.status = 200
    } catch (error) {
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }
  // /**
  //  * delete round will delete the player of the round and the award of the player
  //  * @param {} req
  //  * @param {*} res
  //  */
  // async deleteRound(ctx) {
  //   try {
  //     var game_round_id = parseInt(ctx.params.id)
  //     await dbOperation.MemoryDbOperation.DeleteRound(game_round_id)
  //     await dbOperation.MySqlOperation.DeleteAwardsOfRound(game_round_id)
  //     await dbOperation.MySqlOperation.DeletePlayersOfRound(game_round_id)
  //     await dbOperation.MySqlOperation.DeleteRound(game_round_id)
  //     ctx.status = 200
  //   } catch (error) {
  //     ctx.throw(messageContent.ResponeStatus.CommonError, `delete round ${ctx.params.id} fail: ` + error, {
  //       expose: true
  //     })
  //   }
  // }



}
