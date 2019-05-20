var moment = require('moment')
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('IdoPlayerInfo', {
    openid: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'null'
    },
    tel: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    birth: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'null'
    },
    default_store_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },

  }, {
    tableName:'ido_player_infos',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {}
  })
}
