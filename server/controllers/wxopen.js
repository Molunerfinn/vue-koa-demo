const WechatOpenToolkit = require('wechat-open-toolkit')
const {
  EVENT_COMPONENT_VERIFY_TICKET,
  EVENT_AUTHORIZED,
  EVENT_UPDATE_AUTHORIZED,
  EVENT_UNAUTHORIZED,
  EVENT_COMPONENT_ACCESS_TOKEN,
  EVENT_AUTHORIZER_ACCESS_TOKEN,
  EVENT_AUTHORIZER_JSAPI_TICKET
} = WechatOpenToolkit

// 微信第三方平台列表
const list = [{
  componentAppId: 'wx600b115058543c37', // 微信第三方平台 appId
  componentAppSecret: '6e3025c644d99c3b71e03a7d4bb0ff34', // 微信第三方平台 appSecret
  token: 'token', // 消息校验 Token
  encodingAESKey: 'winc44b9f22bcef72d2ea76b621b6f2c095160e81e6' // 消息加解密 key
}]

const Redis = require('ioredis');
const redis = new Redis();
const toolkit = new WechatOpenToolkit({
  list
})

toolkit.on(EVENT_COMPONENT_VERIFY_TICKET, function(result) {

  console.log('result---:', result);
  /* {
      AppId: "wx304925fbea25bcbe",
      CreateTime: "1562424829"
      InfoType: "component_verify_ticket",
      ComponentVerifyTicket: 'ticket@@@lEHjsBEi_TPDey0IZxw4Zbb7JRYLOtEf9ksvDpSwzkwog3R6xEpdaK0yIee7JOyOXM0V7cp0dpM58GKmb8FSKA'
  } */
})

function handleWxopenEvent(app) {
  console.log('============getAuthorize============');
  console.log(list);


  // 绑定全部事件
  // toolkit.on(EVENT_COMPONENT_VERIFY_TICKET, ret => {
  //   console.log(ret)
  //   // await this.redis.set('componentTicket', JSON.stringify(ret));
  //   // console.log('this.redis--:', this.redis);
  //
  // })


  // toolkit.on(EVENT_AUTHORIZED, ret => {
  //   console.log(ret)
  // })
  // toolkit.on(EVENT_UPDATE_AUTHORIZED, ret => {
  //   console.log(ret)
  // })
  // toolkit.on(EVENT_UNAUTHORIZED, ret => {
  //   console.log(ret)
  // })
  // toolkit.on(EVENT_COMPONENT_ACCESS_TOKEN, ret => {
  //   console.log(ret)
  // })
  // toolkit.on(EVENT_AUTHORIZER_ACCESS_TOKEN, ret => {
  //   console.log(ret)
  // })
  // toolkit.on(EVENT_AUTHORIZER_JSAPI_TICKET, ret => {
  //   console.log(ret)
  // })
  // toolkit.on('error', err => {
  //   console.error(err)
  // })

  // toolkit.emit(EVENT_COMPONENT_VERIFY_TICKET, {
  //   AppId: "wx600b115058543c37",
  //   CreateTime: "1563436532",
  //   InfoType: "component_verify_ticket",
  //   ComponentVerifyTicket: 'ticket@@@lEHjsBEi_TPDey0IZxw4Zbb7JRYLOtEf9ksvDpSwzkwog3R6xEpdaK0yIee7JOyOXM0V7cp0dpM58GKmb8FSKA'
  // })
  // 通常需要绑定5个中间件
  app.use('/wechat/events', c2k(toolkit.events())) // 第三方平台事件接收中间件
  console.log('app.use');
  list.forEach(({
    componentAppId
  }) => {

    let authMiddleware = toolkit.auth(componentAppId, 'https://domain.com/') // 第三方平台网页授权中间件
    let msgMiddleware = toolkit.message(componentAppId) // 授权方用户消息接收中间件
    let autoTestMiddleware = toolkit.autoTest(componentAppId) // 第三方平台全网发布测试中间件

    app.get(`/wechat/auth/${componentAppId}`, authMiddleware)

    app.post(`/wechat/message/${componentAppId}/:authorizerAppId`, msgMiddleware, autoTestMiddleware, (req, res) => {
      res.end('success')
      console.log(req.wechat)
    })

    app.get(`/wechat/oauth/${componentAppId}/:authorizerAppId`, (req, res, next) => {
      let {
        authorizerAppId
      } = req.params
      let oauthMiddleware = toolkit.oauth(componentAppId, authorizerAppId, 'https://domain.com/') // 授权方网页授权中间件
      oauthMiddleware(req, res, next)
    })
  })

}

module.exports = {
  handleWxopenEvent
}
