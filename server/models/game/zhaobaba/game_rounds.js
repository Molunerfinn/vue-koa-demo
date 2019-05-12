var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ZhaobabaGameRound', {
        game_id: DataTypes.BIGINT(11),
        name: DataTypes.STRING,
        state: { type: DataTypes.STRING(24), defaultValue: 'created' },
        creator_id: DataTypes.BIGINT(11),
        start_at: DataTypes.DATE,
        end_at: DataTypes.DATE,
        desc: DataTypes.TEXT,
        award_desc: DataTypes.TEXT,
        duration: { type: DataTypes.BIGINT(11), defaultValue: '0' },
        code: { type: DataTypes.STRING(24), allowNull: false, defaultValue: 'zhaobaba' },
        appid: { type: DataTypes.STRING(64), allowNull: false, defaultValue: '' },
        contact_required:{ type:  DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        number: DataTypes.STRING  // get game_round by number

    }, {
      createdAt: 'created_at', updatedAt:'updated_at',
      tableName: 'game_rounds',
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
