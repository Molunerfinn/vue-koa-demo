module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ZTouPiaoGameDay', {
        game_round_id: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' },
        game_player_id: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' },       //被助力的人
        day: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW }, // 统计日期
        visit_count:{ type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' }, // 每日访问次数
        share_count: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' }, // 每日分享次数
        play_count:{ type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' }, // 每日玩的次数
        ip: { type: DataTypes.STRING, limit: 64 } //prize name

    }, {
      createdAt: 'created_at', updatedAt:'updated_at',
      tableName: 'game_days'
    })
}
