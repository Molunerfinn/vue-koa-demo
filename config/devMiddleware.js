const devMiddleware = require('webpack-dev-middleware')
const opn = require('opn')
const config = require('./index')
const autoOpenBrowser = !!config.dev.autoOpenBrowser
const port = process.env.PORT || config.dev.port
const uri = 'http://localhost:' + port
module.exports = (compiler, opts = {}, callback) => {
  const middleware = devMiddleware(compiler, opts)
  middleware.waitUntilValid(function () {
    if (autoOpenBrowser) {
      opn(uri)
    }
    callback && callback()
  })
  const devServer = async (ctx, next) => {
    if (ctx.req.url === '/') {
      return next()
    } else {
      await middleware(ctx.req, {
        end: (content) => {
          ctx.body = content
        },
        setHeader: (...args) => {
          ctx.set.apply(ctx, args)
        }
      }, next)
    }
  }
  devServer.fileSystem = middleware.fileSystem
  return devServer
}
