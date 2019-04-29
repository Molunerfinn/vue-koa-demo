const Sequelize =require('sequelize')
const fs = require('fs')
const path = require('path')
const config = require('../config/dbConfig')
const crypto = require('crypto')
const { buildCommon } = require( './common' )

var db = {}

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
)

//遍历 schema/game 目录
var walk = function(dir) {
  var results = []
  var list = fs.readdirSync(dir)
  list.forEach(function(file) {
    file = dir + '/' + file
    var stat = fs.statSync(file)
    if (stat && stat.isDirectory()) results = results.concat(walk(file))
    else results.push(file)
  })
  return results
}

var generateCode = function(){
 var buf = crypto.randomBytes(16)
 return buf.toString('hex')
}

let modelfiles = [...walk(__dirname + '/game'), ...walk(__dirname + '/dpgame')]
modelfiles.forEach((modelfile) => {
  let model = sequelize.import(modelfile)
  console.log("modelfile=", modelfile, model.name)
  db[model.name] = model


  if(/GameRound$/.test(model.name)){
    console.log( "GameRound$ ", model.name )
    model.addHook( 'beforeCreate', 'generate_number', (game, options) => {

     game.number =  generateCode()
    })
  }
  if(/GamePlayer$/.test(model.name)){
    console.log( "GamePlayer$ ", model.name )
    // 不要使用openid作为token，*希望游戏可以在微信、支付宝，网页等打开*
    model.addHook( 'beforeCreate', 'generate_token', (player, options) => {
      player.token = generateCode()//密钥用于更新用户信息；
    })
  }
})

buildCommon( db )

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
