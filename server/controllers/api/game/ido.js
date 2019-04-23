import fetch from 'node-fetch'
import {
  IdoGameRound,
  IdoGameRoundStoreGift,
  IdoGift,
  IdoPlayer,
  IdoPlayerInfo,
  IdoResult,
  IdoStroe
} from '../../../models/game/ido'
import {
  Sequelize
} from '../../../models'
import {
  GameRoundStates
} from '../../../schema/constant'
const Op = Sequelize.Op;
// import {
//   FailMessage
// } from '../../constant'
class Ido {
  static async get_start_info(ctx, next) {

    let url = ctx.request.url;
    console.log("url:" + url);
    let openid = url.substring(url.indexOf('?') + 1);
    console.log("openid:" + openid);

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
          to_player_id: openid,
          default_store_id: 0
        }

      var options = {
        fields: ['openid', 'to_player_id', 'default_store_id']
      }
      let res = await IdoPlayer.create(new_player, options)

      player = new_player;
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

  static async post_gameround(ctx, next) {

    var game_id = ctx.request.body.game_id
    var name = ctx.request.body.name
    var creator_id = ctx.request.body.creator_id
    var default_store_id = ctx.request.body.default_store_id

    var round = {
      game_id: game_id,
      name: name,
      creator_id: creator_id,
      default_store_id: default_store_id
    }

    var options = {
      fields: ['game_id', 'name', 'creator_id', 'default_store_id']
    }
    let res = await IdoGameRound.create(round, options)
    ctx.body = res
    ctx.status = 200
  }

}

module.exports = Ido;
