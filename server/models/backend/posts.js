var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Post', {
    author: {
      type: DataTypes.STRING(24),
      defaultValue: ''
    },
    title: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    excerpt: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    created_by: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
