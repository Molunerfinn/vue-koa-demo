import fetch from 'node-fetch'
import {
  IdoGameRound,
  IdoGameRoundStoreGift,
  IdoGift,
  IdoPlayer,
  IdoPlayerInfo,
  IdoResult,
  IdoStroe
} from '../../../models'
import {
  Sequelize
} from '../../../models'
const Op = Sequelize.Op;
import log4 from 'koa-log4'
const logger = log4.getLogger('index')

var config = require(`../../../config/wechat.development.json`);
var wechat_config = config.wechat;
var OAuth = require('co-wechat-oauth');
var client = new OAuth(wechat_config.appid, wechat_config.secret);

class Ido {
  static async login(ctx) {
    console.log('login');
    let to_player_id = ctx.query.to_player_id
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wechat_config.appid + '&redirect_uri=http://testwx.getstore.cn/gapi/ido/get_wx_info&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'+'&to_player_id='+to_player_id;
    ctx.redirect(url)
  }

  static async get_wx_info(ctx) {
    let code = ctx.query.code
    let to_player_id = ctx.query.code
    var token = await client.getAccessToken(code);
    console.log('token:', token);
    var accessToken = token.data.access_token;
    console.log('accessToken:', accessToken);
    var openid = token.data.openid;
    console.log('openid:', openid);
    var userInfo = await client.getUser(openid);
    console.log('userInfo:', userInfo);
    let params = '?openid=' + userInfo.openid + '&headimgurl=' + userInfo.headimgurl + '&nickname=' + encodeURIComponent(userInfo.nickname)+'&to_player_id='+to_player_id;
    console.log( 'http://testwx.getstore.cn/ido.html'+params)
    ctx.redirect('http://testwx.getstore.cn/ido.html'+params)
  }

  static async get_start_info(ctx, next) {

    let url = ctx.request.url;
    let openid = ctx.query.openid;
    let nickname = ctx.query.nickname;
    let headurl = ctx.query.headimgurl;
    let to_player_id = ctx.query.to_player_id;

    if(to_player_id!=null&&to_player_id!=undefined){
      console.log('to_player_id =',to_player_id);
    }else {
      console.log('to_player_id is null');
      to_player_id = openid;
      console.log('to_player_id =',to_player_id);
    }

    //启动时获取game_round
    var round = await IdoGameRound.findOne({
      attributes: ['game_id', 'name', 'created_at', 'updated_at'],
      where: {
        game_id: 1
      }
    })
    //启动时获取gameround_store_gift
    var gameround_store_gift = await IdoGameRoundStoreGift.findAll({
      attributes: ['game_round_id', 'store_id', 'gift_id', 'qty', 'info', 'remaining'],
      where: {
        game_round_id: 1,
      }
    })

    let store_id = new Array();
    let gift_id = new Array();
    store_id[0] = 0;
    gift_id[0] = 0;

    for (var i = 0; i < gameround_store_gift.length; i++) {
      var index = gameround_store_gift[i];
      store_id.push(index.get("store_id"));
      gift_id.push(index.get("gift_id"));
    }

    //启动时获取store
    var store = await IdoStroe.findAll({
      attributes: ['store_id', 'store_name', 'tel', 'remaining', 'created_at', 'updated_at'],
      where: {
        store_id: {
          [Op.in]: store_id
        }
      }
    })

    //启动时获取gift
    var gift = await IdoGift.findAll({
      attributes: ['gift_id', 'gift_name', 'image_name'],
      where: {
        gift_id: {
          [Op.in]: gift_id
        }
      }
    })

    //启动时获取player
    var player = await IdoPlayer.findOne({
      attributes: ['openid', 'nickname', 'headurl', 'to_player_id', 'default_store_id'],
      where: {
        openid: openid
      }
    })

    if (player == null) { //create a new player
      console.log('create a new player');
      var new_player =
        {
          openid: openid,
          to_player_id: to_player_id,
          nickname: nickname,
          headurl: headurl,
          default_store_id: 0
        }

      var options = {
        fields: ['openid', 'to_player_id', 'default_store_id','nickname','headurl']
      }
      let res = await IdoPlayer.create(new_player, options)

      player = new_player;
    }else{
      var new_player =
        {
          openid: openid,
          to_player_id: to_player_id,
          nickname: nickname,
          headurl: headurl,
          default_store_id: 0
        }
      console.log(new_player);
      let res = await IdoPlayer.update(new_player, {
        where: {
          openid: openid
        }
      })
    }

    //启动时获取player_info
    var player_infos = await IdoPlayerInfo.findOne({
      attributes: ['openid', 'name', 'tel', 'birth', 'default_store_id'],
      where: {
        openid: openid
      }
    })

    //启动时获取点赞result
    var result = await IdoResult.findAll({
      attributes: ['openid', 'to_player_id', 'createtime'],
      where: {
        openid: openid,
        to_player_id: player.to_player_id
      }
    })

    let start_info = {
      round: round,
      store: store,
      gift: gift,
      gameround_store_gift: gameround_store_gift,
      player: player,
      player_info: player_infos,
      result: result
    }

    ctx.body = start_info
    ctx.status = 200

  }

  static async get_result_info(ctx, next) {
    var result = await IdoResult.findAll({
      attributes: ['openid', 'to_player_id', 'createtime'],
    })
    ctx.body = result
    ctx.status = 200
  }

  static async post_sign_up(ctx, next) {

    let openid = ctx.request.body.openid
    let default_store_id = ctx.request.body.default_store_id
    let start_at = ctx.request.body.start_at
    let end_at = ctx.request.body.end_at
    let player_infos = {
      openid: openid,
      default_store_id: default_store_id,
      start_at: start_at,
      end_at: end_at
    }
    var options = {
      fields: ['openid', 'default_store_id', 'start_at', 'end_at']
    }
    let res = await IdoPlayerInfo.create(player_infos, options)
    ctx.body = res
    ctx.status = 200
  }

  static async post_msg(ctx, next) {
    var openid = ctx.request.body.openid
    var realname = ctx.request.body.realname
    var tel = ctx.request.body.tel
    var birth = ctx.request.body.birth
    console.log(birth);
    var info = {
      name: realname,
      tel: tel,
      birth: birth
    }
    let res = await IdoPlayerInfo.update(info, {
      where: {
        openid: openid
      }
    })
    ctx.body = res
    ctx.status = 200
  }

  static async post_thumb_up(ctx, next) {

    var now_year = ctx.request.body.now_year
    var now_month = ctx.request.body.now_month
    var now_day = ctx.request.body.now_day
    var openid = ctx.request.body.openid
    var to_player_id = ctx.request.body.to_player_id
    var createtime = now_year + '-' + now_month + '-' + now_day
    var sourceid = openid + to_player_id + now_year + now_month + now_day

    var result = {
      openid: openid,
      to_player_id: to_player_id,
      createtime: createtime,
      sourceid: sourceid
    }

    var options = {
      fields: ['openid', 'to_player_id', 'createtime', 'sourceid']
    }
    let res = await IdoResult.create(result, options)
    ctx.body = res
    ctx.status = 200
  }

  static async gameround(ctx, next) {

    try {
      var game_id = ctx.request.body.game_round.game_id
      var name = ctx.request.body.game_round.name
      var creator_id = ctx.request.body.game_round.creator_id
      var default_store_id = ctx.request.body.game_round.default_store_id
      var wx_keyword = ctx.request.body.game_round.wx_keyword
      var close_at = ctx.request.body.game_round.close_at
      var open_at = ctx.request.body.game_round.open_at
      var end_at = ctx.request.body.game_round.end_at
      var start_at = ctx.request.body.game_round.start_at
      var round = {
        game_id: game_id,
        name: name,
        creator_id: creator_id,
        default_store_id: default_store_id,
        wx_keyword: wx_keyword,
        open_at: open_at,
        close_at: close_at,
        start_at: start_at,
        end_at: end_at
      }

      var options = {
        fields: ['game_id', 'name', 'creator_id', 'default_store_id', 'wx_keyword', 'close_at', 'open_at', 'start_at', 'end_at']
      }
      let res = await IdoGameRound.create(round, options)
      ctx.body = res
      ctx.status = 201
    } catch (err) {
      ctx.status = 422
      ctx.body = ("create gameround error-", 'key-:', ctx.request.body.game_round.game_id, err)
      logger.error("create gameround error-", 'key-:', ctx.request.body.game_round.game_id, err)
      console.error("create gameround error-", 'key-:', ctx.request.body.game_round.game_id, err)
    }
  }
}

module.exports = Ido;
