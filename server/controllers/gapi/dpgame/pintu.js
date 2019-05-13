/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* WWW handlers (invoked by router to render templates)                                           */
/*                                                                                                */
/* All functions here either render or redirect, or throw.                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';
var MAX_TIME = 9999.99

const fetch = require('node-fetch')
const {
  getGameRoundModelByCode,
  getGamePlayerModelByCode,
  getGameResultModelByCode
} = require('../../../helpers/model')

var config = require('../../../config/weixin.js');
var OAuth = require('co-wechat-oauth');
var client = new OAuth(config.appid, config.secret);

const WechatAPI = require('co-wechat-api');
const wechatApi = new WechatAPI(config.appid, config.secret);
var wechatOAuth = new OAuth(config.appid, config.secret);
import {
  DpGameRoundStates
} from '../../../models/constant'


// 'getResult' 取得抽奖结果
//  getRankList' 排行榜
//  joinGameBehavior
// match '/ajax/logAjaxErr_h.jsp', to: 'game_log#log_ajax_error', via: [:get, :post]
// match '/ajax/log_h.jsp', to: 'game_log#log', via: [:get, :post]
// match '/ajax/logJsErr_h.jsp', to: 'game_log#log_js_error', via: [:get, :post]
// match '/ajax/hdgame_h.jsp', to: 'game_log#hdgame', via: [:get, :post]
class pintu {
  static async contactInfo(ctx) {
    let context = {}
    await ctx.render('games/common/contactInfo', context);
  }
  static async login(ctx) {
    console.log('login');
    let code = ctx.params.code
    let number = ctx.params.number

    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.appid + '&redirect_uri=http://testwx.getstore.cn/gapi/dppintu/pintu/' + number + '/get_wx_info&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
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
    console.log(' http://testwx.getstore.cn/pintu-play.html' + params)
    ctx.redirect('http://testwx.getstore.cn/pintu-play.html' + params)
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
    new_player.score = MAX_TIME
    new_player.max_score = MAX_TIME
    console.log('new_player', new_player);

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
      ctx.throw(messageContent.ResponeStatus.CommonError, 'can not get wx js config fail' + ': ' + error, {
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
      let apiurl = 'http://testwx.getstore.cn/gapi/dppintu/dppintu/getWxJsConfig'
      console.log("playWx url=", apiurl)

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
        console.log("playWx data=", data)
        var wx_config = {
          appId: data['appId'],
          timestamp: data['timestamp'],
          nonceStr: data['nonceStr'],
          signature: data['signature']
        }

        // const link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx617b20b7ded64c67&redirect_uri=http%3A%2F%2Ftestwx.getstore.cn%2Fwapi%2Fv1%2Fwechatauth%2Fgameshareurl-done%3Fgameurl%3Dhttp%3A%2F%2Ftestwx.getstore.cn%2Fgame-bargain%2F${game_round.id}%2Fcheckin-wx%3Fto_game_player_id%3D${to_game_player.id}&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect`
        // const link = `${GAME_HOST}/game-bargain/${game_round_id}/checkin-wx?to_game_player_id=${to_game_player.id}`
        // add default shareurl, or js error.
        // wx_share = {
        //   link: data['link'] || shareurl,
        //   // img_url: `${GAME_HOST}/game-kouhong-assets/app/images/share.jpg`
        // }
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

    if (openid == null || openid == undefined) {
      ctx.body = null
    } else {
      let gameRound = await GameRound.findOne({
        where: {
          number
        }
      })
      gameRound.playPath = GameRound.getPlayPath()
      gameRound.contralPath = GameRound.getContralPath()

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
          score: MAX_TIME,
          max_score: MAX_TIME
        }
        if (gameRound.contact_required == 0) {
          var options = {
            fields: ['openid', 'nickname', 'avatar', 'game_round_id', 'score', 'max_score', 'token']
          }
          let res = await GamePlayer.create(gamePlayer, options)
        }

        var gameInfo = {
          gameRound: gameRound,
          gamePlayer: gamePlayer,
          wx_config: wx_config
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
        if (gamePlayer.score == MAX_TIME) {
          ret.score = 0
        }
        let rank = await gamePlayer.currentPositionAsc()
        let beat = await gamePlayer.beatAsc()
        ret.rank = rank
        ret.beat = beat
        ret.hasLot = false

        var gameInfo = {
          gameRound: gameRound,
          gamePlayer: gamePlayer,
          gameResult: gameResult,
          wx_config: wx_config,
          ret: ret
        }
      }

      ctx.body = gameInfo
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
    console.log('parsed-----------:', parsed);
    let openid = parsed.openid
    let cmd = 'setAchieve'
    if (cmd == 'setAchieve') { //设置成绩
      let gameRound = await GameRound.findOne({
        where: {
          number
        }
      })
      gameRound.playPath = GameRound.getPlayPath()
      gameRound.contralPath = GameRound.getContralPath()
      console.log(DpGameRoundStates.started);
      if (gameRound.state == DpGameRoundStates.started) {

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
                console.log('time--:', score);
                let lastMaxScore = gamePlayer.max_score
                console.log('lastMaxScore--:', lastMaxScore);
                //game_result = set_achieve
                let gameResultParams = {
                  game_player_id: gamePlayerId,
                  score: score,
                  game_round_id: gameRound.id,
                  start_at: gameRound.start_at
                }

                console.log('gameResultParams--:', gameResultParams);

                let gameResult = GameResult.build(gameResultParams)
                let result = await gameResult.save()
                await gamePlayer.update({
                  score: gameResult.score
                })

                if (gameResult.score < lastMaxScore) {
                  await gamePlayer.update({
                    max_score: gameResult.score
                  })
                }
                ret.playerId = gamePlayer.id //required to set g_config.playerId
                ret.isSuc = gamePlayer.score < gameRound.duration
                ret.achieveToken = gamePlayer.token
                ret.score = gameResult.score
                if (gameResult.score == MAX_TIME) {
                  ret.score = 0
                }
                ret.bestScore = (gamePlayer.max_score) //bestScore
                let rank = await gamePlayer.currentPositionAsc()
                let beat = await gamePlayer.beatAsc()
                ret.rank = rank
                ret.beat = beat
                ret.hasLot = false
                console.log("setAchieve= ", ret, "lastMaxScore=", lastMaxScore)
      }
    }
    // else if(cmd == 'getRankList' ){//排行榜
    //
    // }else if(cmd == 'getMatchResult' ){//取得比赛投票结果
    //   //r.merge!( get_match_result )
    // }else if(cmd == 'joinGameBehavior' ){//
    //   //session[:game_start_at] = DateTime.current
    //   //join_game_behavior
    // }else if(cmd == 'getGiftList' ){//排行榜
    //   let list = []
    //   let awardModel = {awardtype:1,cbt:Date(), cet:Date(), deadline:'这是使用期限'}
    //   // 0: 未领"; 1:已核销 2:未核销 3:已过期 4:已作废 5:已失效
    //   let award = { anwei: false, awardLevel: 0, level: 1, codeStatus: 0, awardCode: 'awardCode', awardStyle:'几等奖', awardName:'奖品名称', awardInfo: awardModel.to_json }
    //   list.push( award )
    //   ret.list = list
    // }else if(cmd == 'getResult' ){//取得抽奖结果
    //   //r.merge!( get_rank_list )
    // }else if(cmd == 'getJoinNum' ){//我的奖品
    //   //r['joinNum'] = get_join_num
    // }else if(cmd == 'setPhone' ){//设置联系方式
    //
    // }
    // 客户的执行 $.parseJSON(ret) 处理
    ctx.body = JSON.stringify(ret)
  }

  static async getRanking(ctx) {
    let ret = {
      rt: 0,
      isSuc: true,
      success: true
    }

    let openid = ctx.query._openId
    let start = parseInt(ctx.query.start)
    let limit = parseInt(ctx.query.limit)
    let game_player_id = ctx.query.playerId
    let game_player = await GamePlayer.findOne({
      where: {
        id: game_player_id,
        openid
      }
    })
    let rank_list = await GameBaseByCode.get_rank_list(game_player, start, limit)
    ret = Object.assign(ret, rank_list)
    ctx.body = JSON.stringify(ret)
  }

  static async setPhone(ctx) {

    let openid = ctx.query._openId
    let userInfo = JSON.parse(ctx.request.body.userInfo)
    console.log("ctx.request.body ", ctx.request.body, "userInfo=", userInfo)
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

module.exports = pintu;
