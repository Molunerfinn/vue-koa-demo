import fetch from 'node-fetch'
import {
  Sequelize,
  GameRound,
  GameRoundBargain,
  GamePlayer,
  GameResult,
  GameDay,
  IdoGameRound,
  IdoGameRoundStoreGift,
  IdoGift,
  IdoPlayer,
  IdoPlayerInfo,
  IdoResult,
  IdoStroe
} from '../../../models/ido'
import {
  GameRoundStates
} from '../../../schema/constant'
import {
  FailMessage
} from '../../constant'

static async get_start_info(ctx, next){

    let url = ctx.request.url;
    console.log("url:" + url);
    let openid = url.substring(url.indexOf('?') + 1);
    console.log("openid:" + openid);

    //启动时获取game_round
    var round = await IDoGameRound.findOne({
      attributes: ['game_id', 'name', 'created_at', 'updated_at'],
      where: {
        game_id: 1
      }
    })
    //启动时获取gameround_store_gift
    var gameround_store_gift = await IDoGameRoundStoreGift.findAll({
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
    var store = await IDoStroe.findAll({
      attributes: ['store_id', 'store_name', 'tel', 'remaining', 'created_at', 'updated_at'],
      where: {
        store_id: {
          [Op.in]: store_id
        }
      }
    })

    //启动时获取gift
    var gift = await IDoGift.findAll({
      attributes: ['gift_id', 'gift_name', 'image_name'],
      where: {
        gift_id: {
          [Op.in]: gift_id
        }
      }
    })

    //启动时获取player
    var player = await IDoPlayer.findOne({
      attributes: ['openid', 'nickname', 'headurl', 'to_player_id', 'default_store_id'],
      where: {
        openid: openid
      }
    })

    //启动时获取player_info
    var player_infos = await IDoPlayerInfo.findOne({
      attributes: ['openid', 'name', 'tel', 'birth', 'default_store_id'],
      where: {
        openid: openid
      }
    })

    //启动时获取点赞result
    var result = await IDoResult.findAll({
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
