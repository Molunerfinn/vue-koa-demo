module.exports = (sequelize, DataTypes) => {
  let Model = sequelize.define('ZTouPiaoGameResult', {
    game_round_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    game_player_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    }, //助力人
    to_game_player_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    }, //被助力的人
    // to_album_id: {
    //   type: DataTypes.BIGINT(11),
    //   allowNull: false,
    //   defaultValue: '0'
    // }, //被投票的作品
    score: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
      defaultValue: '0'
    },
    start_at: DataTypes.DATE,
    end_at: DataTypes.DATE,
    //state:{ type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' }
    //end_at: DataTypes.DATE,

  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    tableName: 'game_results'
  })

  function computeGameRoundResultCount(instance){
    //instance.
  }
  // Method 2
  Model.hook('afterDestroy', 'RecomputeGameRoundResultCount', computeGameRoundResultCount)
  // Method 3
  Model.hook('afterCreate', 'RecomputeGameRoundResultCount', computeGameRoundResultCount)

  return Model
}
