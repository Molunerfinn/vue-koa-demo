var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('ZxgGameRound', {
    game_id: DataTypes.BIGINT(11),
    name: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        IsNull: function(value) {
          if (value == '') {
            console.log('name can not be null');
            throw new Error('name can not be null')
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING(24),
      defaultValue: 'created'
    },
    creator_id: DataTypes.BIGINT(11),
    start_at: {
      type:DataTypes.DATE,
      allowNull: false,
      validate: {
        IsNull: function(value) {
          if (value == '') {
            console.log('start_at can not be null');
            throw new Error('start_at can not be null')
          }
        }
      }
    },
    end_at: {
      type:DataTypes.DATE,
      allowNull: false,
      validate: {
        IsNull: function(value) {
          if (value == '') {
            console.log('end_at can not be null');
            throw new Error('end_at can not be null')
          }
        }
      }
    },
    desc: DataTypes.TEXT,         //游戏描述
    award_desc: DataTypes.TEXT,
    host: DataTypes.STRING(128),  //游戏主办方
    duration: {                   //游戏时间，多少秒
      type: DataTypes.BIGINT(11),
      defaultValue: '0',
      allowNull: false,
      validate: {
        IsNull: function(value) {
          if (value == '') {
            console.log('duration can not be null');
            throw new Error('duration can not be null')
          }
        }
      }
    },
    code: {                       //缺省值为空，必填
      type: DataTypes.STRING(24),
      allowNull: false,
      defaultValue: '',
      validate: {
        IsNull: function(value) {
          if (value == '') {
            console.log('code can not be null');
            throw new Error('code can not be null')
          }
        }
      }
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
    number: {
      type: DataTypes.STRING(45), // get game_round by number
      unique: true // add unique index
    }

  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'game_rounds'
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
    host: this.host,
    dataList,
    playPath,
    code: this.code,
    duration: this.duration,
    contact_required: this.contact_required
  }

}

// 取得游戏中每一行的随机位置
function getRandomList() {

  var dataList = [];
  for (var i = 0; i < 50; i++) {
    dataList.push(Math.random() * 14); //可均衡获取0到14的随机整数。
  }
  return dataList
}
