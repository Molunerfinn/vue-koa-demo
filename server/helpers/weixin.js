const wechatConfig = require('../config/weixin');
const fetch = require('node-fetch')


export function getWxAuthApiUrl() {
  let gameURLBase = process.env.GAME_URL_BASE
  return gameURLBase + '/authwx/game'

}

export function getWxJsConfigApiUrl() {
  let gameURLBase = process.env.GAME_URL_BASE
  return gameURLBase + '/gapi/weixin/getJsConfig'
}

/**
 * get weixin js sdk config
 * @param {*} url
 * @return {返回值类型} wxConfig or null
 */
export async function getWxJsConfig( url, gameRound ){

  console.log('getWxJsConfig', process.env.SUPPORT_RUNLIN)
  if( process.env.SUPPORT_RUNLIN == 'yes'){
    return getWxJsConfigForRunlin( url, gameRound )
  }

  var wxConfig = {}
  try {

    let body = {
      url: url
    }
    let apiurl = getWxJsConfigApiUrl()

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
      wxConfig = {
        appId: data['appId'],
        timestamp: data['timestamp'],
        nonceStr: data['nonceStr'],
        signature: data['signature']
      }
    }
  } catch (err) {
    console.error("got error-", err);
  }

  wxConfig.shareUrl = getWxShareUrl( gameRound )

  return wxConfig
}


export function getWxShareUrl( gameRound ){

  return `http://client.vw-dealer-wechat.faw-vw.com/wechatclient/game/${gameRound.number}/searchaliencheck_in/gotoGame.html`

  if( process.env.SUPPORT_RUNLIN == 'yes'){
    return getWxShareUrlForRunlin( gameRound )
  }


  const gameUrlBase = process.env.GAME_URL_BASE

  let shareUrl = getWxAuthApiUrl() + '?' + 'gameurl='+gameUrlBase + gameRound.getPlayPath()

  return shareUrl
}

/**
 * get weixin js sdk config
 * @param {*} url
 * @return {返回值类型} wxConfig or null
 */
async function getWxJsConfigForRunlin( url, gameRound ){

  const GAME_HOST = 'gm.vwweixin.faw-vw.com'
  //http://10.224.40.46:8060/wechatclient/taskcenter/getForGamesign.html
  const RUNLIN_GET_WX_PARAM_URL="http://client.vw-dealer-wechat.faw-vw.com/wechatclient/taskcenter/getForGamesign.html"
  //const RUNLIN_GET_WX_PARAM_URL="http://10.224.40.46:8060/wechatclient/taskcenter/getForGamesign.html"
  const RUNLIN_SHARE_URL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=%{appid}&redirect_uri=http%3A%2F%2Fclient.vw-dealer-wechat.faw-vw.com%2Fwechatclient%2Fgame%2F%{game_round_id}%2Fcupcheck_in%2FgotoGame.html&response_type=code&scope=snsapi_userinfo&state=&component_appid=wxd180d4eb5fb062fe#wechat_redirect'


  let wxConfig = {}
  try {
    let params = `?authorizerAppid=${gameRound.appid}&url=${encodeURIComponent(url)}`
console.log( " RUNLIN_GET_WX_PARAM_URL+params ", RUNLIN_GET_WX_PARAM_URL+params)
    let res = await fetch(RUNLIN_GET_WX_PARAM_URL+params, { timeout:2000, method:'post' })
    if( res ){
      let data = await res.json()

      wxConfig = {  appId: data['appid'], timestamp: data['timestamp'], nonceStr:data['nonceStr'],signature:data['signature']}
    }

    let runlinredirecturl = `http://client.vw-dealer-wechat.faw-vw.com/wechatclient/game/${gameRound.id}/bargaincheck_in/gotoGame.html?`
    let runlinshareurl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${gameRound.appid}&redirect_uri=${encodeURIComponent(runlinredirecturl)}&response_type=code&scope=snsapi_userinfo&state=""&component_appid=wxd180d4eb5fb062fe#wechat_redirect`

    wxConfig.shareUrl = getWxShareUrlForRunlin( gameRound )
    console.debug( "wxConfig=", wxConfig )

  } catch (err) {
    console.error("got error-", err);
  }

  return wxConfig
}

function getWxShareUrlForRunlin( gameRound ){

  let runlinredirecturl = `http://client.vw-dealer-wechat.faw-vw.com/wechatclient/game/${gameRound.id}/bargaincheck_in/gotoGame.html?`
  let runlinshareurl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${gameRound.appid}&redirect_uri=${encodeURIComponent(runlinredirecturl)}&response_type=code&scope=snsapi_userinfo&state=""&component_appid=wxd180d4eb5fb062fe#wechat_redirect`

  //`/{gameRound.number}/searchaliencheck_in/gotoGame.html`
  const RUNLIN_SHARE_URL_ZHAOBABA = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${gameRound.appid}&redirect_uri=http%3A%2F%2Fclient.vw-dealer-wechat.faw-vw.com%2Fwechatclient%2Fgame%2F${gameRound.number}%2Fsearchaliencheck_in%2FgotoGame.html&response_type=code&scope=snsapi_userinfo&state=&component_appid=wxd180d4eb5fb062fe#wechat_redirect`
  if( gameRound.code == 'zhaobaba'){
    runlinshareurl = `http://client.vw-dealer-wechat.faw-vw.com/wechatclient/game/${gameRound.number}/searchaliencheck_in/gotoGame.html`
    //runlinshareurl = RUNLIN_SHARE_URL_ZHAOBABA
  }

  return runlinshareurl
}
