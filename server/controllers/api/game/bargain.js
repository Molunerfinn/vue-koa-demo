// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 大屏摇一摇
//    游戏流程
//       开始签到->开始游戏->游戏结束
// 渲染摇一摇游戏的PC端和手机端界面
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'use strict';
import fetch from 'node-fetch'
<<<<<<< HEAD:server/controllers/api/games/bargain.js
import {
  Sequelize,
  GameRoundBargain,
  GamePlayer,
  GameResult,
  GameDay
} from '../../../models'
import {
  GameRoundStates
} from '../../../schema/constant'
import {
  FailMessage
} from '../../constant'
=======
import { Sequelize, BargainGameRound,  GamePlayer, GameResult, GameDay } from '../../../models'
import { GameRoundStates } from '../../../schema/constant'
import { FailMessage } from '../../constant'
>>>>>>> c31f2055345e8e77236cafbb1e884c2f395c108d:server/controllers/api/game/bargain.js
import log4 from 'koa-log4'
const logger = log4.getLogger('index')

const GAME_HOST = process.env.GAME_HOST || 'gm.vwweixin.faw-vw.com'
const GET_WX_PARAM_URL = process.env.GET_WX_PARAM_URL
const Op = Sequelize.Op;

class Bargain {

  /**
   * GET /play-wx - render contact page, either with contact form or submitted message
   */
  static async playWx(ctx) {
    console.log(0, "playWx")

    const ASSETS_BASE_PATH = '/game-bargain-assets'
    //http://10.224.40.46:8060/wechatclient/taskcenter/getForGamesign.html
    //const RUNLIN_GET_WX_PARAM_URL="http://10.224.40.46:8060/wechatclient/taskcenter/getForGamesign.html"

    // 取得用户和游戏的数据
    let game_round_id = ctx.params.id
    let to_game_player_id = ctx.query.to_game_player_id || 0
    let game_player_id = ctx.session.game_player_id
    //必须加入 game_round_id, 以免session没有过期但是无法进入新游戏
    let game_player = await GamePlayer.findOne({
      where: {
        id: game_player_id,
        game_round_id
      }
<<<<<<< HEAD:server/controllers/api/games/bargain.js
    })
    let to_game_player = game_player
    if (to_game_player_id) {
      to_game_player = (await GamePlayer.findOne({
        where: {
          id: to_game_player_id,
          game_round_id
        }
      })) || game_player
    }
    if (game_player) {

      let game_round = await GameRoundBargain.findById(game_round_id);
      // 检查当前用户的game_day
      let game_day = GameDay.findOrCreate({
        where: {
          game_round_id,
          game_player_id,
          day: new Date()
=======
      if( game_player ){

        let game_round = await BargainGameRound.findById(game_round_id);
        // 检查当前用户的game_day
        let game_day = GameDay.findOrCreate({where:{ game_round_id,game_player_id, day: new Date() }})

        //'109', 'oF9hV0SyZ6tI_k2WHtpRXqfedRH4', '14', NULL, 'try?', 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKQ6uAkRKEXBicIqEdKe4tkicM3Nr47VJq1HO5n2TkgGDg0AXXnfWtd3XQFQd3HyAOeYl15chtK6dRA/132', '5', '1', '2018-02-13 02:04:54', '2018-02-17 14:38:42', '50', '330', '0', '', '', '0', NULL, NULL, NULL, '0', NULL, '0yqL0nCmShgPF1dYpIjcNRw+tglqwoF6tLP55i2Q0Go=', '110101199003200517'
        //const link = `http://client.vw-dealer-wechat.faw-vw.com/wechatclient/game/${game_round_id}/cupcheck_in/gotoGame.html?appid=${game_round.appid}&code=null&state=null`

        let game_round_base_url = `/game-bargain/${game_round.id}`;
        const context = { game_round, game_round_base_url, game_player, to_game_player  };
        console.log( `game_round=${game_round.id} game_player=${game_player.id} to_game_player=${to_game_player.id}`)
        await ctx.render('games/bargain/play-wx', context);
      }else{
        const context = { msg: FailMessage.noPlayer  };
        await ctx.render('games/bargain/error-wx', context);
      }
      console.log(1, "playWx")

    }

    /**
     * 微信用户注册
     * GET /game-yiy/14/checkin-wx?openid=oF9hV0SyZ6tI_k2WHtpRXqfedRH4
     * parmas game_round_id, headimgurl, nickname, openid
     */
    static async checkinWx(ctx) {

      let game_round_id = ctx.params.id
      let openid = ctx.query.openid
      let to_game_player_id = ctx.query.to_game_player_id //被助力人id
      const current_game = await BargainGameRound.findById(game_round_id);
      const current_player = await GamePlayer.findOne({ where:{game_round_id, openid}});
      const context = { game_player:current_player };

      if( current_player ){
        // 用户再次扫码，重复进入
        ctx.session.game_player_id = current_player.id
        //找到，redirect playWx
        let url = 'play-wx'
        if( to_game_player_id ){
          url= `${url}?to_game_player_id=${to_game_player_id}`
>>>>>>> c31f2055345e8e77236cafbb1e884c2f395c108d:server/controllers/api/game/bargain.js
        }
      })

      //'109', 'oF9hV0SyZ6tI_k2WHtpRXqfedRH4', '14', NULL, 'try?', 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKQ6uAkRKEXBicIqEdKe4tkicM3Nr47VJq1HO5n2TkgGDg0AXXnfWtd3XQFQd3HyAOeYl15chtK6dRA/132', '5', '1', '2018-02-13 02:04:54', '2018-02-17 14:38:42', '50', '330', '0', '', '', '0', NULL, NULL, NULL, '0', NULL, '0yqL0nCmShgPF1dYpIjcNRw+tglqwoF6tLP55i2Q0Go=', '110101199003200517'
      //const link = `http://client.vw-dealer-wechat.faw-vw.com/wechatclient/game/${game_round_id}/cupcheck_in/gotoGame.html?appid=${game_round.appid}&code=null&state=null`

      let game_round_base_url = `/game-bargain/${game_round.id}`;
      const context = {
        game_round,
        game_round_base_url,
        game_player,
        to_game_player
      };
      console.log(`game_round=${game_round.id} game_player=${game_player.id} to_game_player=${to_game_player.id}`)
      await ctx.render('games/bargain/play-wx', context);
    } else {
      const context = {
        msg: FailMessage.noPlayer
      };
      await ctx.render('games/bargain/error-wx', context);
    }
<<<<<<< HEAD:server/controllers/api/games/bargain.js
    console.log(1, "playWx")

  }

  /**
   * 微信用户注册
   * GET /game-yiy/14/checkin-wx?openid=oF9hV0SyZ6tI_k2WHtpRXqfedRH4
   * parmas game_round_id, headimgurl, nickname, openid
   */
  static async checkinWx(ctx) {

    let game_round_id = ctx.params.id
    let openid = ctx.query.openid
    let to_game_player_id = ctx.query.to_game_player_id //被助力人id
    const current_game = await GameRoundBargain.findById(game_round_id);
    const current_player = await GamePlayer.findOne({
      where: {
        game_round_id,
        openid
=======

    // 取得助力游戏基本信息
    static async gameInfoWx( ctx ){
      console.log(0, "gameInfoWx")

      let game_round_id = ctx.query.game_round_id
      let game_player_id = ctx.query.game_player_id //助力人id
      let to_game_player_id = ctx.query.to_game_player_id //被助力人id，可能为空
      let url = ctx.query.url // 可能有 to_game_player_id 或者没有

      const game_round = await BargainGameRound.findById(game_round_id);

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
>>>>>>> c31f2055345e8e77236cafbb1e884c2f395c108d:server/controllers/api/game/bargain.js
      }
    });
    const context = {
      game_player: current_player
    };

    if (current_player) {
      // 用户再次扫码，重复进入
      ctx.session.game_player_id = current_player.id
      //找到，redirect playWx
      let url = 'play-wx'
      if (to_game_player_id) {
        url = `${url}?to_game_player_id=${to_game_player_id}`
      }
      console.log(`current_player=${current_player.id}, url=${url}`)

      ctx.redirect(url);

    } else {
      let params = {
        game_round_id: game_round_id,
        openid: ctx.query.openid,
        nickname: ctx.query.nickname,
        avatar: ctx.query.headimgurl
      }

      //创建玩家
      context.game_player = await GamePlayer.create(params)
      console.log("context.game_player= ", context.game_player)
      ctx.session.game_player_id = context.game_player.id
      let url = 'play-wx'
      if (to_game_player_id) {
        url = `${url}?to_game_player_id=${to_game_player_id}`
      }
      ctx.redirect(url);
    }

<<<<<<< HEAD:server/controllers/api/games/bargain.js
  }

  // 取得助力游戏基本信息
  static async gameInfoWx(ctx) {
    console.log(0, "gameInfoWx")

    let game_round_id = ctx.query.game_round_id
    let game_player_id = ctx.query.game_player_id //助力人id
    let to_game_player_id = ctx.query.to_game_player_id //被助力人id，可能为空
    let url = ctx.query.url // 可能有 to_game_player_id 或者没有

    const game_round = await GameRoundBargain.findById(game_round_id);

    const game_player = await GamePlayer.findById(game_player_id);

    // 参加此活动总人数和排名
    let game_player_rank = await GamePlayer.findAll({
      where: {
        game_round_id
      },
      order: [
        ['score', 'DESC'],
        ['id', 'ASC']
      ],
      limit: 20,
      offset: 0,
    })
    //$bargain_user_all = $user_mod->where(array("bargain_id" => $bargain_id))->order('new_price asc,id DESC')->limit("0,20")->select();
    let game_result = null;
    let to_game_player = game_player; // 被助力人缺省情况是自己
    console.log("before to_game_player_id")
    if (to_game_player_id) { // 如果有被助力人
      to_game_player = await GamePlayer.findById(to_game_player_id);
      // 判断是否为本机的活动 我要参与
      // 砍价日志的获取判断是否砍过
      game_result = await GameResult.findOne({
        where: {
          game_player_id,
          game_round_id,
          to_game_player_id: to_game_player_id
        }
      })
      //$list_log = M("bargain_log")->where(array("user_id" => $user_id, "openid" => $openid, "bargain_id" => $bargain_id))->select();
    } else {
      // 砍价日志的获取判断是否砍过
      game_result = await GameResult.findOne({
        where: {
          game_player_id,
          game_round_id,
          to_game_player_id: game_player_id
        }
      })
    }
    // 有多少助力成绩
    let game_result_rank = await GameResult.findAll({
      where: {
        game_round_id,
        to_game_player_id: to_game_player.id
      },
      include: [{
        model: GamePlayer
      }],
      limit: 20,
      offset: 0
    })
    //let giving_GamePlayer = await GamePlayer.findAll({ where:{ game_round_id, id:game_player_id }})

    let wx_config = {}
    let wx_share = {}
    try {
      // 分享链接应使用 checkin-wx，以便检查是否创建用户
      // link = http://client.vw-dealer-wechat.faw-vw.com/wechatclient/game/#{game_round_id}/cupcheck_in/gotoGame.html?appid=#{appid}&code=null&state=null
      let shareurl = `${GAME_HOST}/game-${game_round.code}/${game_round.id}/checkin-wx?to_game_player_id=${to_game_player.id}`
      let apiurl = `${GET_WX_PARAM_URL}?authorizerAppid=${game_round.appid}&url=${encodeURIComponent(url)}&shareurl=${encodeURIComponent(shareurl)}`
      console.log("playWx url=", apiurl)
      let res = await fetch(apiurl, {
        timeout: 2000,
        method: 'post'
      })
      if (res) {
        let data = await res.json()
        console.log("playWx data=", data)
        logger.info("playWx data=", data)
        wx_config = {
          appId: data['appId'],
          timestamp: data['timestamp'],
          nonceStr: data['nonceStr'],
          signature: data['signature']
        }
        //const link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx617b20b7ded64c67&redirect_uri=http%3A%2F%2Ftestwx.getstore.cn%2Fwapi%2Fv1%2Fwechatauth%2Fgameshareurl-done%3Fgameurl%3Dhttp%3A%2F%2Ftestwx.getstore.cn%2Fgame-bargain%2F${game_round.id}%2Fcheckin-wx%3Fto_game_player_id%3D${to_game_player.id}&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect`
        //const link = `${GAME_HOST}/game-bargain/${game_round_id}/checkin-wx?to_game_player_id=${to_game_player.id}`
        wx_share = {
          link: data['link'],
          img_url: `${GAME_HOST}/game-bargain-assets/app/images/share.jpg`
=======
    // 点击投票，助力，砍价
    static async pollWx( ctx ){

      let game_round_id = ctx.params.id
      let game_player_id = ctx.request.body.game_player_id //助力人id
      let to_game_player_id = ctx.request.body.to_game_player_id //被助力人id，可能为空
      const game_round = await BargainGameRound.findById(game_round_id);
      let game_player = await GamePlayer.findById(game_player_id);
      let to_game_player = await GamePlayer.findById(to_game_player_id);
      let data = { }
      if( game_player ){
        let remaining_score = game_round.final_score - to_game_player.score
        // 最低砍价和最高砍价间取随机数
        let max_score =  game_round.unit_score;
        // 需要砍掉的价格
        let score =  Math.round( Math.random()*max_score );
        // 砍完价以后现在的价格
        let new_score = to_game_player.score + score;
        // 砍到低价的时候不能超过底价  并且减去礼品
        if ( to_game_player.score < game_round.final_score ) {
           // 砍完价以后价格低于底价则修改为底价
            if ( new_score > game_round.final_score ) {
              score = game_round.final_score - to_game_player.score
              new_score = game_round.final_score
            }
            // 查询当前砍价人是否砍过价 没有则可以砍价并添加日志
            let game_result = await GameResult.findOne({ where:{ game_player_id, game_round_id, to_game_player_id: to_game_player_id }})
            if (!game_result ) {
              var options={ fields: ['game_round_id', 'game_player_id', 'to_game_player_id', 'score'] }
              var result_values = { game_round_id, game_player_id, to_game_player_id, score  }
              const game_result = await GameResult.create(result_values, options)
              var player_values = { score: new_score }
              await to_game_player.update( player_values )
              let game_result_rank = await GameResult.findAll({ where:{ game_round_id, to_game_player_id: to_game_player.id }, include: [{ model: GamePlayer }], order:[['score', 'DESC'], ['id', 'ASC']], limit: 20, offset: 0, })
              data.game_result_rank = game_result_rank //查询最新的好友助力榜
              data.game_result = game_result
              data.to_game_player = to_game_player
            }else{
              data.error = { msg:  '您已帮忙砍过价' }
            }
        } else {
          data.error = { msg:  '底价和现价相等' }
>>>>>>> c31f2055345e8e77236cafbb1e884c2f395c108d:server/controllers/api/game/bargain.js
        }
      }
    } catch (err) {
      logger.error("got error-", err)
      console.error("got error-", err)
    }

    //const link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx617b20b7ded64c67&redirect_uri=http%3A%2F%2Ftestwx.getstore.cn%2Fwapi%2Fv1%2Fwechatauth%2Fgameshareurl-done%3Fgameurl%3Dhttp%3A%2F%2Ftestwx.getstore.cn%2Fgame-bargain%2F${game_round.id}%2Fcheckin-wx%3Fto_game_player_id%3D${to_game_player.id}&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect`
    //const link = `${GAME_HOST}/game-bargain/${game_round_id}/checkin-wx?to_game_player_id=${to_game_player.id}`

    ctx.body = {
      game_round,
      game_player_rank,
      game_player,
      to_game_player,
      game_result,
      game_result_rank,
      wx_config,
      wx_share
    }
    console.log(1, "gameInfoWx")
  }

  // 点击投票，助力，砍价
  static async pollWx(ctx) {

    let game_round_id = ctx.params.id
    let game_player_id = ctx.request.body.game_player_id //助力人id
    let to_game_player_id = ctx.request.body.to_game_player_id //被助力人id，可能为空
    const game_round = await GameRoundBargain.findById(game_round_id);
    let game_player = await GamePlayer.findById(game_player_id);
    let to_game_player = await GamePlayer.findById(to_game_player_id);
    let data = {}
    if (game_player) {
      let remaining_score = game_round.final_score - to_game_player.score
      // 最低砍价和最高砍价间取随机数
      let max_score = game_round.unit_score;
      // 需要砍掉的价格
      let score = Math.round(Math.random() * max_score);
      // 砍完价以后现在的价格
      let new_score = to_game_player.score + score;
      // 砍到低价的时候不能超过底价  并且减去礼品
      if (to_game_player.score < game_round.final_score) {
        // 砍完价以后价格低于底价则修改为底价
        if (new_score > game_round.final_score) {
          score = game_round.final_score - to_game_player.score
          new_score = game_round.final_score
        }
        // 查询当前砍价人是否砍过价 没有则可以砍价并添加日志
        let game_result = await GameResult.findOne({
          where: {
            game_player_id,
            game_round_id,
            to_game_player_id: to_game_player_id
          }
        })
        if (!game_result) {
          var options = {
            fields: ['game_round_id', 'game_player_id', 'to_game_player_id', 'score']
          }
          var result_values = {
            game_round_id,
            game_player_id,
            to_game_player_id,
            score
          }
          const game_result = await GameResult.create(result_values, options)
          var player_values = {
            score: new_score
          }
          await to_game_player.update(player_values)
          let game_result_rank = await GameResult.findAll({
            where: {
              game_round_id,
              to_game_player_id: to_game_player.id
            },
            include: [{
              model: GamePlayer
            }],
            order: [
              ['score', 'DESC'],
              ['id', 'ASC']
            ],
            limit: 20,
            offset: 0,
          })
          data.game_result_rank = game_result_rank //查询最新的好友助力榜
          data.game_result = game_result
          data.to_game_player = to_game_player
        } else {
          data.error = {
            msg: '您已帮忙砍过价'
          }
        }
      } else {
        data.error = {
          msg: '底价和现价相等'
        }
      }
    } else {
      data.error = {
        msg: '你没有参加此活动'
      }
    }
    ctx.body = data

  }

  //查询最新的好友助力榜
  static async gameResultRank(ctx) {
    let game_round_id = ctx.params.id
    let per_page = (ctx.request.body.per_page || 20) //助力人id
    let game_player_id = ctx.request.body.game_player_id
    per_page = parseInt(per_page)
    let game_result_rank = await GameResult.findAll({
      where: {
        game_round_id,
        to_game_player_id: game_player_id
      },
      include: [{
        model: GamePlayer
      }],
      order: [
        ['score', 'DESC'],
        ['id', 'ASC']
      ],
      limit: per_page,
      offset: 0,
    })

    ctx.body = {
      game_result_rank
    }
  }

  //点击获取用户排名
  static async gamePlayerRank(ctx) {
    let game_round_id = parseInt(ctx.params.id)
    let per_page = parseInt(ctx.request.body.per_page || 20) //助力人id
    let game_player_id = ctx.request.body.game_player_id // 手机端用户查询自己排名
    console.log("gamePlayerRank1: per_page=", per_page, "game_player_id=", game_player_id)
    let game_player = {}
    if (game_player_id) {
      game_player = await GamePlayer.findById(game_player_id)
      //   (score > game_player.score) || (score == game_player.score)
      let position = await GamePlayer.count({
        where: {
          game_round_id,
          [Op.or]: {
            score: {
              [Op.gt]: game_player.score
            },
            [Op.and]: {
              score: game_player.score,
              id: {
                [Op.lt]: game_player.id
              }
            }
          }
        }
      })
      game_player.rank = position + 1
    }
    let game_player_rank = await GamePlayer.findAll({
      where: {
        game_round_id
      },
      order: [
        ['score', 'DESC'],
        ['id', 'ASC']
      ],
      limit: per_page,
      offset: 0
    })
    game_player_rank.forEach((item, i) => {
      item.rank = i + 1
    })
    ctx.body = {
      game_player_rank,
      game_player
    }
  }

  //更新玩家联系方式
  static async updateGamePlayerContactWx(ctx) {
    let game_round_id = ctx.params.id
    let game_player_id = ctx.session.game_player_id //游戏玩家id
    let game_player_values = ctx.request.body.game_player //游戏玩家需要更新的信息 { realname, cellphone }
    let game_player = await GamePlayer.findById(game_player_id);
    await game_player.update(game_player_values)

    ctx.body = {
      game_player
    }
  }


  /**
   *  更新用户统计信息
   * @param {*} ctx
   *            ctx.params.id
   *            ctx.session.game_player_id
   */
  static async updateGameDayWx(ctx) {
    let game_round_id = ctx.params.id
    let game_player_id = ctx.session.game_player_id //游戏玩家id
    let share = ctx.request.body.share
    let game_player = await GamePlayer.findById(game_player_id);
    // [game_day, boolean]
    let [game_day, is_created] = await GameDay.findOrCreate({
      where: {
        game_round_id,
        game_player_id,
        day: new Date()
      }
    })
    if (share) {
      await game_day.increment("share_count")
    }
    await game_day.reload()
    ctx.body = {
      game_day
    }
  }
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = Bargain;
