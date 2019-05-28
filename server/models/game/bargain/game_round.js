const {GameRoundStates} = require('../../constant')
var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('BargainGameRound', {
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
        number: {
          type: DataTypes.STRING(45), // get game_round by number
          unique: true // add unique index
        }

    }, {
      createdAt: 'created_at', updatedAt:'updated_at',
      tableName: 'game_rounds'

    })
}
