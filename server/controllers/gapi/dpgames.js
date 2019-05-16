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
    let url = ctx.header.referer
    let wxConfig = await getWxJsConfig(url)
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

      let playerInfo = gamePlayer
      if (gamePlayer.id) {
        // 取得玩家相关信息
        playerInfo = await gamePlayer.getInfo()
      }
      var allInfo = {
        gameRound: gameRound.getInfo(),
        gamePlayer: playerInfo,
        wxConfig: wxConfig
      }
      ctx.body = allInfo
    } else {
      let gameResult = await GameResult.findOne({
        where: {
          game_player_id: gamePlayer.id,
          game_round_id: gameRound.id,
        }
      })
      let ret = {
        rt: 0,
        isSuc: true,
        success: true
      }

      ret.playerId = gamePlayer.id //required to set g_config.playerId
      ret.isSuc = gamePlayer.score >= gamePlayer.max_score
      ret.achieveToken = gamePlayer.token
      ret.score = gamePlayer.score
      ret.bestScore = (gamePlayer.max_score) //bestScore
      if (gamePlayer.score == 9999.99) {
        ret.score = 0
      }
      let rank = await gamePlayer.currentPositionAsc()
      let beat = await gamePlayer.beatAsc()
      ret.rank = rank
      ret.beat = beat
      ret.hasLot = false
      // 每个游戏 GameRound

      console.log('url===================:', url);
      console.log('wxConfig=======:', wxConfig);
      var allInfo = {
        gameRound: gameRound.getInfo(),
        gamePlayer: gamePlayer,
        wxConfig: wxConfig,
        gameResult: gameResult,
        ret: ret
      }
      ctx.body = allInfo
    }
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

      let start_at = gameRound.start_at
      let now = new Date();
      console.log('now--:', now);
      let gamePlayerId = gamePlayer.id
      let score = now - start_at
      let s = Math.floor(score / 1000) - 3
      let ss = Math.floor(score % 1000)
      score = parseFloat(s + '.' + ss)
      console.log('score++++++++:', score);
      if (score > gameRound.duration) {
        score = 9999.99
      }

      let gameResultParams = {
        game_player_id: gamePlayerId,
        score: score,
        game_round_id: gameRound.id,
        start_at: gameRound.start_at
      }
      let lastMaxScore = gamePlayer.max_score

      let gameResult = GameResult.build(gameResultParams)
      let result = await gameResult.save()

      await gamePlayer.update({
        score: gameResult.score
      })

      if (gameResult.score < lastMaxScore) {
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

      let rankInfo = {
        allPlayer: res,
        thisPlayer: thisPlayer,
        page: 1,
        pageSize: 100,
        total: 100
      }
      console.log('rankInfo====:', rankInfo);
      ctx.body = rankInfo
    } catch (error) {
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }
}
