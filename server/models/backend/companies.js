var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('companies', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        IsNull: function(value) {
          if (value == '') {
            console.log('name can not be null');
            throw new Error('name can not be null')
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        IsNull: function(value) {
          if (value == '') {
            console.log('name can not be null');
            throw new Error('name can not be null')
          }
        }
      }
    },
    is_lock: {
      type: DataTypes.STRING(24),
      defaultValue: 'N'
    },
    desc: DataTypes.TEXT, //描述
    appid: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: ''
    },
    secret: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: ''
    },
    connectType: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: 'TPA'
    }

  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'companies'
  })
  return model
}
