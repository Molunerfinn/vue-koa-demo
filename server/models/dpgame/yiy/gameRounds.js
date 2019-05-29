const {
  GameRoundStates
} = require('../../constant')
var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('DpYiyGameRound', {
    game_id: DataTypes.BIGINT(11),
    name: DataTypes.STRING,
    creator_id: DataTypes.BIGINT(11),
    /* created	   0 created	新建
        open	     1 open	开始签到
        ready	     2 ready	结束签到，准备开始
        starting	 3 starting	开始前倒计时中
        started	   4 started	游戏已开始
        completed	 5 completed	游戏已结束
        disabled	 6 disabled	游戏已关闭
    */
    state: {
      type: DataTypes.STRING(24),
      defaultValue: GameRoundStates.created
    },
    start_at: DataTypes.DATE,
    end_at: DataTypes.DATE,
    desc: DataTypes.TEXT,
    award_desc: DataTypes.TEXT,
    duration: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    //不使用game表，code代表游戏类型  dpyiy: 大屏摇一摇, bargain: 砍价
    code: {
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
    initial_score: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    }, // 砍价开始额度
    final_score: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    }, // 砍价最终额度
    unit_score: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    }, // 每次砍价最高额度
    number: {
      type: DataTypes.STRING(45), // get game_round by number
      unique: true // add unique index
    }
    /*created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
          updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },*/
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'dpyiy_game_rounds',
    hooks: {},
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
    game.code = 'dpyiy'

  })
}

function bindMethods(model) {
  model.prototype.getInfo = getInfo
  model.prototype.getRandomList = getRandomList

}

function getInfo() {

  let dataList = this.getRandomList()
  let playPath = this.getPlayPath()

  return {
    id: this.id,
    number: this.number,
    state: this.state,
    name: this.name,
    desc: this.desc,
    award_desc: this.award_desc,
    start_at: this.start_at,
    end_at: this.end_at,
    contact_required: this.contact_required,
    duration: this.duration,
    host: this.host,
    code:this.code,
    playPath: playPath
  }

}

function getRandomList() {

  var dataList = [];
  for (var i = 0; i < 50; i++) {
    dataList.push(Math.round(Math.random() * 3)); //可均衡获取0到1的随机整数。
  }
  return dataList
}
