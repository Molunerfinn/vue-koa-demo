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
export async function getWxJsConfig( url ){
  var wxConfig = null
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

  return wxConfig
}
