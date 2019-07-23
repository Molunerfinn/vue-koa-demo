const router = require('koa-router')(); // router middleware for koa

var weixinConfig = require('../config/weixin');

var OAuth = require('co-wechat-oauth');
const URL = require("url");
var client = new OAuth(weixinConfig.appid, weixinConfig.secret);

// 处理所有游戏的授权链接
router.get('/game', async (ctx) => {
  let gameurl = ctx.query.gameurl
  var url = client.getAuthorizeURL(weixinConfig.authdomain + '/authwx/gameshare-done?gameurl=' + gameurl, 'state', 'snsapi_userinfo');
  console.log("auth2-url", url)
  ctx.redirect(url)
})

// 处理所有游戏的分享链接
router.get('/gameshare', async (ctx) => {
  let shareurl = ctx.query.shareurl
  var url = client.getAuthorizeURL(weixinConfig.authdomain + '/authwx/gameshare-done?gameurl=' + shareurl, 'state', 'snsapi_userinfo');
  ctx.redirect(url)
})

// 根据用户给的url，附加微信用户信息
router.get('/gameshare-done', async (ctx) => {
  console.log("response.header=", ctx.response.header)

  let gameurl = ctx.query.gameurl
  let code = ctx.query.code
  var token = await client.getAccessToken(code);
  var accessToken = token.data.access_token;
  var openid = token.data.openid;
  var userInfo = await client.getUser(openid);
  console.log('userInfo-------------:', userInfo);
  let params = 'openid=' + userInfo.openid + '&headimgurl=' + userInfo.headimgurl + '&nickname=' + encodeURIComponent(userInfo.nickname) + '&sex=' + userInfo.sex +
    '&language=' + userInfo.language + '&country=' + userInfo.country + '&province=' + userInfo.province + '&city=' + userInfo.city
  console.log("ctx.query= ", ctx.query, token.data, gameurl + (params))
  // 检查 gameurl是否有url参数
  let redirecturl = gameurl.indexOf('?') > 0 ? (gameurl + '&' + params) : (gameurl + '?' + params)
  ctx.redirect(redirecturl)
})
module.exports = router;
