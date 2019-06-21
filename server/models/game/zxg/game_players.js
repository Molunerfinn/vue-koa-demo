

module.exports = (sequelize, DataTypes) => {
    const Op = sequelize.Op

    const model = sequelize.define('ZxgGamePlayer', {
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
        sex: { type:DataTypes.STRING(64) },
        language: { type: DataTypes.STRING(64)},
        country: { type: DataTypes.STRING(64)},
        province: { type: DataTypes.STRING(64)},
        city: { type: DataTypes.STRING(64)},
        ip: { type: DataTypes.STRING(64)}
    }, {
      createdAt: 'created_at', updatedAt:'updated_at',
      tableName: 'game_players'
    })

    bindMethods(model)
    return model

}

function bindMethods(model) {
  model.prototype.getInfo = getInfo
}

// 返回到游戏端的信息, 用于显示游戏成绩信息
async function  getInfo(   ){

    let isSuc = this.score < this.max_score
    let score = this.score
    let bestScore = this.max_score //bestScore
    let rank = await this.currentPositionDesc()
    let beat = await this.beat()

  return { id: this.id, token: this.token, openid: this.openid, avatar: this.avatar, nickname: this.nickname, isSuc, score, bestScore, rank, beat }
}
