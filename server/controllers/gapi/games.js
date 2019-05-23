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
  /**
   * 取得游戏相关信息，并返回客户端，初始化游戏
   * @param {*}
   * @return {*}
   */
  static async getInfo(ctx) {
    //try {
    console.log('=================getinfo================');
    let code = ctx.params.code
    let number = ctx.params.number
    let parsed = ctx.request.body.parsed || {}
    let openid = parsed.openid

    console.log('openid=======:', openid);

    let GameRound = getGameRoundModelByCode(code)
    let GamePlayer = getGamePlayerModelByCode(code)
    let GameResult = getGameResultModelByCode(code)

    console.log(GameRound + '====' + GamePlayer + '======' + GameResult);

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
    let url = ctx.header.referer
    console.log('url===================:', url);
    let gameInfo = await gameRound.getInfo()
    let wxConfig = await getWxJsConfig(url, gameRound)
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
      console.log('Model--:', Model);

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

      console.log('new_player--:', new_player);
      var options = {
        fields: ['openid', 'nickname', 'avatar', 'game_round_id', 'realname', 'tel', 'score', 'max_score', 'token']
      }
      let gamePlayer = await GamePlayer.create(new_player, options)

      ctx.body = gamePlayer

    } catch (error) {
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }

  static async setAchieve(ctx) {
    try {
      console.log('===========setAchieve============');
      let ret = {
        rt: 0,
        isSuc: true,
        success: true
      }
      let code = ctx.params.code
      let GameRound = getGameRoundModelByCode(code)
      let GamePlayer = getGamePlayerModelByCode(code)
      let GameResult = getGameResultModelByCode(code)

      let number = ctx.params.number
      let game_round_id = ctx.params.id
      let parsed = ctx.request.body.parsed
      let score = ctx.request.body.score
      let openid = parsed.openid

      let gameRound = await GameRound.findOne({
        where: {
          number
        }
      })

      let gamePlayer = await GamePlayer.findOne({
        where: {
          game_round_id: gameRound.id,
          openid: openid,
        }
      })

      let gameResultParams = {
        game_player_id: gamePlayerId,
        score: score,
        game_round_id: gameRound.id,
      }

      let gamePlayerId = gamePlayer.id
      let lastMaxScore = gamePlayer.max_score

      let gameResult = GameResult.build(gameResultParams)
      let result = await gameResult.save()

      await gamePlayer.update({
        score: gameResult.score
      })

      if (gameResult.score > lastMaxScore) {
        await gamePlayer.update({
          max_score: gameResult.score
        })
      } else {
        ret.isSuc = false
        ret.success = false
      }

      ret.playerId = gamePlayer.id //required to set g_config.playerId
      ret.achieveToken = gamePlayer.token
      ret.score = gameResult.score

      ret.bestScore = gamePlayer.max_score //bestScore
      let rank = await gamePlayer.currentPositionDesc()
      let beat = await gamePlayer.beat()
      ret.rank = rank
      ret.beat = beat
      ret.hasLot = false

      ctx.body = JSON.stringify(ret)

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
      let GameRound = getGameRoundModelByCode(code)
      let GamePlayer = getGamePlayerModelByCode(code)

      let number = ctx.params.number
      let openid = ctx.request.body.openid

      let gameRound = await GameRound.findOne({
        where: {
          number
        }
      })

      let res = await GamePlayer.findAll({
        where: {
          game_round_id: gameRound.id
        },
        limit: 100,
        order: [
          ['max_score', 'DESC']
        ],
      })

      let thisPlayer = await GamePlayer.findOne({
        where: {
          game_round_id: gameRound.id,
          openid: openid
        }
      })

      thisPlayer.rank = await thisPlayer.currentPositionDesc()

      let rankInfo = {
        allPlayer: res,
        thisPlayer: thisPlayer,
        page: 1,
        pageSize: 100,
        total: 100
      }
      ctx.body = rankInfo
    } catch (error) {
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }

  static async getRoundState(ctx) {
    let code = ctx.params.code
    let GameRound = getGameRoundModelByCode(code)
    let number = ctx.params.number

    let gameRound = await GameRound.findOne({
      where: {
        number
      }
    })
    ctx.body = gameRound.getInfo();
  }
}
