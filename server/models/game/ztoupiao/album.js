module.exports = (sequelize, DataTypes) => {
  const Op = sequelize.Op

  const model = sequelize.define('ZTouPiaoAlbum', {
    game_player_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    game_round_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0',
      unique:"uk_game_albums"
    },
    position: {
      type: DataTypes.BIGINT(11),
      unique:"uk_game_albums"
    },
    type: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: ''
    },
    name: DataTypes.STRING(128),
    desc: DataTypes.STRING(128),
    image_file_name: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: ''
    },
    image_content_type: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: ''
    },
    image_file_size: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    score: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    rank: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    image_updated_at: DataTypes.DATE
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'game_albums',
    hooks:{
      beforeCreate: async function(){
        // handle position
        let Model = this
        let c = await Model.count()
        this.position = c + 1
        console.log( "beforeCreate c = ", c)
      }
    }
  })

  // bindMethods(model)
  return model

}

// function bindMethods(model) {
//   model.prototype.getInfo = getInfo
// }
//
// // 返回到游戏端的信息, 用于显示游戏成绩信息
// async function getInfo() {
//
//   let isSuc = this.score < this.max_score
//   let score = this.score
//   let bestScore = this.max_score //bestScore
//   let rank = await this.currentPositionDesc()
//   let beat = await this.beat()
//
//   return {
//     id: this.id,
//     token: this.token,
//     openid: this.openid,
//     avatar: this.avatar,
//     nickname: this.nickname,
//     isSuc,
//     score,
//     bestScore,
//     rank,
//     beat
//   }
// }
