const messageContent = require('../constant')
const {
  getGameRoundModelByCode,
  getGamePlayerModelByCode,
  getGameResultModelByCode
} = require('../../helpers/model')
const {
  getWxJsConfig
} = require('../../helpers/weixin')

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
   * 取得游戏相关信息，并返回客户端，初始化游戏
   * @param {*}
   * @return {*}
   */
  static async getInfo(ctx) {
    //try {
    let code = ctx.params.code
    let number = ctx.params.number
    let parsed = ctx.request.body.parsed || {}
    let openid = parsed.openid

    let GameRound = getGameRoundModelByCode(code)
    let GamePlayer = getGamePlayerModelByCode(code)
    let GameResult = getGameResultModelByCode(code)

    // 取得游戏信息
    let gameRound = await GameRound.findOne({
      where: {
        number
      }
    })
    // 取得玩家信息
    let gamePlayer = await GamePlayer.findOne({
      where: {
        game_round_id: gameRound.id,
        openid: openid,
      }
    })
    // 如果 gamePlayer 为 null， 检查是否需要创建
    if (gamePlayer == null) {
      gamePlayer = {
        openid: parsed.openid,
        nickname: parsed.nickname,
        avatar: parsed.headimgurl,
        game_round_id: gameRound.id,
        score: 0,
        max_score: 0
      }
      if (gameRound.contact_required == 0) {
        let res = await GamePlayer.create(gamePlayer)
      }
    }
    let playerInfo = gamePlayer
    if (gamePlayer.id) {
      // 取得玩家相关信息
      playerInfo = await gamePlayer.getInfo()
    }
    // 每个游戏 GameRound
    let gameInfo = await gameRound.getInfo()
    let wxConfig = getWxJsConfig()
    var allInfo = {
      gameRound: gameInfo,
      gamePlayer: playerInfo,
      wxConfig: wxConfig
    }
    ctx.body = allInfo

    //} catch (error) {
    //    ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, { expose: true })
    //}
  }

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
      ctx.body = {
        success: true
      }
    } catch (error) {
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }
}
