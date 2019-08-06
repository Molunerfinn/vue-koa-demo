import Koa from 'koa'
import json from 'koa-json'
import logger from 'koa-logger'
import auth from './routes/auth.js'
import jwt from 'koa-jwt'
import path from 'path'
import serve from 'koa-static'
import historyApiFallback from 'koa2-history-api-fallback'
import KoaRouter from 'koa-router'
import koaBodyparser from 'koa-bodyparser'
import session  from 'koa-session'    // session for flash messages
import http from 'http'
const xmlParser = require('koa-xml-body')
const secret = require('./config/secret')
const app = new Koa()
const router = new KoaRouter()

let port = process.env.API_SERVER_PORT || 3000

// 处理微信请求
app.use(xmlParser({key: 'xmlBody'}))

app.use(koaBodyparser({}))
app.use(json())
app.use(logger())

app.use(async function (ctx, next) {
  let start = new Date()
  await next()
  let ms = new Date() - start
  console.log('%s %s - %s', ctx.method, ctx.url, ms)
})

app.use(async function (ctx, next) {  //  如果JWT验证失败，返回验证失败信息
  try {
    await next()
  } catch (err) {
    if (err.status === 401) {
      // 处理JWT验证失败
      if (ctx.url.match(/^\/api\/backend/)) {
        ctx.status = 401
        ctx.body = {
          success: false,
          token: null,
          info: 'Protected resource, use Authorization header to get access'
        }
      }
    } else {
      throw err
    }
  }
})

// set signed cookie keys for JWT cookie & session cookie
app.keys = [ secret.sessionSecret ];

// session for flash messages (uses signed session cookies, with no server storage)
app.use(session(app)); // note koa-session@3.4.0 is v1 middleware which generates deprecation notice

// app.on('error', function (err, ctx) {
//  console.log('server error', err)
// })

// 微信公众号 网页授权
import wxoauth from './routes/wxmp_oauth.js'
router.use('/authwx', wxoauth.routes())
// 微信开放平台 第三方网页授权
import wxopen_oauth from './routes/wxopen_oauth.js'
router.use('/wxopen_oauth', wxopen_oauth.routes())

// 游戏管理api
// 兼容 以前使用的API  /api/game_rounds/:id
import gameRounds from './routes/api/game_rounds.js'
router.use('/api/game_rounds', gameRounds.routes())

// 大屏游戏管理api 支持路径 /api/dpgames/:code/
import dpgameRoundByCode from './routes/api/dpgames.js'
router.use('/api/dpgames', dpgameRoundByCode.routes())

import gameRoundByCode from './routes/api/games.js'
// H5游戏管理api  支持路径 /api/games/:code/
router.use('/api/games', gameRoundByCode.routes())

// 微信公众号自动回复 api
import wechat from './routes/api/wechat.js'
router.use('/api/wechat', wechat.routes())

// H5游戏过程api
import gameBaseByCode from './routes/gapi/base_by_code.js'
router.use('/gapi/base', gameBaseByCode.routes())

// 大屏游戏过程api
import dpgameBaseByCode from './routes/gapi/dpbase_by_code.js'
router.use('/gapi/dpbase', dpgameBaseByCode.routes())

// 取得微信jssdk Config API
import weixin from './routes/gapi/weixin.js'
router.use('/gapi/weixin', weixin.routes())

// import test from './routes/test.js'
// router.use('/api/test', test.routes())

import games from './routes/gapi/games.js'
//'/gapi/games/:code/:number/'
router.use('/gapi/games', games.routes())

import dpgames from './routes/gapi/dpgames.js'
//'/gapi/games/:code/:number/'
router.use('/gapi/dpgames', dpgames.routes())

import album from './routes/gapi/album.js'
router.use('/gapi/album', album.routes())

import photos from './routes/gapi/photos'
// 在路径中使用code，以便其他游戏使用photo
router.use('/gapi/photos/:code', photos.routes())

//===============================================================
// ztoupiao
//===============================================================
import ztoupiao from './routes/gapi/game/ztoupiao.js'
router.use('/gapi/ztoupiao', ztoupiao.routes())


import handleUpload from './routes/handle_upload.js'
router.use('/handleupload', handleUpload.routes())


//===============================================================
// backend 使用api
//===============================================================
import sessions from './routes/api/sessions.js'
// 所有走/api/backend 开头的请求都需要先请求 sessions 获取token。
router.use('/api/sessions',  sessions.routes())

import backend from './routes/api/backend.js'
// 所有走/api/backend 开头的请求都需要经过jwt验证。
// 支持 query.token 上传文件请求时需要。
router.use('/api/backend', jwt({secret: secret.jwtSecret, getToken:(ctx)=>ctx.query.token}), backend.routes())

//===============================================================
// FIXME
//===============================================================
import game_round from './routes/game_round.js'
router.use('/ztoupiao', game_round.routes())

import wxopen from './routes/wxopen.js'
router.use('/api/wxopen', wxopen.routes())


app.use(router.routes()) // 将路由规则挂载到Koa上。
app.use(historyApiFallback())
app.use(serve(path.resolve('public'))) // 将webpack打包好的项目目录作为Koa静态文件服务的目录

// export default app.listen(port, () => {
//  console.log(`Koa is listening in ${port}`)
// })

const server = http.createServer(app.callback())
const { sockets } = require('./sockets')
const db = require('./config/db')
app.context.io = sockets( server ) // 绑定socketio

db().then(()=> {
    server.listen(port);
    // process received SIGINT on linux..
    process.on('SIGINT', () => {
      console.info('SIGINT signal received.')
      // Stops the server from accepting new connections and finishes existing connections.
       server.close(function(err) {
         if (err) {
           console.error(err)
           process.exit(1)
         }
       })
      // close your database connection and exit with success (0 code)
      //mongoose.connection.close(function () {
      //  console.log('Mongoose connection disconnected')
      //  process.exit(0)
      //})
      setTimeout(() => {
        console.log('Finished closing connections')
        process.exit(0)
      }, 1500)
    })

    console.info(`${process.version} listening on port ${port}`);

})

module.exports = server
