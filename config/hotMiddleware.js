const hotMiddleware = require('webpack-hot-middleware')
const { PassThrough } = require('stream')
module.exports = (compiler, opts) => {
  const middleware = hotMiddleware(compiler, opts)
  return async (ctx, next) => {
    let stream = new PassThrough()
    ctx.body = stream
    await middleware(ctx.req, {
      write: stream.write.bind(stream),
      writeHead: (state, headers) => {
        ctx.state = state
        ctx.set(headers)
      }
    }, next)
  }
}
