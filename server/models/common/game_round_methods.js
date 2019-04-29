import { generateCode } from './helper'

export function bindGameRoundMethods( db ){

  let models = Object.values(db)
  models.forEach((model)=>{
    let rex = /([\w]+)GameRound$/
    if( rex.test(model.name)){

      addHooks( model )

    }
  })

}


function addHooks( model ){
  model.addHook( 'beforeCreate', 'generate_number', (game, options) => {

   game.number =  generateCode()
  })

}
