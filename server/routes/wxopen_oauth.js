const router = require('koa-router')(); // router middleware for koa

var weixinConfig = require('../config/weixin');

const {
  getOpenOauth
} = require('../helpers/wxopen');

// 根据用户给的url，附加微信用户信息
router.get('/gameshare-done', async (ctx) => {
  console.log("response.header=", ctx.response.header)

  let oauth = getOpenOauth()

  let gameurl = ctx.query.gameurl
  let code = ctx.query.code
  var openid = token.data.openid;
  var userInfo = await oauth.getUser(openid);
  console.log('userInfo-------------:', userInfo);
  let params = 'openid=' + userInfo.openid + '&headimgurl=' + userInfo.headimgurl + '&nickname=' + encodeURIComponent(userInfo.nickname) + '&sex=' + userInfo.sex +
    '&language=' + userInfo.language + '&country=' + userInfo.country + '&province=' + userInfo.province + '&city=' + userInfo.city
  console.log("ctx.query= ", ctx.query, token.data, gameurl + (params))
  // 检查 gameurl是否有url参数
  let redirecturl = gameurl.indexOf('?') > 0 ? (gameurl + '&' + params) : (gameurl + '?' + params)
  console.log('redirecturl=====:',redirecturl);
  ctx.redirect(redirecturl)
})
module.exports = router;
