const db = require('../models')


  // code代表游戏类型
export function getGameRoundModelByCode(code) {
    if (typeof(code) != 'string') {
      throw "code requires a string"
    }
    let re = new RegExp(code, 'i')
    let sequelize = db.sequelize
    let round = null
    for( let [key, model] of Object.entries(sequelize.models)){
      if (re.test(model.name)) {
        round = model
        break
      }
    }
    return round
}
