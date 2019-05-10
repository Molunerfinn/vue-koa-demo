var moment = require('moment')

// 保持 名称 DpPintuGameRound  和 code：dppintu  是同样的前缀，
// api/game_rounds/  可以根据code 找到 model
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('DpPintuGameRound', {
        game_id: DataTypes.BIGINT(11),
        name: DataTypes.STRING,
        state: { type: DataTypes.STRING(24), defaultValue: 'created' },
        creator_id: DataTypes.BIGINT(11),
        start_at: DataTypes.DATE,
        end_at: DataTypes.DATE,
        desc: DataTypes.TEXT,
        award_desc: DataTypes.TEXT,
        duration: { type: DataTypes.BIGINT(11), defaultValue: '0' },
        //不使用game表，code代表游戏类型  dppingtu: 大屏拼图
        code: { type: DataTypes.STRING(24), allowNull: false, defaultValue: 'dppintu' },
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
