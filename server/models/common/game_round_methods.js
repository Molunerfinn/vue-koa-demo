import { generateCode } from './helper'

export function bindGameRoundMethods( db ){

  let models = Object.values(db)
  models.forEach((model)=>{
    let rex = /([\w]+)GameRound$/
    if( rex.test(model.name)){
      // 如果是大屏游戏
      if( /^Dp/.test( model.name) ){
        bindDpMethods(model)
      }else{
        bindDpMethods(model)
      }
      addHooks( model )
    }
  })

  function bindDpMethods(model) {
    console.log("bindGameRoundMethods", model.name)
    model.prototype.getPlayPath = async function() {
      return `/${this.code}-play.html?number=${this.number}`
    }
    model.prototype.getControlPath = async function() {
      return `/${this.code}-control.html?number=${this.number}`
    }
  }

  function bindMethods(model) {
    console.log("bindGameRoundMethods", model.name)
    model.prototype.playPath = async function() {
      return `/${this.code}.html?number=${this.number}`
    }

  }
}


function addHooks( model ){
  model.addHook( 'beforeCreate', 'generate_number', (game, options) => {
   game.code = model.name.replace('GameRound','').toLowerCase()
   game.number =  generateCode()
  })

}
