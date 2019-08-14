var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('SharedPost', {
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
      type: DataTypes.STRING(12),
      defaultValue: 'page' // 文章类型 'page', 'gamenews'
    },
    status: {
      type: DataTypes.STRING(12),
       // 文章状态，'public', 'draft'
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
    tableName: 'shared_posts'
  })
  return model
}
