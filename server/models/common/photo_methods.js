const {
  generateUniqueSecureToken
}  = require('./helper')

function bindPhotoMethods( db ){
  let models = Object.values(db)
  models.forEach((model)=>{
    let rex = /([\w]+)Photo$/
    if( rex.test(model.name)){
      addHooks( model )
    }
  })
}



function addHooks( model ){
  model.addHook( 'beforeCreate', 'generate_photo_okey', (game, options) => {
      game.okey =  generateUniqueSecureToken()
  })

}
module.exports = {
  bindPhotoMethods
}
