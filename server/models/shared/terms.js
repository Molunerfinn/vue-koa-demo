module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('SharedTerm', {
    name: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    slug: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    desc: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    parent: {
      type: DataTypes.BIGINT(11)
    },
    group: {
      type: DataTypes.BIGINT(11)
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'shared_terms'
  })
  return model
}
