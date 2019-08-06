export function buildGameAssociations(db) {
  // add association
  let models = Object.values(db)
  models.forEach((model) => {
    let rex = /([\w]+)GameRound$/
    let matches = rex.exec(model.name)
    if (Array.isArray(matches)) {
      let code = matches[1]

      let playerModel = models.find((m) => m.name == (code + "GamePlayer"))
      let resultModel = models.find((m) => m.name == (code + "GameResult"))
      let albumModel = models.find((m) => m.name == (code + "Album"))
      let photoModel = models.find((m) => m.name == (code + "Photo"))

      let PhotoRelationship = db.PhotoRelationship
      let postModel = db.Post

      if (albumModel && playerModel && photoModel) {
        console.log("buildGameAssociations " + code + "Album," + code + "GamePlayers")
        // album and player
        albumModel.belongsTo(playerModel, {
          foreignKey: 'game_player_id',
          as: 'GamePlayer'
        })
        playerModel.hasMany(albumModel, {
          foreignKey: 'game_player_id',
          as: 'Albums'
        })

        // album and photo
        photoModel.belongsTo(albumModel, {
          foreignKey: 'album_id',
          as: 'Album'
        })
        albumModel.hasMany(photoModel, {
          foreignKey: 'album_id',
          as: 'Photos'
        })
        // round and slide
        model.belongsToMany(photoModel, {
          through:{
            model: PhotoRelationship,
            scope: {
                viewable_type: 'slide'
            }
          },
          foreignKey: 'viewable_id',
          otherKey: 'photo_id',
          as: 'Slides'
        })

        postModel.belongsToMany(photoModel, {
          through:{
            model: PhotoRelationship,
            scope: {
                viewable_type: 'cover'
            }
          },
          foreignKey: 'viewable_id',
          otherKey: 'photo_id',
          as: 'Covers'
        })


      }



      if (playerModel && resultModel) {
        // keep association name same for all games
        // ZhaobabaGameRound.hasMany( ZhaobabaGamePlayer, { foreignKey: 'game_round_id', as: 'gamePlayers'})
        // ZhaobabaGamePlayer.hasMany( ZhaobabaGameResult, {foreignKey: 'game_player_id', as: 'gameResults'})
        console.log("buildGameAssociations " + code + "GamePlayer," + code + "GameResult")
        model.hasMany(playerModel, {
          foreignKey: 'game_round_id',
          as: 'GamePlayers'
        })
        model.hasMany(resultModel, {
          foreignKey: 'game_round_id',
          as: 'GameResults'
        })
        playerModel.hasMany(resultModel, {
          foreignKey: 'game_player_id',
          as: 'GameResults'
        })
        playerModel.belongsTo(model, {
          foreignKey: 'game_round_id',
          as: 'GameRound'
        })
        resultModel.belongsTo(playerModel, {
          foreignKey: 'game_player_id',
          as: 'GamePlayer'
        })
      }
    }
  })
}
