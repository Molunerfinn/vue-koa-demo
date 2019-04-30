

module.exports = (sequelize, DataTypes) => {
    const Op = sequelize.Op

    const model = sequelize.define('DpPintuGamePlayer', {
        openid: {type:DataTypes.STRING, allowNull: false, defaultValue: ''  },//
        game_round_id: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' },
        nickname: DataTypes.STRING(128),
        rank: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' },
        score: { type: DataTypes.FLOAT(10,2), allowNull: false, defaultValue: '0' },
        max_score: { type: DataTypes.FLOAT(10,2), allowNull: false, defaultValue: '0' },
        avatar: { type: DataTypes.STRING(300), allowNull: false, defaultValue: '' },
        cellphone: { type: DataTypes.STRING(64), allowNull: false, defaultValue: '' },
        realname: { type: DataTypes.STRING(64), allowNull: false, defaultValue: '' },
        token: { type: DataTypes.STRING(64), allowNull: false, defaultValue: '' },
    }, {
      createdAt: 'created_at', updatedAt:'updated_at',
      tableName: 'game_players'
    })

    return model

}
