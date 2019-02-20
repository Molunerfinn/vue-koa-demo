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
db.game_results.belongsTo( db.game_players, {foreignKey: 'game_player_id'})

let { game_rounds, game_players }  = db

export { sequelize, Sequelize, game_rounds, game_players }
