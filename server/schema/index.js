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

fs
    .readdirSync(__dirname+'/game')
    .filter((file) =>
        file !== 'index.js'
    )
    .forEach((modelfile) => {
        var model = sequelize.import(path.join(__dirname, 'game', modelfile))
        db[model.name] = model
    })

let { game_rounds, game_players, game_results, game_days, game_round_bargains }  = db

export { sequelize, Sequelize, game_rounds, game_round_bargains, game_players, game_results, game_days }
