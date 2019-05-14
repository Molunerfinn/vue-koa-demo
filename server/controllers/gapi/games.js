const messageContent = require('../constant')
const {
  getGameRoundModelByCode
} = require('../../helpers/model')


// const WechatAPI = require('co-wechat-api');
// var OAuth = require('co-wechat-oauth');
// const config = require(`../../../config/wechat.${process.env.NODE_ENV}.json`);
// const wechat_config = config.wechat;
// const wechatApi = new WechatAPI(wechat_config.appid, wechat_config.secret);
// var wechatOAuth = new OAuth(wechat_config.appid, wechat_config.secret);

// url /:code/:number
export default class GamesController {

  // /**
  //  * update round information, such as name, description
  //  * @param {*} ctx
  //  */
  // async updateRound(ctx) {
  //     var gameroundid = parseInt(ctx.params.id)
  //     var game_round = ctx.request.body.game_round
  //     try {
  //         // tmp <Array.<affectedCount, affectedRows>>
  //         var tmp = await dbOperation.MySqlOperation.UpdateRound(gameroundid, game_round)
  //         console.log("dbOperation.MySqlOperation.UpdateRound1=", tmp )
  //         if(tmp.length === 1){
  //           ctx.status = 200
  //         }
  //     } catch (error) {
  //         ctx.throw(messageContent.ResponeStatus.CommonError, `update round ${gameroundid} fail: ` + error, { expose: true })
  //     }
  // },
  /**
   * show game round
   * @param {*} req
   * @param {*} res
   */
  static async getInfo(ctx) {
    try {
      let code = ctx.params.code
      let number = ctx.params.number
      let Model = getGameRoundModelByCode(code)

    } catch (error) {
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }

  /**
   * show game round
   * @param {*} req
   * @param {*} res
   */
  static async addPlayer(ctx) {
    try {
      let code = ctx.params.code
      let number = ctx.params.number
      console.log("showRoundByNumber= ", ctx.params)
      let Model = getGameRoundModelByCode(code)

      let gameRound = await Model.findOne({
        where: {
          number
        }
      })

      let new_player = ctx.request.body.gamePlayer
      let realname = ctx.request.body.realname
      let cellphone = ctx.request.body.tel

      new_player.realname = realname
      new_player.cellphone = cellphone
      new_player.game_round_id = gameRound.id

      let GamePlayer = getGamePlayerModelByCode(code)

      GamePlayer.addPlayer(new_player)

    } catch (error) {
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }

  /**
   * show game round
   * @param {*} req
   * @param {*} res
   */
  static async setAchieve(ctx) {
    try {
      let code = ctx.params.code
      let number = ctx.params.number
      console.log("showRoundByNumber= ", ctx.params)
      let Model = getGameRoundModelByCode(code)

    } catch (error) {
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }


  /**
   * show game round
   * @param {*} req
   * @param {*} res
   */
  static async getRanking(ctx) {
    try {
      let code = ctx.params.code
      let number = ctx.params.number
      console.log("showRoundByNumber= ", ctx.params)
      let Model = getGameRoundModelByCode(code)

    } catch (error) {
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }
}
