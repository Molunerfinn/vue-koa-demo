const messageContent = require('../../constant')
const {
  getGameRoundModelByCode,
  getGamePlayerModelByCode,
  getGameResultModelByCode,
  getGameAlbumModelByCode,
  getGamePhotoModelByCode
} = require('../../../helpers/model')
const {
  getWxJsConfig
} = require('../../../helpers/weixin')

const logger = require('../../../helpers/logger')
const md5 = require('md5');

function getClientIP(req) {
  return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress;
};

export default class GamesController {
  /**
   * 取得游戏相关信息，并返回客户端，初始化游戏
   * @param {*}
   * @return {*}
   */
  static async getInfo(ctx) {
    try {
      console.log('=================getinfo================');
      let number = ctx.params.number
      let parsed = ctx.request.body.parsed || {}
      console.log('parsed---:', parsed);
      let openid = parsed.openid
      let code = ctx.request.body.code

      let GameRound = getGameRoundModelByCode(code)
      let GamePlayer = getGamePlayerModelByCode(code)
      let GameResult = getGameResultModelByCode(code)
      let GameAlbum = getGameAlbumModelByCode(code)
      let GamePhoto = getGamePhotoModelByCode(code)
      // 取得游戏信息
      let gameRound = await GameRound.findOne({
        where: {
          number
        }
      })
      let allPlayer = await GamePlayer.findAndCountAll({
        where: {
          game_round_id: gameRound.id
        }
      })


      let gameResult = await GameResult.findAll({
        where: {
          game_round_id: gameRound.id
        }
      })
      // 取得当前玩家信息
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
          sex: parsed.sex,
          language: parsed.language,
          country: parsed.country,
          province: parsed.province,
          city: parsed.city,
          ip: getClientIP(ctx.req),
          score: 0,
          max_score: 0
        }
        gamePlayer = await GamePlayer.create(gamePlayer)
      }
      let playerInfo = gamePlayer
      if (gamePlayer.token != undefined) {
        // 取得玩家相关信息
        playerInfo = await gamePlayer.getInfo()
      }

      let gameAlbums = await GameAlbum.findAll({
        where: {
          game_round_id: gameRound.id,
          // game_player_id: playerInfo.id
        },
        include: [{
          attributes: ['file_name'],
          association: 'Photo'
        }],
        limit: 2
      })
      // 每个游戏 GameRound
      let url = ctx.header.referer
      console.log('url===================:', url);
      let gameInfo = await gameRound.getInfo()
      gameInfo.playerCount = allPlayer.count
      let wxConfig = await getWxJsConfig(url, gameRound)
      var allInfo = {
        gameAlbums: gameAlbums,
        gameResult: gameResult,
        gameRound: gameInfo,
        gamePlayer: playerInfo,
        wxConfig: wxConfig
      }
      ctx.body = allInfo

    } catch (error) {
      logger.error("getGameInfo error:", error)
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }

  static async getNewAlbumInfo(ctx) {
    try {
      console.log('=================getinfo================');
      let number = ctx.params.number
      let parsed = ctx.request.body.parsed || {}
      console.log('parsed---:', parsed);
      let code = ctx.request.body.code

      let GameRound = getGameRoundModelByCode(code)
      let GamePlayer = getGamePlayerModelByCode(code)
      let GameResult = getGameResultModelByCode(code)
      let GameAlbum = getGameAlbumModelByCode(code)
      let GamePhoto = getGamePhotoModelByCode(code)

      // 取得游戏信息
      let gameRound = await GameRound.findOne({
        where: {
          number
        }
      })
      let gameAlbums = await GameAlbum.findAll({
        where: {
          game_round_id: gameRound.id
        },
        include: [{
          attributes: ['file_name'],
          association: 'Photo'
        }],
        include: [{
          attributes: ['avatar'],
          association: 'GamePlayers'
        }],
        limit: 6,
        order: [
          ['created_at', 'DESC']
        ]
      })

      ctx.body = gameAlbums

    } catch (error) {
      logger.error("getGameInfo error:", error)
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }
  static async getHotAlbumInfo(ctx) {
    try {
      console.log('=================getinfo================');
      let number = ctx.params.number
      let parsed = ctx.request.body.parsed || {}
      console.log('parsed---:', parsed);
      let code = ctx.request.body.code

      let GameRound = getGameRoundModelByCode(code)
      let GamePlayer = getGamePlayerModelByCode(code)
      let GameResult = getGameResultModelByCode(code)
      let GameAlbum = getGameAlbumModelByCode(code)
      let GamePhoto = getGamePhotoModelByCode(code)

      // 取得游戏信息
      let gameRound = await GameRound.findOne({
        where: {
          number
        }
      })
      let gameAlbums = await GameAlbum.findAll({
        where: {
          game_round_id: gameRound.id
        },
        include: [{
          attributes: ['file_name'],
          association: 'Photo'
        }],
        include: [{
          attributes: ['avatar'],
          association: 'GamePlayers'
        }],
        limit: 6,
        order: [
          ['score', 'DESC']
        ]
      })

      ctx.body = gameAlbums

    } catch (error) {
      logger.error("getGameInfo error:", error)
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
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

      new_player.ip = getClientIP(ctx.req)
      new_player.sex = ctx.params.sex
      new_player.language = ctx.params.language
      new_player.country = ctx.params.country
      new_player.province = ctx.params.province
      new_player.city = ctx.params.city

      let GamePlayer = getGamePlayerModelByCode(code)

      console.log('new_player--:', new_player);
      var options = {
        fields: ['openid', 'nickname', 'avatar', 'game_round_id', 'realname', 'tel', 'score', 'max_score', 'token', 'ip', 'sex', 'language', 'country', 'province', 'city']
      }
      let gamePlayer = await GamePlayer.create(new_player, options)

      ctx.body = gamePlayer

    } catch (error) {
      logger.error("addPlayer error:", error)
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }

  static async setAchieve(ctx) {
    try {
      console.log('+++++++++++++setAchieve============');
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
      console.log(code, number, parsed);
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

      let secretString = 'md5' + gamePlayer.token + score + number
      let secret = md5(secretString)



      if (secret === ctx.request.body.secret) {
        let gameResultParams = {
          game_player_id: gamePlayerId,
          score: score,
          game_round_id: gameRound.id,
          ip: getClientIP(ctx.req)
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
      } else {
        ctx.body = 'invalid score!!!'
        throw ('invalid score!!!')
      }
    } catch (error) {
      logger.error("setAchieve error:", error)
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
      logger.error("getRanking error:", error)
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }

  static async getRoundState(ctx) {
    let code = ctx.request.body.code
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
