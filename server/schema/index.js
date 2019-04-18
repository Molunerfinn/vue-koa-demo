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

//
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

let modelfiles = walk( __dirname+'/game')
modelfiles.forEach((modelfile) => {
      console.log("modelfile=", modelfile)
      let model = sequelize.import(  modelfile)
      db[model.name] = model
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export db
