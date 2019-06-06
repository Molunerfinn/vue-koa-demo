let process = require('child_process');//清空指定文件夹下文件 
const router = require('koa-router')(); // router middleware for koa


// 处理所有游戏的授权链接
router.post('/initdb', async (ctx)=> {
  let cmd = "node_modules\\.bin\\sequelize db:seed  --seed 20190603062043-loadplayer --config 'server/config/seeddb.js'"
  process.exec(cmd,function(err){  console.log(err)      //当成功是error是null 
  })
})

module.exports = router;
