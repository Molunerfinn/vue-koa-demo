var moment = require('moment')
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('IdoPlayer', {
    openid: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'null'
    },
    headurl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'null'
    },
    to_player_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    default_store_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },

  }, {
    tableName:'ido_players',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {}
  })
}