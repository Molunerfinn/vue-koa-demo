
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
      let albumModel = models.find((m)=> m.name == (code + "Album"))
      let photoModel = models.find((m)=> m.name == (code + "Photo"))

      if(albumModel&&playerModel){
        console.log( "buildGameAssociations "+ code + "Album," + code + "GamePlayers")
        albumModel.belongsTo( playerModel, { foreignKey: 'game_player_id', as: 'GamePlayers'})
        playerModel.hasMany( albumModel, {foreignKey: 'game_player_id', as: 'Album'})
      }


      if(albumModel&&photoModel){
        console.log( "buildGameAssociations "+ code + "Album," + code + "Photo")
        photoModel.belongsTo( albumModel, { foreignKey: 'album_id', as: 'Album'})
        albumModel.hasMany( photoModel, {foreignKey: 'album_id', as: 'Photo'})
      }

      if( playerModel && resultModel){
        // keep association name same for all games
        // ZhaobabaGameRound.hasMany( ZhaobabaGamePlayer, { foreignKey: 'game_round_id', as: 'gamePlayers'})
        // ZhaobabaGamePlayer.hasMany( ZhaobabaGameResult, {foreignKey: 'game_player_id', as: 'gameResults'})
        console.log( "buildGameAssociations "+ code + "GamePlayer," + code + "GameResult")
        model.hasMany( playerModel, { foreignKey: 'game_round_id', as: 'GamePlayers'})
        playerModel.hasMany( resultModel, {foreignKey: 'game_player_id', as: 'GameResults'})
        playerModel.belongsTo( model, { foreignKey: 'game_round_id', as: 'GameRound'})
        resultModel.belongsTo( playerModel, { foreignKey: 'game_player_id', as: 'GamePlayer'})
      }
    }
  })
}
