module.exports = (sequelize, DataTypes) => {
  const Op = sequelize.Op

  const model = sequelize.define('DpPintuGamePlayer', {
    openid: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    }, //
    game_round_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    nickname: DataTypes.STRING(128),
    rank: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    score: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
      defaultValue: '0'
    },
    max_score: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
      defaultValue: '0'
    },
    avatar: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: ''
    },
    cellphone: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: ''
    },
    realname: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: ''
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: ''
    },
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'dppintu_game_players'
  })

  addHooks(model)
  bindMethods(model)
  return model

}

function addHooks(model) {
  model.addHook('beforeCreate', 'set_defult_score', (player, options) => {
    player.score = 9999.99
    player.max_score = 9999.99
  })
}

function bindMethods(model) {
  model.prototype.getInfo = getInfo
}

// 返回到游戏端的信息, 用于显示游戏成绩信息
async function getInfo() {

  let isSuc = this.score < this.max_score
  let score = this.score
  let bestScore = this.max_score //bestScore
  let rank = await this.currentPositionAsc()
  let beat = await this.beatAsc()

  return {
    token: this.token,
    openid: this.openid,
    avatar: this.avatar,
    nickname: this.nickname,
    isSuc,
    score,
    bestScore,
    rank,
    beat
  }
}
