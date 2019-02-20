const {GameRoundStates} = require('../constant')
var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('game_round_bargains', {
        game_id: DataTypes.BIGINT(11),
        name: DataTypes.STRING,
        creator_id: DataTypes.BIGINT(11),         
        start_at: DataTypes.DATE,
        end_at: DataTypes.DATE,
        desc: DataTypes.TEXT,
        award_desc: DataTypes.TEXT,
        duration: { type: DataTypes.BIGINT(11), defaultValue: '0' },
        //不使用game表，code代表游戏类型  dpyiy: 大屏摇一摇, bargain: 砍价
        code: { type: DataTypes.STRING(24), allowNull: false, defaultValue: '' },
        appid: { type: DataTypes.STRING(64), allowNull: false, defaultValue: '' },
        contact_required:{ type:  DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        initial_score: { type: DataTypes.BIGINT(11), defaultValue: '0' }, // 砍价开始额度
        final_score: { type: DataTypes.BIGINT(11), defaultValue: '0' },   // 砍价最终额度
        unit_score: { type: DataTypes.BIGINT(11), defaultValue: '0' },   // 每次砍价最高额度

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
