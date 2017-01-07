const app = require('koa')()
  , koa = require('koa-router')()
  , json = require('koa-json')
  , logger = require('koa-logger');

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.on('error', function(err, ctx){
  console.log('server error', err);
});

app.use(koa.routes());

console.log('Koa is listening in 8889');

app.listen(8889);

module.exports = app;