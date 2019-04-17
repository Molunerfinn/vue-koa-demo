var moment = require('moment')
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('game_rounds', {
    game_id: DataTypes.BIGINT(11),
    name: DataTypes.STRING,
    creator_id: DataTypes.BIGINT(11),
    default_store_id: {
      type: DataTypes.STRING(24),
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
