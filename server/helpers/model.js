const db = require('../models')

export function getCompanies() {
  let basename = 'companies'
  return getModel(basename)
}

export function getPostModel(){
  let basename = 'post'
  return getModel(basename)
}

export function getTermRelationshipModel(){
  let basename = 'TermRelationship'
  return getModel(basename)
}

export function getPhotoRelationshipModel(){
  let basename = 'photo_relationship'
  return getModel(basename)
}


export function getTermModel(){
  let basename = 'Terms'
  return getModel(basename)
}

export function getWxMpUsersModel(){
  let basename = 'wx_mp_users'
  return getModel(basename)
}

export function getUsersModel(){
  let basename = 'users'
  return getModel(basename)
}
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

export function getGameAlbumModelByCode(code) {

  let basename = 'album'
  return getModelByCode(code, basename)
}

export function getGamePhotoModelByCode(code) {

  let basename = 'Photo'
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

export function getModel(basename) {
    if (typeof(basename) != 'string') {
      throw "basename requires a string"
    }
    let re = new RegExp(basename, 'i')
    let sequelize = db.sequelize
    let Model = null
    for( let [key, model] of Object.entries(sequelize.models)){
      // DpPintuGameRound, DpPintuGamePlayer
      if (re.test(model.name)) {
        Model = model
        break
      }
    }
    return Model
}

// 查找一局游戏
export async function getRoundInstance( code, id ){

  let model = getGameRoundModelByCode( code )
  let instance = await model.findByPk( id )
  return instance
}
