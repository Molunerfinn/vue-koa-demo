module.exports = (sequelize, DataTypes) => {
  return sequelize.define('DpYiyGameResult', {
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
    score: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    //state:{ type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' }
    //end_at: DataTypes.DATE,

  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'dpyiy_game_results',
    // 并且希望 deletedA t被称为 destroyTime(请记住启用paranoid以使其工作)
    deletedAt: 'deleted_at',
    paranoid: true,
  })
}
