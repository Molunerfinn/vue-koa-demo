module.exports = (sequelize, DataTypes) => {
  return sequelize.define('IdoGift', {
    gift_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    gift_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'null'
    },
    image_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'null'
    },

  }, {
    tableName:'ido_gifts'
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })
}
