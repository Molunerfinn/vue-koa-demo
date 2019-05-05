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

const app = new Koa()
const router = new KoaRouter()

let port = process.env.API_SERVER_PORT || 3000

app.use(koaBodyparser())
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
      ctx.status = 401
      ctx.body = {
        success: false,
        token: null,
        info: 'Protected resource, use Authorization header to get access'
      }
    } else {
      throw err
    }
  }
})

// set signed cookie keys for JWT cookie & session cookie
app.keys = [ 'koa-sample-app' ];

// session for flash messages (uses signed session cookies, with no server storage)
app.use(session(app)); // note koa-session@3.4.0 is v1 middleware which generates deprecation notice

// app.on('error', function (err, ctx) {
//  console.log('server error', err)
// })

router.use('/auth', auth.routes()) // 挂载到koa-router上，同时会让所有的auth的请求路径前面加上'/auth'的请求路径。
//router.use('/api', jwt({secret: 'vue-koa-demo'}), api.routes()) // 所有走/api/打头的请求都需要经过jwt验证。

import authwx from './routes/authwx.js'
router.use('/authwx', authwx.routes())

// 游戏管理api
import gameRound from './routes/api/game_round.js'
router.use('/api/game_rounds', gameRound.routes())

import gameRoundByCode from './routes/api/game_round_by_code.js'
// 支持路径 /api/game/:code/
router.use('/api/game', gameRoundByCode.routes())

// 游戏过程api
import gameBaseByCode from './routes/gapi/base_by_code.js'
router.use('/gapi/base', gameBaseByCode.routes())

// 大屏游戏过程api
import dpgameBaseByCode from './routes/gapi/dpbase_by_code.js'
router.use('/gapi/dpbase', dpgameBaseByCode.routes())

import roundByCode from './routes/gapi/game_round_by_code.js'
router.use('/gapi/game', roundByCode.routes())


import gameBargain from './routes/gapi/game/bargain.js'
router.use('/gapi/bargain', gameBargain.routes())

import gameIdo from './routes/gapi/game/ido.js'
router.use('/gapi/ido', gameIdo.routes())

import gamePintu from './routes/gapi/dpgame/pintu.js'
router.use('/gapi/dppintu', gamePintu.routes())

app.use(router.routes()) // 将路由规则挂载到Koa上。
app.use(historyApiFallback())
app.use(serve(path.resolve('dist'))) // 将webpack打包好的项目目录作为Koa静态文件服务的目录

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
