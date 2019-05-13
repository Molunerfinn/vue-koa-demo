const messageContent = require('../constant')
const db = require('../../models')
const { getGameRoundModelByCode } = require('../../helpers/model')

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
      let code = ctx.query.code || gameRoundParams.code
      let Model = getGameRoundModelByCode(gameRoundParams.code)

      let model = await Model.create(gameRoundParams)

      if (model) {

        ctx.body = model
        ctx.status = 201
      }
    } catch (error) {
      console.log( " error ", error )
      ctx.throw(messageContent.ResponeStatus.UnprocessableEntity, `create round fail: ` + error, {
        expose: true
      })
    }
  }
  // /**
  //  * update round information, such as name, description
  //  * @param {*} ctx
  //  */
  // async updateRound(ctx) {
  //   var gameroundid = parseInt(ctx.params.id)
  //   var game_round = ctx.request.body.game_round
  //   try {
  //     // tmp <Array.<affectedCount, affectedRows>>
  //     var tmp = await dbOperation.MySqlOperation.UpdateRound(gameroundid, game_round)
  //     console.log("dbOperation.MySqlOperation.UpdateRound1=", tmp)
  //     if (tmp.length === 1) {
  //       ctx.status = 200
  //     }
  //   } catch (error) {
  //     ctx.throw(messageContent.ResponeStatus.CommonError, `update round ${gameroundid} fail: ` + error, {
  //       expose: true
  //     })
  //   }
  // }
  /**
   * show game round
   * @param {*} req
   * @param {*} res
   */
  async showRound(ctx) {
    try {
      var gameroundid = parseInt(ctx.params.id)
      let Model = getGameRoundModelByCode(gameRoundParams.code)

      var round = await Model.findOne({
        //attributes: ['id', 'name', 'state', 'start_at', 'end_at'],
        where: {
          id: gameroundid
        }
      })
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
