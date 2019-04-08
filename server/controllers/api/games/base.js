/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* WWW handlers (invoked by router to render templates)                                           */
/*                                                                                                */
/* All functions here either render or redirect, or throw.                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const fetch = require('node-fetch');
import { Sequelize, GameRoundBargain,  GamePlayer, GameResult, GameDay } from '../../../models'

// handle hd.fk
// match '/ajax/logAjaxErr_h.jsp', to: 'game_log#log_ajax_error', via: [:get, :post]
// match '/ajax/log_h.jsp', to: 'game_log#log', via: [:get, :post]
// match '/ajax/logJsErr_h.jsp', to: 'game_log#log_js_error', via: [:get, :post]
// match '/ajax/hdgame_h.jsp', to: 'game_log#hdgame', via: [:get, :post]
class Base {
    static async contactInfo(ctx) {
      let context={}
      await ctx.render('games/common/contactInfo', context);
    }

    static async setAchieve(ctx) {
      console.log("hdgame_h=", ctx.query )
      let ret = { rt: 0, isSuc: true, success: true }
      let game_round_id = ctx.params.id
      let cmd = ctx.query.cmd
      if( cmd == 'setAchieve'){     //设置成绩
        let openid = ctx.query._openId
        let game_player = await game_players.findOne({ where: { game_round_id, openid} } )
        let game_player_id = game_player.id
        let score = ctx.query.gameScore
        let last_max_score = (await game_results.max( "score", { where: {game_player_id}})) || 0
        //game_result = set_achieve
        let game_result_params = { game_player_id, score, game_round_id }

        let game_result = game_results.build(game_result_params)
        game_result.ip = ctx.request.ip
        game_result.start_at = ctx.session.game_start_at
        let result = await game_result.save()

        if( game_result.score > last_max_score){
          await game_player.update( {score: game_result.score })
        }
        ret.playerId = game_player.id //required to set g_config.playerId
        ret.isSuc = game_result.score >  last_max_score
        ret.achieveToken= game_player.token
        ret.score = ( game_player.score )  //bestScore
        let rank = await game_player.current_position()
        let beat = await game_player.beat()
        ret.rank = rank
        ret.beat = beat
        ret.hasLot =  false
console.log( "setAchieve= ", ret, "last_max_score=", last_max_score )
      }else if(cmd == 'getRankList' ){//排行榜
        let openid = ctx.query._openId
        let start = parseInt(ctx.query.start)
        let limit = parseInt(ctx.query.limit)
        let game_player_id = ctx.query.playerId
        let game_player = await game_players.findOne({ where: { id: game_player_id, openid} } )
        let rank_list = await GameLog.get_rank_list( game_player, start, limit )
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
        let game_player = await game_players.findOne({ where: { game_round_id, openid} } )
        await  game_player.update( game_player_values )
      }
      // 客户的执行 $.parseJSON(ret) 处理
      ctx.body = JSON.stringify( ret )
    }

    static async get_rank_list( game_player, start, limit ) {
      let game_round_id = game_player.game_round_id
      let ret = {rank: 0}

      let count =  await game_players.count({where:{game_round_id}})
      let players = await game_players.findAll({where:{game_round_id}, order:[ ['score', 'DESC'],['created_at', 'ASC']], offset: start, limit: limit})

      let list = players.map((player)=>{
        return { name: player.nickname, achievement: player.score, scoreUnit: '分', info: JSON.stringify({headImg: player.avatar})  }
      })
      ret.rankList = list
      if( game_player ){
        ret.rank = await game_player.current_position()
      }
      ret.isRankAll = ((start+limit) >= count)
      //console.log( " get_rank_list ret = ", ret)
      return ret
    }

  }


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = Base;
