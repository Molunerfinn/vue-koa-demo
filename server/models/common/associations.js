function buildGameAssociations(db) {
  // 为公共模型添加关系
  let SharedPost = db.SharedPost
  let SharedPhoto = db.SharedPhoto
  let SharedTerm = db.SharedTerm
  let SharedPhotoRelationship = db.SharedPhotoRelationship
  let SharedTermRelationship = db.SharedTermRelationship

  buildSharedAssociations( db )
  // 为每种游戏添加关系，游戏可能使用了公共模型，如 投票游戏使用 图片，文章

  let models = Object.values(db)
  models.forEach((model) => {
    let rex = /([\w]+)GameRound$/
    let matches = rex.exec(model.name)
    if (Array.isArray(matches)) {
      // 为每个游戏添加关系
      let code = matches[1]

      let playerModel = models.find((m) => m.name == (code + "GamePlayer"))
      let resultModel = models.find((m) => m.name == (code + "GameResult"))
      let albumModel = models.find((m) => m.name == (code + "Album"))
      //let photoModel = models.find((m) => m.name == (code + "Photo"))


      // 投票类游戏 有Album
      if (albumModel && playerModel) {
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
        SharedPhoto.belongsTo(albumModel, {
          foreignKey: 'album_id',
          // Should on update and on delete constraints be enabled on the foreign key.
          // we should move album to viewable_id, viewable_type album
          constraints: false,
          as: 'Album'
        })
        albumModel.hasMany(SharedPhoto, {
          foreignKey: 'album_id',
          constraints: false,
          as: 'Photos'
        })
        // round and slide
        model.belongsToMany(SharedPhoto, {
          through:{
            model: SharedPhotoRelationship,
            scope: {
                viewable_type: 'slide'
            }
          },
          constraints:false,
          foreignKey: 'viewable_id',
          otherKey: 'photo_id',
          as: 'Slides'
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

// copy to zgame_site
function buildSharedAssociations(db) {
  // 为公共模型添加关系
  let SharedPost = db.SharedPost
  let SharedPhoto = db.SharedPhoto
  let SharedTerm = db.SharedTerm
  let SharedPhotoRelationship = db.SharedPhotoRelationship
  let SharedTermRelationship = db.SharedTermRelationship

  SharedPost.belongsToMany(SharedPhoto, {
    through:{
      model: SharedPhotoRelationship,
      scope: {
          viewable_type: 'cover'
      }
    },
    constraints:false,
    foreignKey: 'viewable_id',
    otherKey: 'photo_id',
    as: 'Covers'
  })

  SharedPost.belongsToMany(SharedTerm, {
    through:{
      model: SharedTermRelationship,
      scope: {
          viewable_type: 'post'
      }
    },
    foreignKey: 'viewable_id',
    otherKey: 'term_id',
    as: 'Terms'
  })

  //  支持查找分配了几个分类的文章
  //  findAll( { include:[{association:'TermRelationships', where:{ taxon_id: xxx } }]})
  SharedPost.hasMany(SharedTermRelationship, {
    foreignKey: 'viewable_id',
    scope: {
      viewable_type: 'post'
    },
    as: 'TermRelationships'
  })
}


module.exports = {
  buildGameAssociations,
  buildSharedAssociations
}
