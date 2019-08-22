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

const {
  getObjectUrl
} = require('../../../helpers/aliyun_oss')

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
      let preview = parsed.preview
      let openid = parsed.openid
      let code = ctx.request.body.code
      let url = ctx.header.referer

      let GameRound = getGameRoundModelByCode(code)
      let GamePlayer = getGamePlayerModelByCode(code)
      let GameAlbum = getGameAlbumModelByCode(code)
      // 取得游戏信息
      let gameRound = await GameRound.findOne({
        where: {
          number
        }
      })

      let gameAlbumsPromise = GameAlbum.findAll({
        where: {
          game_round_id: gameRound.id,
        },
        include: [{
          attributes: ['okey'],
          association: 'Photos'
        }],
        limit: 2
      })
      let gamePlayerPromise =  GamePlayer.findOne({
        where: {
          openid
        }
      })
      let playerCountPromise = GameRound.count({
        where: {
          number
        },
        include: 'GamePlayers'
      })
      let resultCountPromise = GameRound.count({
        where: {
          number
        },
        include: 'GameResults'
      })

      const results = await Promise.all([
        gameAlbumsPromise,
        gamePlayerPromise,
        playerCountPromise,
        resultCountPromise,
        gameRound.getSlides(),
        getWxJsConfig(url, gameRound)
      ])
      let [gameAlbums, gamePlayer, playerCount, resultCount, slides, wxJsConfig] = [...results]

      if( preview == true){
        let avatar = 'http://wx.qlogo.cn/mmopen/VX7U0xDSUxiaYgiasax2BWhlFuXmDaGvibY27Zknyy2WWrgNQwHvTfrKicupics0tdlFqBWGicy3heHOyRKPrBvEibFZtHCicf8zyKkr/0'
        gamePlayer = { nickname: 'previewer', avatar: avatar }
      }

      gameRound = gameRound.getInfo()

      ctx.body = { gameRound, gameAlbums, gamePlayer, playerCount, resultCount, slides, wxJsConfig }

    } catch (error) {
      logger.error("getGameInfo error:", error)
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.number} fail: ` + error, {
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
          attributes: ['okey'],
          association: 'Photos'
        }, {
          attributes: ['avatar'],
          association: 'GamePlayer'
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
          attributes: ['okey'],
          association: 'Photos'
        }, {
          attributes: ['avatar'],
          association: 'GamePlayer'
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

  static async getAlbumInfo(ctx){
    console.log( "getAlbumInfo= ", ctx.request.body)
    let id = ctx.request.body.id
    let code = ctx.request.body.code
    let GameAlbum = getGameAlbumModelByCode(code)

      let gameAlbums = await GameAlbum.findOne({
        where: {
          id
        },
        include: [{
          association: 'Photos'
        }, {
          association: 'GamePlayer'
        }],
      })
      ctx.body = gameAlbums
  }


  static async getMyWorkInfo(ctx) {
    try {
      console.log('=================getMyWorkInfo================');
      let number = ctx.params.number
      let parsed = ctx.request.body.parsed || {}
      console.log('parsed---:', parsed);
      let code = ctx.request.body.code
      let openid = parsed.openid

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
        let gameAlbums = await GameAlbum.findAll({
          where: {
            game_round_id: gameRound.id
          },
          include: [{
            attributes: ['okey'],
            association: 'Photos'
          }],
          limit: 6,
          order: [
            ['created_at', 'DESC']
          ]
        })

        ctx.body = {
          gameAlbums: gameAlbums,
          gamePlayer: playerInfo
        }
      } else {
        ctx.body = null
      }



    } catch (error) {
      logger.error("getGameInfo error:", error)
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }

  static async getMyCardInfo(ctx) {
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
          attributes: ['okey'],
          association: 'Photos'
        }, {
          attributes: ['avatar'],
          association: 'GamePlayer'
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

  static async addPlayer(ctx) {
    try {
      console.log('===========addPlayer===========');
      console.log('ctx.request.body-----:',ctx.request.body);
      let code = ctx.request.body.code
      let number = ctx.params.number
      let openid = ctx.request.body.parsed.openid
      let parsed = ctx.request.body.parsed || {}
      let GameRound = getGameRoundModelByCode(code)
      let GamePlayer = getGamePlayerModelByCode(code)
      let GameResult = getGameResultModelByCode(code)
      let GameAlbum = getGameAlbumModelByCode(code)
      let GamePhoto = getGamePhotoModelByCode(code)

      let gameRound = await GameRound.findOne({
        where: {
          number
        }
      })
      console.log('gameRound__:',gameRound);

      let gamePlayer = await GamePlayer.findOne({
        where: {
          game_round_id: gameRound.id,
          openid: openid,
        }
      })
      console.log('gamePlayer///////:',gamePlayer);

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
      console.log('gamePlayer__:',gamePlayer);
      let realname = ctx.request.body.realname
      let cellphone = ctx.request.body.tel

      gamePlayer = await gamePlayer.update({
        realname: realname,
        cellphone: cellphone
      })

      console.log('gamePlayer123+++++:',gamePlayer);
      ctx.body = {
        gamePlayer: gamePlayer
      }

    } catch (error) {
      logger.error("addPlayer error:", error)
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }

  static async thumbUp(ctx) {
    console.log('thumbUp');
    ctx.body = 'ok'
    let code = ctx.request.body.code
    let number = ctx.params.number
    let openid = ctx.request.body.parsed.openid
    let album_id = ctx.request.body.album_id
    let GameRound = getGameRoundModelByCode(code)
    let GamePlayer = getGamePlayerModelByCode(code)
    let GameResult = getGameResultModelByCode(code)
    let GameAlbum = getGameAlbumModelByCode(code)
    let GamePhoto = getGamePhotoModelByCode(code)

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

    let gameResult = {
      game_player_id: gamePlayer.id,
      to_game_player_id: album_id,
      game_round_id: gameRound.id
    }
    gameResult = await GameResult.create(gameResult)

    let allResult = await GameResult.findAndCountAll({
      where: {
        to_game_player_id: album_id
      }
    })

    let Result_count = allResult.count

    let gameAlbum = await GameAlbum.findOne({
      where: {
        id: album_id
      }
    })

    await gameAlbum.update({
      score: Result_count
    })

    ctx.body = gameResult

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
