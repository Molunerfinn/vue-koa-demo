var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Relationship', {
    type: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    post_id: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    round_id: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    term_id: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'relationships'
  })
  return model
}
