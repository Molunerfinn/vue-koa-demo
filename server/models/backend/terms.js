var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Term', {
    name: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    alias: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    desc: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    parent: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    group: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'terms'
  })
  return model
}