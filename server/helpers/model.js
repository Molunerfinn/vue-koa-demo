const db = require('../models')


  // code代表游戏类型
export function getGameRoundModelByCode(code) {

  let basename = 'gameround'
  return getModelByCode(code, basename)
}

export function getGamePlayerModelByCode(code) {

  let basename = 'gameplayer'
  return getModelByCode(code, basename)
}


export function getGameResultModelByCode(code) {

  let basename = 'gameresult'
  return getModelByCode(code, basename)
}

export function getModelByCode(code, basename) {
    if (typeof(code) != 'string') {
      throw "code requires a string"
    }
    let re = new RegExp(code+basename, 'i')
    let sequelize = db.sequelize
    let modelByCode = null
    for( let [key, model] of Object.entries(sequelize.models)){
      // DpPintuGameRound, DpPintuGamePlayer
      if (re.test(model.name)) {
        modelByCode = model
        break
      }
    }
    return modelByCode
}

// 查找一局游戏
export async function getRoundInstance( code, id ){
  
  let model = getGameRoundModelByCode( code )
  let instance = await model.findByPk( id )
  return instance
}
