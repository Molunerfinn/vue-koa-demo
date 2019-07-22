var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('wxmpusers', {
    appid: {
      type: DataTypes.STRING(255),
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
    access_token: {
      type: DataTypes.STRING(255)
    },
    refresh_token: {
      type: DataTypes.STRING(255)
    },
    nick_name: {
      type: DataTypes.STRING(255)
    },
    head_img: {
      type: DataTypes.STRING(255)
    },
    user_name: {
      type: DataTypes.STRING(255)
    },
    alias: {
      type: DataTypes.STRING(255)
    },
    wx_token: {
      type: DataTypes.STRING(255)
    },
    service_type_id: {
      type: DataTypes.BIGINT(11),
    },
    verify_type_info: {
      type: DataTypes.STRING(255)
    },
    access_token_updated_at: {
      type: DataTypes.DATE
    },
    access_token_expires_in: {
      type: DataTypes.DATE
    },
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    },
    company_id: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    creator_id: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    qrcode_url: {
      type: DataTypes.STRING(255)
    },
    auth_code: {
      type: DataTypes.STRING(255)
    },
    func_info: {
      type: DataTypes.TEXT
    },
    expires_in: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    service_type: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    bind_type: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    openid: {
      type: DataTypes.STRING(255)
    },
    url: {
      type: DataTypes.STRING(255)
    },
    token: {
      type: DataTypes.STRING(255)
    },
    status: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    app_secret: {
      type: DataTypes.STRING(255)
    },
    app_id: {
      type: DataTypes.STRING(255)
    },
    encrypt_mode: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    encoding_aes_key: {
      type: DataTypes.STRING(255)
    },
    is_oauth: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    binds_count: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'wx_mp_users'
  })
  return model
}
