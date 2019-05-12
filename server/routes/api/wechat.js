// 处理微信公众号自动回复，测试使用

'use strict';

const router = require('koa-router')(); // router middleware for koa
const fs = require('fs');
const http = require('http');
const wechat = require('co-wechat');
const WechatAPI = require('co-wechat-api');
const { getGameRoundModelByCode } = require('../../helpers/model')

const game_host = process.env.GAME_HOST
var wechat_config = require('../../config/weixin');

var api = new WechatAPI(wechat_config.appid, wechat_config.secret);

router.post('/', wechat(wechat_config).middleware(async (message, ctx) => {
  // TODO
  let matches = null
  console.log("message = ", message)
  if (/^yiy[0-9]+/.test( message.Content )) {
    let gid =  /[0-9]+/.exec( message.Content )
    let user = await api.getUser( message.FromUserName );
    return [{
      title: '摇一摇',
      description: '参看大屏幕参加，切勿转发此链接给同事',
      picurl: 'http://otest.oss-cn-beijing.aliyuncs.com/dgame/yiy.jpg',
      url: `${game_host}/game-yiy/${gid}/checkin-wx?openid=${message.FromUserName}&nickname=${user.nickname}&headimgurl=${(user.headimgurl)}`
    }];
  }else if (/^gshare[0-9]+/.test( message.Content )) {
    //取得游戏连接，
      let gid =  /[0-9]+/.exec( message.Content )
      let gameround =  await game_rounds.findById( parseInt(gid) )
      let gameurl = `${game_host}/game-${gameround.code}/${gid}/checkin-wx`
      let url = `${game_host}/wapi/v1/wechatauth/gameshareurl?shareurl=${encodeURIComponent(gameurl)}`
      return {
        type: 'text',
        content: `${gameround.name}: ${url}`
      }
  }else if (/^g[0-9]+/.test( message.Content )) {
      let gid =  /[0-9]+/.exec( message.Content )
      let user = await api.getUser( message.FromUserName );
      let gameround =  await game_rounds.findById( parseInt(gid) )
      return {
        type: 'text',
        content: `<a href="${game_host}/game-${gameround.code}/${gid}/checkin-wx?openid=${message.FromUserName}&nickname=${user.nickname}&headimgurl=${(user.headimgurl)}"> ${gameround.name} </a>`
      }
  }else if (/^gs[0-9]*/.test( message.Content )) { // list game_rounds offset
      let offset =  parseInt(/[0-9]+/.exec( message.Content )) || 0
      let limit = 10
      let gamerounds =  await game_rounds.findAll( {limit, offset} )
      //console.log( "gamerounds= ", gamerounds)
      let content = gamerounds.map((g)=>{ return `${g.name}(${g.id}-${g.code})` }).join('|')
      if( content.length == 0 ){ content = "没有数据"}
      return {
        type: 'text',
        content: content
      }
  }else if (  matches=/^gu([a-z]+)([0-9]+)/.exec( message.Content )) {
    // gudppintu9
    let code = matches[1]
    let model = getGameRoundModelByCode( code )
    let gid =   matches[2]

    //let user = await api.getUser( message.FromUserName )
    let gameround =  await model.findById( parseInt(gid) )

    let url = config.authdomain + '/authwx/gameshareurl?shareurl=' + encodeURIComponent(gameround.playPath)

      return {
        type: 'text',
        content: `<a href="${url}"> ${gameround.name} </a>`
      }

  } else {
    return {
      content: message.Content,
      type: 'text'
    };
  }
}))
router.get('/', wechat(wechat_config).middleware(async (message, ctx) => {
  // echo for handshake
  return {
    content: message.Content,
    type: 'text'
  };
}))


module.exports = router;
