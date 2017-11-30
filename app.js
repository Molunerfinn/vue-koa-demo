import './env'
import Koa from 'koa'
import json from 'koa-json'
import logger from 'koa-logger'
import auth from './server/routes/auth.js'
import api from './server/routes/api.js'
import jwt from 'koa-jwt'
import path from 'path'
import fs from 'fs'
import serve from 'koa-static'
// import historyApiFallback from 'koa2-history-api-fallback'
import koaRouter from 'koa-router'
import koaBodyparser from 'koa-bodyparser'
import { createBundleRenderer } from 'vue-server-renderer'

const isProd = process.env.NODE_ENV === 'production'
const app = new Koa()
const router = koaRouter()
const resolve = file => path.resolve(__dirname, file)

function createRenderer (bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    basedir: resolve('./dist'),
    runInNewContext: false
  }))
}

let renderer
const templatePath = resolve('./index.html')

let port = process.env.PORT

if (isProd) {
  const template = fs.readFileSync(templatePath, 'utf-8')
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
  app.use(serve(path.resolve('dist')))
} else {
  require('./build/setup-dev-server')(app, (bundle, template) => {
    renderer = createRenderer(bundle, template)
  })
}

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

app.on('error', function (err, ctx) {
  console.log('server error', err)
})

router.use('/auth', auth.routes()) // 挂载到koa-router上，同时会让所有的auth的请求路径前面加上'/auth'的请求路径。
router.use('/api', jwt({secret: 'vue-koa-demo'}), api.routes()) // 所有走/api/打头的请求都需要经过jwt验证。

app.use(router.routes()) // 将路由规则挂载到Koa上。
// app.use(historyApiFallback())
app.use(serve(path.resolve('dist'))) // 将webpack打包好的项目目录作为Koa静态文件服务的目录

router.get('*', async (ctx, next) => {
  if (!renderer) {
    ctx.body = 'waiting for compilation... refresh in a moment.'
    return ctx.body
  } else {
    let req = ctx.req
    ctx.type = 'html'
    const s = Date.now()
    let context = { url: req.url }
    console.log('req url:', req.url)
    ctx.body = await renderToStringPromise(context, s)
    // return next()
  }
})

function renderToStringPromise (context, s) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      if (err) {
        console.log(err)
      }
      if (!isProd) {
        console.log(`whole request: ${Date.now() - s}ms`)
      }
      resolve(html)
    })
  })
}

app.use(router.routes()) // 将路由规则挂载到Koa上。
app.use(router.allowedMethods())

export default app.listen(port, () => {
  console.log(`Koa is listening in ${port}`)
})
