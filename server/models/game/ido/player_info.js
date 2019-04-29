var moment = require('moment')
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ido_player_info', {
    openid: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'null'
    },
    tel: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    birth: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'null'
    },
    default_store_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },

  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {},
    getterMethods: {
      displayStartAt() {
        let mo = moment(this.start_at)
        //2018年12月27日 10:00
        return mo.format("YYYY年MM月DD日 hh:mm");
      },
      displayEndAt() {
        let mo = moment(this.end_at)
        //2018年12月27日 10:00
        return mo.format("YYYY年MM月DD日 hh:mm");
      }
    },
  })
}
