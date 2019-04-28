/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* WWW handlers (invoked by router to render templates)                                           */
/*                                                                                                */
/* All functions here either render or redirect, or throw.                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const fetch = require('node-fetch')
const { getGameRoundModelByCode, getGamePlayerModelByCode, getGameResultModelByCode } = require('../game_round_helper')

// match '/ajax/logAjaxErr_h.jsp', to: 'game_log#log_ajax_error', via: [:get, :post]
// match '/ajax/log_h.jsp', to: 'game_log#log', via: [:get, :post]
// match '/ajax/logJsErr_h.jsp', to: 'game_log#log_js_error', via: [:get, :post]
// match '/ajax/hdgame_h.jsp', to: 'game_log#hdgame', via: [:get, :post]
class GameBaseByCode {
    static async contactInfo(ctx) {
      let context={}
      await ctx.render('games/common/contactInfo', context);
    }

    static async setAchieve(ctx) {
      console.log("hdgame_h=", ctx.query )
      let ret = { rt: 0, isSuc: true, success: true }
      let code = ctx.params.code
      let GameRound = getGameRoundModelByCode( code )
      let GamePlayer = getGamePlayerModelByCode( code )
      let GameResult = getGameResultModelByCode( code )


      let number = ctx.params.number
      let game_round_id = ctx.params.id
      let cmd = ctx.query.cmd
      if( cmd == 'setAchieve'){     //设置成绩
        let openid = ctx.query._openId
        let gameRound = await GameRound.findOne( { where: { number} } )

        let gamePlayer = await GamePlayer.findOne({ where: { game_round_id: gameRound.id, openid} } )
        let gamePlayerId = gamePlayer.id
        let score = ctx.query.gameScore
        let lastMaxScore = (await GameResult.max( "score", { where: {gamePlayerId}})) || 0
        //game_result = set_achieve
        let gameResultParams = { game_player_id: gamePlayerId, score, game_round_id:  gameRound.id }

        let gameResult = GameResult.build(gameResultParams)
        gameResult.ip = ctx.request.ip
        gameResult.start_at = ctx.session.game_start_at
        let result = await GameResult.save()

        if( gameResult.score > lastMaxScore){
          await gamePlayer.update( {score: gameResult.score })
        }
        ret.playerId = gamePlayer.id //required to set g_config.playerId
        ret.isSuc = gamePlayer.score >  lastMaxScore
        ret.achieveToken= gamePlayer.token
        ret.score = ( gamePlayer.score )  //bestScore
        let rank = await gamePlayer.current_position()
        let beat = await gamePlayer.beat()
        ret.rank = rank
        ret.beat = beat
        ret.hasLot =  false
console.log( "setAchieve= ", ret, "lastMaxScore=", lastMaxScore )
      }else if(cmd == 'getRankList' ){//排行榜
        let openid = ctx.query._openId
        let start = parseInt(ctx.query.start)
        let limit = parseInt(ctx.query.limit)
        let game_player_id = ctx.query.playerId
        let game_player = await GamePlayer.findOne({ where: { id: game_player_id, openid} } )
        let rank_list = await GameBaseByCode.get_rank_list( game_player, start, limit )
        ret = Object.assign(ret, rank_list )
      }else if(cmd == 'getMatchResult' ){//取得比赛投票结果
        //r.merge!( get_match_result )
      }else if(cmd == 'joinGameBehavior' ){//排行榜
        //session[:game_start_at] = DateTime.current
        //join_game_behavior
      }else if(cmd == 'getGiftList' ){//我的奖品
        let list = []
        let awardModel = {awardtype:1,cbt:Date(), cet:Date(), deadline:'这是使用期限'}
        // 0: 未领"; 1:已核销 2:未核销 3:已过期 4:已作废 5:已失效
        let award = { anwei: false, awardLevel: 0, level: 1, codeStatus: 0, awardCode: 'awardCode', awardStyle:'几等奖', awardName:'奖品名称', awardInfo: awardModel.to_json }
        list.push( award )
        ret.list = list
      }else if(cmd == 'getResult' ){//取得抽奖结果
        //r.merge!( get_rank_list )
      }else if(cmd == 'getJoinNum' ){//我的奖品
        //r['joinNum'] = get_join_num
      }else if(cmd == 'setPhone' ){//设置联系方式
        let openid = ctx.query._openId
        let userInfo = JSON.parse(ctx.request.body.userInfo)
        console.log( "ctx.request.body ", ctx.request.body,"userInfo=", userInfo  )
        let game_player_values  = { realname: userInfo.ausername, cellphone: userInfo.aphone } //游戏玩家需要更新的信息 { realname, cellphone }
        let game_player = await GamePlayer.findOne({ where: { game_round_id, openid} } )
        await  game_player.update( game_player_values )
      }
      // 客户的执行 $.parseJSON(ret) 处理
      ctx.body = JSON.stringify( ret )
    }

    static async get_rank_list( gamePlayer, start, limit ) {
      let game_round_id = gamePlayer.game_round_id
      let ret = {rank: 0}

      let count =  await GamePlayer.count({where:{game_round_id}})
      let players = await GamePlayer.findAll({where:{game_round_id}, order:[ ['score', 'DESC'],['created_at', 'ASC']], offset: start, limit: limit})

      let list = players.map((player)=>{
        return { name: player.nickname, achievement: player.score, scoreUnit: '分', info: JSON.stringify({headImg: player.avatar})  }
      })
      ret.rankList = list
      if( gamePlayer ){
        ret.rank = await GamePlayer.current_position()
      }
      ret.isRankAll = ((start+limit) >= count)
      //console.log( " get_rank_list ret = ", ret)
      return ret
    }

  }


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = GameBaseByCode;
