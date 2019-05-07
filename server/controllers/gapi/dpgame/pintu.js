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

var config = require(`../../../config/wechat.development.json`);
var wechat_config = config.wechat;
var OAuth = require('co-wechat-oauth');
var client = new OAuth(wechat_config.appid, wechat_config.secret);


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

    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wechat_config.appid + '&redirect_uri=http://testwx.getstore.cn/gapi/dppintu/pintu/' + number + '/get_wx_info&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
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
    let openid = ctx.request.body.openid
    let GameRound = getGameRoundModelByCode(code)
    let GamePlayer = getGamePlayerModelByCode(code)
    let realname = ctx.request.body.realname
    let cellphone = ctx.request.body.tel
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
    console.log('gamePlayer', gamePlayer);
    let res = await gamePlayer.update({
      realname: realname,
      cellphone: cellphone
    })
    ctx.body = res
  }

  static async getGameResult(ctx) {
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

    let gamePlayer = await GamePlayer.findOne({
      where: {
        game_round_id: gameRound.id,
        openid: openid,
      }
    })

    if (gamePlayer == null || gamePlayer == undefined) {
      var new_player = {
        openid: parsed.openid,
        nickname: parsed.nickname,
        avatar: parsed.headimgurl,
        game_round_id: gameRound.id,
      }

      var options = {
        fields: ['openid', 'nickname', 'avatar', 'game_round_id']
      }
      gamePlayer = await GamePlayer.create(new_player, options)
    }

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
    ret.score = (gamePlayer.max_score) //bestScore
    let rank = await gamePlayer.currentPosition()
    let beat = await gamePlayer.beat()
    ret.rank = rank
    ret.beat = beat
    ret.hasLot = false

    let gameInfo = {
      gameRound: gameRound,
      gamePlayer: gamePlayer,
      gameResult: gameResult,
      ret: ret
    }

    ctx.body = gameInfo

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
    console.log('parsed-----------:',parsed);
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
      let start_at = gameRound.start_at
      let now = new Date();
      console.log('now--:', now);
      let gamePlayerId = gamePlayer.id
      let score = now - start_at
      let s = Math.floor(score / 1000) - 4
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
      ret.isSuc = gamePlayer.score < lastMaxScore
      ret.achieveToken = gamePlayer.token
      ret.score = gameResult.score
      ret.bestScore = (gamePlayer.max_score) //bestScore
      let rank = await gamePlayer.currentPosition()
      let beat = await gamePlayer.beat()
      ret.rank = rank
      ret.beat = beat
      ret.hasLot = false
      console.log("setAchieve= ", ret, "lastMaxScore=", lastMaxScore)
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
