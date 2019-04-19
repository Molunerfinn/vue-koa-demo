import Sequelize from 'sequelize'
import fs from 'fs'
import path from 'path'
import config from '../config/dbConfig'

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

let modelfiles = walk(__dirname + '/game')
modelfiles.forEach((modelfile) => {
  console.log("modelfile=", modelfile)
  let model = sequelize.import(modelfile)
  db[model.name] = model
})


let {
  game_rounds,
  bargain_game_rounds,
  game_players,
  game_results,
  game_days,
  ido_game_rounds,
  ido_gifts,
  ido_gameround_store_gifts,
  ido_players,
  ido_player_info,
  ido_results,
  ido_stores
} = db

export {
  sequelize,
  Sequelize
}

//
export {
  game_rounds,
  game_players,
  game_results,
  game_days
}

//砍价游戏
export {
  bargain_game_rounds
}

export {
  ido_game_rounds,
  ido_gifts,
  ido_gameround_store_gifts,
  ido_players,
  ido_player_info,
  ido_results,
  ido_stores
}
