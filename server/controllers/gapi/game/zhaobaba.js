/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* WWW handlers (invoked by router to render templates)                                           */
/*                                                                                                */
/* All functions here either render or redirect, or throw.                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const fetch = require('node-fetch')
const {
  getGameRoundModelByCode,
  getGamePlayerModelByCode,
  getGameResultModelByCode
} = require('../../../helpers/model')

const{
  getWxJsConfigApiUrl
} = require('../../../helpers/weixin')
import {
  GameRoundStates
} from '../../../models/constant'

class zhaobaba {

  static async postMsg(ctx) {
    console.log('ctx.params---:',ctx.params);
    let code = ctx.params.code
    let number = ctx.params.number
    let GameRound = getGameRoundModelByCode(code)
    let GamePlayer = getGamePlayerModelByCode(code)
    let realname = ctx.request.body.realname
    let cellphone = ctx.request.body.tel
    let gameRound = await GameRound.findOne({
      where: {
        number
      }
    })
    console.log('gameRound--:',gameRound);
    let new_player = ctx.request.body.gamePlayer
    new_player.score = 0
    new_player.max_score = 0


    var options = {
      fields: ['openid', 'nickname', 'avatar', 'game_round_id', 'realname', 'tel', 'score', 'max_score', 'token']
    }
    let res = await GamePlayer.create(new_player, options)

    ctx.body = res
  }


  static async getGameResult(ctx) {
    try {
      let url = ctx.header.referer
      console.log("url=======", url,  getWxJsConfigApiUrl())
      // let shareurl = `${GAME_URL_BASE}/game-${game_round.code}/${game_round.id}/checkin-wx?to_game_player_id=${to_game_player.id}`

      let body = {
        url: url
      }
      let apiurl = getWxJsConfigApiUrl()

      let res = await fetch(apiurl, {
        timeout: 2000,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'post'
      })
      if (res) {
        let data = await res.json()
        var wx_config = {
          appId: data['appId'],
          timestamp: data['timestamp'],
          nonceStr: data['nonceStr'],
          signature: data['signature']
        }
      }
    } catch (err) {
      console.error("got error-", err);
    }
    console.log('==========getGameResult============');

    let code = ctx.params.code
    let number = ctx.params.number
    let parsed = ctx.request.body.parsed
    let openid = parsed.openid

    let GameRound = getGameRoundModelByCode(code)
    let GamePlayer = getGamePlayerModelByCode(code)
    let GameResult = getGameResultModelByCode(code)
    let gameRound = await GameRound.findOne({
      where: {
        number
      }
    })

    if (gameRound != null) {

      let playPath = gameRound.getPlayPath()

      let gamePlayer = await GamePlayer.findOne({
        where: {
          game_round_id: gameRound.id,
          openid: openid,
        }
      })

      if (gamePlayer == null || gamePlayer == undefined) {

        gamePlayer = {
          openid: parsed.openid,
          nickname: parsed.nickname,
          avatar: parsed.headimgurl,
          game_round_id: gameRound.id,
          score: 0,
          max_score: 0
        }
        if (gameRound.contact_required == 0) {
          var options = {
            fields: ['openid', 'nickname', 'avatar', 'game_round_id', 'score', 'max_score', 'token']
          }
          let res = await GamePlayer.create(gamePlayer, options)
        }

        var dataList = [];
        for (var i = 0; i < 50; i++) {
          dataList.push(Math.round(Math.random() * 3)); //可均衡获取0到1的随机整数。
        }

        var gameInfo = {
          gameRound: gameRound,
          gamePlayer: gamePlayer,
          wx_config: wx_config,
          dataList: dataList,
          playPath: playPath
        }
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
        ret.isSuc = gamePlayer.score < gamePlayer.max_score
        ret.achieveToken = gamePlayer.token
        ret.score = gamePlayer.score
        ret.bestScore = (gamePlayer.max_score) //bestScore
        let rank = await gamePlayer.currentPositionDesc()
        let beat = await gamePlayer.beat()
        ret.rank = rank
        ret.beat = beat
        ret.hasLot = false

        var dataList = [];
        for (var i = 0; i < 50; i++) {
          dataList.push(Math.round(Math.random() * 3)); //可均衡获取0到1的随机整数。
        }

        var gameInfo = {
          gameRound: gameRound,
          gamePlayer: gamePlayer,
          gameResult: gameResult,
          wx_config: wx_config,
          ret: ret,
          dataList: dataList,
          playPath: playPath
        }
      }

      ctx.body = gameInfo
    } else {
      ctx.body = null
    }
  }

  static async setAchieve(ctx) {
    console.log('==========setAchieve============');
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
    let cmd = 'setAchieve'
    if (cmd == 'setAchieve') { //设置成绩
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

      let gamePlayerId = gamePlayer.id
      let lastMaxScore = gamePlayer.max_score

      let gameResultParams = {
        game_player_id: gamePlayerId,
        score: score,
        game_round_id: gameRound.id,
      }

      let gameResult = GameResult.build(gameResultParams)
      let result = await gameResult.save()
      await gamePlayer.update({
        score: gameResult.score
      })

      if (gameResult.score > lastMaxScore) {
        await gamePlayer.update({
          max_score: gameResult.score
        })
      }
      ret.playerId = gamePlayer.id //required to set g_config.playerId
      ret.isSuc = true
      ret.achieveToken = gamePlayer.token
      ret.score = gameResult.score

      ret.bestScore = (gamePlayer.max_score) //bestScore
      let rank = await gamePlayer.currentPositionDesc()
      let beat = await gamePlayer.beat()
      ret.rank = rank
      ret.beat = beat
      ret.hasLot = false
      console.log("setAchieve= ", ret, "lastMaxScore=", lastMaxScore)
    }

    ctx.body = JSON.stringify(ret)
  }

  static async getRanking(ctx) {
    console.log('==========getRanking============');
    let code = ctx.params.code
    let GameRound = getGameRoundModelByCode(code)
    let GamePlayer = getGamePlayerModelByCode(code)

    let number = ctx.params.number

    let gameRound = await GameRound.findOne({
      where: {
        number
      }
    })

    let gamePlayer = await GamePlayer.findAll({
      where: {
        game_round_id: gameRound.id
      },
      order: [
        ['max_score', 'DESC']
      ],
    })

    console.log('gamePlayer+++++:',gamePlayer);

    ctx.body = JSON.stringify(gamePlayer)
  }

  static async setPhone(ctx) {

    let openid = ctx.query._openId
    let userInfo = JSON.parse(ctx.request.body.userInfo)
    let game_player_values = {
      realname: userInfo.ausername,
      cellphone: userInfo.aphone
    } //游戏玩家需要更新的信息 { realname, cellphone }
    let game_player = await GamePlayer.findOne({
      where: {
        game_round_id,
        openid
      }
    })
    await game_player.update(game_player_values)
    ctx.body = JSON.stringify(ret)
  }

  static async get_rank_list(gamePlayer, start, limit) {
    let game_round_id = gamePlayer.game_round_id
    let ret = {
      rank: 0
    }

    let count = await GamePlayer.count({
      where: {
        game_round_id
      }
    })
    let players = await GamePlayer.findAll({
      where: {
        game_round_id
      },
      order: [
        ['score', 'DESC'],
        ['created_at', 'ASC']
      ],
      offset: start,
      limit: limit
    })

    let list = players.map((player) => {
      return {
        name: player.nickname,
        achievement: player.score,
        scoreUnit: '分',
        info: JSON.stringify({
          headImg: player.avatar
        })
      }
    })
    ret.rankList = list
    if (gamePlayer) {
      ret.rank = await GamePlayer.current_position()
    }
    ret.isRankAll = ((start + limit) >= count)
    //console.log( " get_rank_list ret = ", ret)
    return ret
  }

}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = zhaobaba;
