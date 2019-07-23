/// 第三方平台授权绑定
import queryString from 'query-string'
const {
  componentAPI
} = require('../helpers/wxopen');
const Redis = require('ioredis');
const redis = new Redis();
const router = require('koa-router')(); // router middleware for koa
const WechatEncrypt = require('wechat-encrypt')
const xml2js = require('xml2js')
const wxopenConfig = require('../config/wxopen')
const {
  getWxMpUsersModel,
  getCompanies,
  getGameRoundModelByCode
} = require('../helpers/model')
const {
  ComponentAPI,
  API
} = require('es-wechat-open-api');

// const componentAPI = new ComponentAPI({
//   componentAppId: wxopenConfig.appid,
//   componentAppSecret: wxopenConfig.secret,
//   getComponentTicket: async () => {
//     const ticket = await redis.get('componentTicket');
//     return ticket;
//   },
//   getComponentToken: async () => {
//     const ticket = await redis.get('componentToken');
//     return ticket;
//   },
//   saveComponentToken: async componentToken => {
//     await redis.set('componentToken', JSON.stringify(componentToken));
//   }
// });



const xmlParser = new xml2js.Parser({
  explicitRoot: false,
  explicitArray: false
})

// 解板XML数据
function convertXml2Json(str) {
  return new Promise(function(resolve, reject) {
    xmlParser.parseString(str, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

router.post('/ticket', async (ctx) => {
  let xml = ctx.request.xmlBody // 解析XML数据成JS对象

  let {
    AppId,
    Encrypt
  } = xml.xml
  let {
    encodingAESKey,
    token
  } = wxopenConfig
  console.log('======:', AppId, encodingAESKey, token);
  console.log('AppId[0]--:', AppId[0]);
  let wechatEncrypt = new WechatEncrypt({
    appId: AppId[0],
    encodingAESKey,
    token
  })

  if (AppId && Encrypt) {
    console.log('*****************************');
    console.log('Encrypt[0]====:', Encrypt[0]);
    let str = wechatEncrypt.decode(Encrypt[0]) // 解密数据
    console.log('str-----:', str);
    let xml2 = await convertXml2Json(str, {}) // 解析XML数据成JS对象
    console.log("xml2", xml2)
    let {
      ComponentVerifyTicket,
      infoType
    } = xml2
    console.log('componentVerifyTicket====:', ComponentVerifyTicket);

    await redis.set('componentTicket', ComponentVerifyTicket);

    authorizerCallbackRequest => async function() {
      const authorizerAppId =
        process.env.WX_OPEN_APPID;
      const accessToken =
        process.env.WX_OPEN_TOKEN;
      const expiresIn = 7200;
      const refreshToken =
        authorizerCallbackRequest.authorization_info.authorizer_refresh_token;
      const accessTokenInstance = {
        accessToken,
        expireTime: new Date().getTime() + (expiresIn - 20) * 1000
      };
      console.log('accessTokenInstance-----:', accessTokenInstance);
      await redis.set(
        `authorizerAppToken:${authorizerAppId}`,
        JSON.stringify({
          accessTokenInstance,
          refreshToken
        })
      );
    };

    redis.get("componentTicket", function(err, result) {
      console.log('result--:', result);
    });

  }

  ctx.body = "success"
})

// /wechat/auth/${componentAppId}
// /wechat/message/${componentAppId}/:authorizerAppId
// /wechat/oauth/${componentAppId}/:authorizerAppId

router.post('/message', async (ctx) => {

})

router.post('/auth', async (ctx) => {
  var url = await componentAPI.getAppWebAuthorizeURL('https://testwx.natapp4.cc/api/wxopen/authdone')

  console.log('url---:', url);
  var url = ''
  ctx.body = {
    url: url
  }
})

router.get('/authdone', async (ctx) => {
  console.log('ctx.request--:', ctx.request);
  let url = ctx.request.url
  url = url.substring(url.indexOf("?"))
  console.log('url---:', ctx.request.url);
  const parsed = queryString.parse(url)
  console.log('parsed---:', parsed);
  let auth_code = parsed.auth_code
  let expires_in = parsed.expires_in

  getAuthorInfo('1', auth_code, expires_in)

  ctx.body = {
    auth_code: auth_code,
    expires_in: expires_in
  }
})

async function getAuthorInfo(companyId, auth_code, expires_in) {
  console.log('auth_code--:', auth_code);
  var info = {}
  info = await componentAPI.getAuthorizationInfo(auth_code)
  console.log('authorization_info====:', info);
  var authorizer_appid = info.authorization_info.authorizer_appid
  var authorizer_access_token = info.authorization_info.authorizer_access_token
  var authorizer_refresh_token = info.authorization_info.authorizer_refresh_token
  var func_info = info.authorization_info.func_info

  info = await componentAPI.getAuthorizerInfo(authorizer_appid)
  console.log('authorizer_info====:', info);

  var nick_name = info.authorizer_info.nick_name
  var head_img = info.authorizer_info.head_img
  var user_name = info.authorizer_info.user_name
  var principal_name = info.authorizer_info.principal_name
  var signature = info.authorizer_info.signature


  redis.hmset('wxmp', {
    [authorizer_appid + '_access_token']: authorizer_access_token,
    [authorizer_appid + '_refresh_token']: authorizer_refresh_token,
    [authorizer_appid + '_func_info']: func_info
  })

  let wxMpUserModel = getWxMpUsersModel();
  let wxMpUser = {
    nick_name: nick_name,
    head_img: head_img,
    user_name: user_name,
    alias: principal_name,
    wx_token: signature,
    appid: authorizer_appid,
    access_token: authorizer_access_token,
    refresh_token: authorizer_refresh_token,
    func_info: func_info
  }

  wxMpUser = await wxMpUserModel.create(wxMpUser)

  let companies = getCompanies()
  let userInfo = await companies.findOne({
    where: {
      id: companyId
    }
  })

  await userInfo.update({
    appid: authorizer_appid
  })
}



module.exports = router;
