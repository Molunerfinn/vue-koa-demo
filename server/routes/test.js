let process = require('child_process');//清空指定文件夹下文件 
const router = require('koa-router')(); // router middleware for koa

router.post('/initdb', async (ctx)=> {
  let cmd = "npx sequelize db:seed  --seed 20190603062043-loadplayer --config 'server/config/seeddb.js'"
  process.exec(cmd,function(err){  console.log('err=====:',err)      //当成功是error是null 
  })

  // let cmd = "npx sequelize db:seed  --seed 20190603062043-loadgameround --config 'server/config/seeddb.js'"
  // process.exec(cmd,function(err){  console.log('err=====:',err)      //当成功是error是null 
  // })

  ctx.body = 'ok'
})

module.exports = router;
