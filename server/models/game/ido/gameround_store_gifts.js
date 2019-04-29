module.exports = (sequelize, DataTypes) => {
  return sequelize.define('IdoGameRoundStoreGift', {
    game_round_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    store_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    gift_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    qty: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    info: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'null'
    },
    remaining: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
  }, {
    tableName:'ido_gameround_store_gifts',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })
}
