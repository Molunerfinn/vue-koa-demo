var wechatConfig = require('../config/weixin');


export function getWxAuthUrlBase() {

  return wechatConfig.authdomain + '/authwx/gameshareurl'

}
