var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('users', {
    cellphone: {
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
    email: {
      type: DataTypes.STRING(128),
      defaultValue: ''
    },
    appid: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    encrypted_password: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    reset_password_token: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    reset_password_sent_at: {
      type: DataTypes.DATE
    },
    remember_created_at: {
      type: DataTypes.DATE
    },
    sign_in_count:{
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    current_sign_in_at: {
      type: DataTypes.DATE
    },
    last_sign_in_at: {
      type: DataTypes.DATE
    },
    current_sign_in_ip: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    last_sign_in_ip: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    confirmation_token: {
      type: DataTypes.STRING(128),
      defaultValue: ''
    },
    confirmed_at: {
      type: DataTypes.DATE
    },
    confirmation_sent_at: {
      type: DataTypes.DATE
    },
    unconfirmed_email: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    failed_attempts:{
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    unlock_token: {
      type: DataTypes.STRING(128),
      defaultValue: ''
    },
    locked_at: {
      type: DataTypes.DATE
    },
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    },
    image_url: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    role: {
      type: DataTypes.STRING(255),
      defaultValue: 'guest'
    },
    username: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    api_token: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    company_id:{
      type: DataTypes.BIGINT(11),
      defaultValue: ''
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'users'
  })
  return model
}
