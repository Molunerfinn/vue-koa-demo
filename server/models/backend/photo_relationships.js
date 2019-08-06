var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('PhotoRelationship', {
    photo_id: {
      type: DataTypes.BIGINT(11),
    },
    viewable_id: {
      type: DataTypes.BIGINT(11),
    },
    viewable_type: {
      type: DataTypes.STRING(24),
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'photo_relationships'
  })
  return model
}
