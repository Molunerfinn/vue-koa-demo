const {
  componentAPI
} = require('../helpers/wxopen');
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
  API
} = require('es-wechat-open-api');

router.post('/entry', async (ctx) => {
  let WxMpUsersModel = getWxMpUsersModel()
  let number = ctx.params.number
  let parsed = ctx.request.body.parsed
  let gameRoundModel = getGameRoundModelByCode('backend');

  let gameRound = gameRoundModel.findOne({
    where:{
      number
    }
  })

  let WxMpUser = WxMpUsersModel.findOne({
    where:{
      appid:gameRound.appid
    }
  })

  async function getUserToken(openid){
    const token = await redis.get('userToken');
    return token;
  }
  async function saveUserToken(openid, token){
    await redis.set('_userToken', JSON.stringify(userToken));
  }

  let options = {
    getUserToken:getUserToken,
    saveUserToken:saveUserToken,
    componentApi:componentAPI,
    appId:WxMpUser.appId
  }

  let oauth = new Oauth(options)
})



module.exports = router;
