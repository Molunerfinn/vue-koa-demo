module.exports = (sequelize, DataTypes) => {
  return sequelize.define('IdoResult', {
    openid: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    to_player_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    createtime: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'null'
    },
    sourceid: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0'
    },
  }, {
    tableName:'ido_results'
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })
}
