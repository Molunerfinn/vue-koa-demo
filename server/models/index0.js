const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')
const config = require('../dbConfig')

var db = {}

const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options,
    {
    //   host: config.db.host,
    //   pool: config.db.pool,
       dialect: 'mysql'
    }
)

fs
    .readdirSync(__dirname)
    .filter((file) =>
        file !== 'index.js'
    )
    .forEach((modelfile) => {
        var model = sequelize.import(path.join(__dirname, modelfile))
        db[model.name] = model
    })
// db.game_results.belongsTo( db.game_players, {foreignKey: 'game_player_id'})

db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db
