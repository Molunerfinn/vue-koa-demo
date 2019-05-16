var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('ZhaobabaGameRound', {
    game_id: DataTypes.BIGINT(11),
    name: DataTypes.STRING,
    state: {
      type: DataTypes.STRING(24),
      defaultValue: 'created'
    },
    creator_id: DataTypes.BIGINT(11),
    start_at: DataTypes.DATE,
    end_at: DataTypes.DATE,
    desc: DataTypes.TEXT,         //游戏描述
    award_desc: DataTypes.TEXT,
    host: DataTypes.STRING(128),  //游戏主办方
    duration: {                   //游戏时间，多少秒
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    code: {                       //缺省值为空，必填
      type: DataTypes.STRING(24),
      allowNull: false,
      defaultValue: ''
    },
    appid: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: ''
    },
    contact_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    number: DataTypes.STRING // get game_round by number

  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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

  addHooks(model)
  bindMethods(model)

  return model
}

function addHooks(model) {
  model.addHook('beforeCreate', 'set_defults', (game, options) => {
    game.code = 'zhaobaba'

  })
}

function bindMethods(model) {
  model.prototype.getInfo = getInfo
  model.prototype.getRandomList = getRandomList

}

/**
 * 取得游戏相关信息，用于初始化游戏
 * @param {*} url
 * @return {返回值类型} wxConfig or null
 */

function getInfo() {

  let dataList = this.getRandomList()
  let playPath = this.getPlayPath()

  return {
    number: this.number,
    state: this.state,
    name: this.name,
    desc: this.desc,
    state: this.state,
    award_desc: this.award_desc,
    start_at: this.start_at,
    end_at: this.end_at,
    dataList,
    playPath
  }

}

// 取得游戏中每一行的随机位置
function getRandomList() {

  var dataList = [];
  for (var i = 0; i < 50; i++) {
    dataList.push(Math.round(Math.random() * 3)); //可均衡获取0到1的随机整数。
  }
  return dataList
}
