
export function buildGameAssociations(db){
  // add association
  let models = Object.values(db)
  models.forEach((model)=>{
    let rex = /([\w]+)GameRound$/
    let matches = rex.exec(model.name)
    if( Array.isArray( matches )){
      let code = matches[1]

      let playerModel = models.find((m)=> m.name == (code + "GamePlayer"))
      let resultModel = models.find((m)=> m.name == (code + "GameResult"))

      if( playerModel && resultModel){
        // keep association name same for all games
        // ZhaobabaGameRound.hasMany( ZhaobabaGamePlayer, { foreignKey: 'game_round_id', as: 'gamePlayers'})
        // ZhaobabaGamePlayer.hasMany( ZhaobabaGameResult, {foreignKey: 'game_player_id', as: 'gameResults'})
        console.log( "buildGameAssociations "+ code + "GamePlayer," + code + "GameResult")
        model.hasMany( playerModel, { foreignKey: 'game_round_id', as: 'GamePlayers'})
        playerModel.hasMany( resultModel, {foreignKey: 'game_player_id', as: 'GameResults'})

        playerModel.belongsTo( model, { foreignKey: 'game_round_id', as: 'GameRound'})
      }
    }
  })
}
