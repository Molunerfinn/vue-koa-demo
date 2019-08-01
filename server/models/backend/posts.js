var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Post', {
    name: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    title: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    desc: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    creator: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    type: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    content: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    },
    deleted_at: {
      type: DataTypes.DATE
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'posts'
  })
  return model
}
