var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('TermRelationship', {
    viewable_type: {
      type: DataTypes.STRING(255),
    },
    viewable_id: {
      type: DataTypes.BIGINT(11),
    },
    term_id: {
      type: DataTypes.BIGINT(11),
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'term_relationships'
  })
  return model
}
