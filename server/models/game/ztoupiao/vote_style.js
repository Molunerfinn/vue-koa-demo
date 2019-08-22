module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ZTouPiaoVoteStyle', {
    game_round_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    style: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
           args: [['sum', 'times']],
           msg: "Must be sum, times."
         }
      }
    }, //prize name
    sum: {
      type: DataTypes.BIGINT(11)
    },
    day: {
      type: DataTypes.BIGINT(11)
    }, // 统计日期
    times: {
      type: DataTypes.BIGINT(11)
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'vote_style'
  })
}
