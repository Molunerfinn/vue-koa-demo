var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('DpPintuGameRound', {
    game_id: DataTypes.BIGINT(11),
    name: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        IsNull: function(value) {
          if (value == null) {
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
    start_at: DataTypes.DATE,
    end_at: DataTypes.DATE,
    desc: DataTypes.TEXT,
    award_desc: DataTypes.TEXT,
    duration: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0',
      allowNull: false,
      validate: {
        IsNull: function(value) {
          if (value == null) {
            console.log('duration can not be null');
            throw new Error('duration can not be null')
          }
        }
      }
    },
    code: {
      type: DataTypes.STRING(24),
      allowNull: false,
      defaultValue: '',
      validate: {
        IsNull: function(value) {
          if (value == null) {
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
    tableName: 'dppintu_game_rounds'
  })

  addHooks( model)
  bindMethods(model)

  return model
}

function addHooks(model) {
  model.addHook('beforeCreate', 'set_defults', (game, options) => {
    game.code = 'dppintu'

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

// 取得游戏中每一行的随机位置
function getRandomList() {

  var dataList = [];
  for (var i = 0; i < 50; i++) {
    dataList.push(Math.round(Math.random() * 3)); //可均衡获取0到1的随机整数。
  }
  return dataList
}
