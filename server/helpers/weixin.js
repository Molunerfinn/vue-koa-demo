const wechatConfig = require('../config/weixin');


function getWxAuthUrlBase() {

  return wechatConfig.authdomain + '/authwx/gameshareurl'

}

function getWxJsConfigApiUrl() {
  let gameURLBase = process.env.GAME_URL_BASE
  return gameURLBase + '/gapi/weixin/getJsConfig'
}
export {
  getWxJsConfigApiUrl,
  getWxAuthUrlBase
}
