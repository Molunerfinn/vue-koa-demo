module.exports = (sequelize, DataTypes) => {
  return sequelize.define('IdoStroe', {
    store_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    store_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0'
    },
    tel: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    remaining: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
  }, {
    tableName:'ido_stores'
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })
}
