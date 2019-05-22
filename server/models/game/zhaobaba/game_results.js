module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ZhaobabaGameResult', {
        game_round_id: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' },
        game_player_id: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' },       //助力人
        to_game_player_id: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' }, //被助力的人
        score: { type: DataTypes.FLOAT(10,2), allowNull: false, defaultValue: '0' },
        start_at: DataTypes.DATE,
        end_at: DataTypes.DATE,
        //state:{ type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' }
        //end_at: DataTypes.DATE,

    }, {
      createdAt: 'created_at', updatedAt:'updated_at',
      tableName: 'zhaobaba_game_results'
    })
}
