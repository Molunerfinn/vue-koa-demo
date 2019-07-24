const {
  componentAPI
} = require('./wxopen');
const Redis = require('ioredis');
const redis = new Redis();
const router = require('koa-router')(); // router middleware for koa
const {
  getWxMpUsersModel,
  getCompanies,
  getGameRoundModelByCode
} = require('../helpers/model')
const {
  ComponentAPI,
  API,
  Oauth
} = require('es-wechat-open-api');

async function wxOpenOauth(WxMpUser) {

  async function getUserToken(openid){
    const token = await redis.get('userToken');
    return token;
  }
  async function saveUserToken(openid, token){
    await redis.set([openid+'_userToken'], JSON.stringify(userToken));
  }

  let options = {
    getUserToken:getUserToken,
    saveUserToken:saveUserToken,
    componentApi:componentAPI,
    appId:WxMpUser.appId
  }

  let oauth = new Oauth(options)

  let user = oauth.getUser()

  return user

})



module.exports = {wxOpenOauth};
