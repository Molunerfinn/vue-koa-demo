const wechatConfig = require('../config/weixin');


function getWxAuthUrlBase() {

  return wechatConfig.authdomain + '/authwx/gameshareurl'

}

function getWxJsConfigApiUrl() {

  return '/gapi/weixin/getJsConfig'
}
export {
  getWxJsConfigApiUrl,
  getWxAuthUrlBase
}
