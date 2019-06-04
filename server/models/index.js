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


let modelfiles = [...walk(__dirname + '/game'), ...walk(__dirname + '/dpgame')]
modelfiles.forEach((modelfile) => {
  if( !/(index|runner).js$/.test(modelfile)){
    let model = sequelize.import(modelfile)
    console.log("modelfile=", modelfile, model.name)
    db[model.name] = model
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

buildCommon( db )

module.exports = db
