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
} = require('../../game_round_helper')

var config = require(`../../../config/weixin.js`);
var OAuth = require('co-wechat-oauth');
var client = new OAuth(config.appid, config.secret);

const WechatAPI = require('co-wechat-api');
const wechatApi = new WechatAPI(config.appid, config.secret);
var wechatOAuth = new OAuth(config.appid, config.secret);
import {
  GameRoundStates
} from '../../../models/constant'

class zhaobaba {
  static async contactInfo(ctx) {
    let context = {}
    await ctx.render('games/common/contactInfo', context);
  }
  static async login(ctx) {
    console.log('login');
    let code = ctx.params.code
    let number = ctx.params.number

    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.appid + '&redirect_uri=http://testwx.getstore.cn/gapi/zhaobaba/zhaobaba/' + number + '/get_wx_info&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
    ctx.redirect(url)
  }

  static async get_wx_info(ctx) {
    console.log('get_wx_info');
    let number = ctx.params.number
    let code = ctx.query.code

    var token = await client.getAccessToken(code);
    console.log('token:', token);
    var accessToken = token.data.access_token;
    console.log('accessToken:', accessToken);
    var openid = token.data.openid;
    console.log('openid:', openid);
    var userInfo = await client.getUser(openid);
    console.log('userInfo:', userInfo);
    let params = '?openid=' + userInfo.openid + '&headimgurl=' + userInfo.headimgurl + '&nickname=' + encodeURIComponent(userInfo.nickname) + '&number=' + number;
    console.log(' http://testwx.getstore.cn/zhaobaba.html' + params)
    ctx.redirect('http://testwx.getstore.cn/zhaobaba.html' + params)
  }

  static async postMsg(ctx) {
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
    let new_player = ctx.request.body.gamePlayer
    new_player.score = 0
    new_player.max_score = 0


    var options = {
      fields: ['openid', 'nickname', 'avatar', 'game_round_id', 'realname', 'tel', 'score', 'max_score', 'token']
    }
    let res = await GamePlayer.create(new_player, options)

    ctx.body = res
  }

  static async getWxJsConfig(ctx) {
    try {
      console.log('getWxJsConfig  ctx------:', ctx.request.body);
      let url = ctx.request.body.url
      let shareurl = ctx.query.shareurl
      var param = {
        debug: false,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
        url: url
      };
      let ticket = await wechatApi.getLatestTicket()
      console.debug("getLatestTicket=", ticket, "url=", url)

      let data = await wechatApi.getJsConfig(param);

      if (shareurl) {
        //var link = wechatOAuth.getAuthorizeURL(config.authdomain + '/wapi/v1/wechatauth/gameshareurl-done?shareurl='+shareurl, 'state', 'snsapi_userinfo');
        var link = config.authdomain + '/wapi/v1/wechatauth/gameshareurl?shareurl=' + encodeURIComponent(shareurl)
        data.link = link
      }
      console.debug(" getWxJsConfig data = ", data)
      ctx.body = data
      ctx.status = 200
    } catch (error) {
      ctx.throw( 'can not get wx js config fail' + ': ' + error, {
        expose: true
      })
    }
  }

  static async getGameResult(ctx) {
    try {
      let url = ctx.header.referer
      console.log("url=======", url)
      // let shareurl = `${GAME_HOST}/game-${game_round.code}/${game_round.id}/checkin-wx?to_game_player_id=${to_game_player.id}`

      let body = {
        url: url
      }
      let apiurl = 'http://testwx.getstore.cn/gapi/zhaobaba/zhaobaba/getWxJsConfig'

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
