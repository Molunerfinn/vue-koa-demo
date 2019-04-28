
export function buildGameAssociations(db){
  // add association
  let models = Object.keys(db)
  models.forEach((model)=>{
    let rex = /([\w]+)GameRound$/
    let matches = rex.exec(model.name)
    if( Array.isArray( matches )){
      let code = matches[1]

      let playerModel = models.find((m)=> m.name == (code + "GamePlayer"))
      let resultModel = models.find((m)=> m.name == (code + "GameResult"))

      if( playerModel && resultName){
        // keep association name same for all games
        // ZhaobabaGameRound.hasMany( ZhaobabaGamePlayer, { foreignKey: 'game_round_id', as: 'gamePlayers'})
        // ZhaobabaGamePlayer.hasMany( ZhaobabaGameResult, {foreignKey: 'game_player_id', as: 'gameResults'})
        model.hasMany( playerModel, { foreignKey: 'game_round_id', as: 'gamePlayers'})
        playerModel.hasMany( resultModel, {foreignKey: 'game_player_id', as: 'gameResults'})
      }
    }
  })  
}
