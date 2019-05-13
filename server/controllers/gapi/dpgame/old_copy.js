// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 大屏拼图
//    游戏流程
//       开始签到->开始游戏->游戏结束
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'use strict';
import fetch from 'node-fetch'
import { DpPintuGameRound  } from '../../../models'
import { Sequelize, GameRoundStates } from '../../../models'
import { FailMessage } from '../../constant'
import log4 from 'koa-log4'
const logger = log4.getLogger('index')

const GAME_URL_BASE = process.env.GAME_URL_BASE
const GET_WX_PARAM_URL = process.env.GET_WX_PARAM_URL
const Op = Sequelize.Op;

export default class DpPintu {

  static permittedAttributes = ['number', 'name', 'start_at', 'end_at']

  /**
   * 取得游戏基本信息
   * @param {*} ctx
   *   query: number game_round.number
   */
  static async gameInfo( ctx ){
    let number = ctx.query.number
    const gameround = await DpPintuGameRound.findOne( { where:{ number }, attributes: DpPintu.permittedAttributes } )
    ctx.body = { gameround }
  }
  /**
   * 取得游戏基本信息
   * @param {*} ctx
   *   query: number game_round.number
   */
  static async gameInfoWx( ctx ){
    console.log(0, "gameInfo")

    let game_round_id = ctx.query.number

    let url = ctx.query.url // 可能有 to_game_player_id 或者没有

    const game_round = await DpPintuGameRound.findById(game_round_id);

    const game_player = await GamePlayer.findById(game_player_id);

    // 参加此活动总人数和排名
    let game_player_rank = await GamePlayer.findAll({ where:{ game_round_id }, order:[['score', 'DESC'], ['id', 'ASC']], limit: 20, offset: 0, })
    //$bargain_user_all = $user_mod->where(array("bargain_id" => $bargain_id))->order('new_price asc,id DESC')->limit("0,20")->select();
    let game_result = null;
    let to_game_player = game_player; // 被助力人缺省情况是自己
console.log( "before to_game_player_id")
    if( to_game_player_id ){// 如果有被助力人
       to_game_player = await GamePlayer.findById(to_game_player_id);
        // 判断是否为本机的活动 我要参与
        // 砍价日志的获取判断是否砍过
        game_result = await GameResult.findOne({ where:{ game_player_id, game_round_id, to_game_player_id: to_game_player_id }})
        //$list_log = M("bargain_log")->where(array("user_id" => $user_id, "openid" => $openid, "bargain_id" => $bargain_id))->select();
    }else{
      // 砍价日志的获取判断是否砍过
      game_result = await GameResult.findOne({ where:{ game_player_id, game_round_id, to_game_player_id: game_player_id }})
    }
    // 有多少助力成绩
    let game_result_rank = await GameResult.findAll({ where:{ game_round_id, to_game_player_id: to_game_player.id }, include: [{ model: GamePlayer }], limit: 20, offset: 0})
    //let giving_GamePlayer = await GamePlayer.findAll({ where:{ game_round_id, id:game_player_id }})

    let wx_config ={}
    let wx_share ={}
    try{
      // 分享链接应使用 checkin-wx，以便检查是否创建用户
      // link = http://client.vw-dealer-wechat.faw-vw.com/wechatclient/game/#{game_round_id}/cupcheck_in/gotoGame.html?appid=#{appid}&code=null&state=null
      let shareurl = `${GAME_URL_BASE}/game-${game_round.code}/${game_round.id}/checkin-wx?to_game_player_id=${to_game_player.id}`
      let apiurl = `${GET_WX_PARAM_URL}?authorizerAppid=${game_round.appid}&url=${encodeURIComponent(url)}&shareurl=${encodeURIComponent(shareurl)}`
      console.log( "playWx url=", apiurl)
      let res = await fetch(apiurl, { timeout:2000, method:'post' })
      if( res ){
        let data = await res.json()
        console.log( "playWx data=",data )
        logger.info("playWx data=",data)
        wx_config = {  appId: data['appId'], timestamp: data['timestamp'], nonceStr:data['nonceStr'],signature:data['signature']}
        //const link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx617b20b7ded64c67&redirect_uri=http%3A%2F%2Ftestwx.getstore.cn%2Fwapi%2Fv1%2Fwechatauth%2Fgameshareurl-done%3Fgameurl%3Dhttp%3A%2F%2Ftestwx.getstore.cn%2Fgame-bargain%2F${game_round.id}%2Fcheckin-wx%3Fto_game_player_id%3D${to_game_player.id}&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect`
        //const link = `${GAME_URL_BASE}/game-bargain/${game_round_id}/checkin-wx?to_game_player_id=${to_game_player.id}`
        wx_share = { link: data['link'], img_url: `${GAME_URL_BASE}/game-bargain-assets/app/images/share.jpg`}
      }
    }catch(err){
      logger.error("got error-",err)
      console.error("got error-",err)
    }

    //const link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx617b20b7ded64c67&redirect_uri=http%3A%2F%2Ftestwx.getstore.cn%2Fwapi%2Fv1%2Fwechatauth%2Fgameshareurl-done%3Fgameurl%3Dhttp%3A%2F%2Ftestwx.getstore.cn%2Fgame-bargain%2F${game_round.id}%2Fcheckin-wx%3Fto_game_player_id%3D${to_game_player.id}&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect`
    //const link = `${GAME_URL_BASE}/game-bargain/${game_round_id}/checkin-wx?to_game_player_id=${to_game_player.id}`

    ctx.body = { game_round, game_player_rank, game_player, to_game_player, game_result, game_result_rank, wx_config, wx_share }
    console.log(1, "gameInfoWx")
  }


}
