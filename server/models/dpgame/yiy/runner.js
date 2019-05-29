// 处理游戏运行控制逻辑
// 操作 数据库实现游戏的运行逻辑
// 这里不创建任何数据库记录，只是读取和跟新状态
const {
  Sequelize,
  DpYiyGameRound,
  DpYiyGamePlayer
} = require('../../index')
const {
  DpGameRoundStates
} = require('../../constant')

const redisClient = require('../../redisClient')
const redisdb = new redisClient()

// 游戏流程控制
// 游戏流程
// PC端（控制端）
// 准备开始-> 玩家签到 -> 点击开始游戏 ->(开始前倒计时)->游戏进行中-> 游戏结束 ->显示排名
class YiyRunner {

  constructor(number) {
    this.number = number
  }

  /**
   * 开放游戏，用户可以注册
   * @param {*}
   */
  async openRound() {
    console.log('openRound');
    console.log('DpGameRoundStates--:', DpGameRoundStates);
    let round = await this.getGameRound()
    console.log('round=====:', round);
    await round.update({
      state: DpGameRoundStates.open
    })
    return round
  }
  /**
   * 开始游戏，save the round start_at time in the db
   * @param {*}
   * return  updated game_round
   */
  async startRound() {
    let round = await this.getGameRound()
    await round.update({
      start_at: new Date(),
      state: DpGameRoundStates.started
    })
    return round
  }
  async GetRoundAllPlayers() {
    let round = await this.getGameRound()
    let gameroundid = round.id
    let gamePlayers = await DpYiyGamePlayer.findAll({
      where: {
        game_round_id: gameroundid
      }
    })
    return gamePlayers
  }

  async AddPlayersToMemoryDb() {
    let round = await this.getGameRound()
    let gameroundid = round.id
    let game_round = await DpYiyGameRound.findByPk(gameroundid)

    const players = await this.GetRoundAllPlayers()
    let key = this.getRedisKey(gameroundid)

    redisdb.remove(key, () => {
      console.log("removed redis " + key)
    })
    players.forEach((player) => {
      redisdb.hSet(key, player.id, {
        player_id: player.id,
        score: 0
      })
    })
  }

  async updatePlayerScore(playerid, score) {
    let round = await this.getGameRound()
    let gameroundid = round.id
    let key = this.getRedisKey(gameroundid)
    redisdb.hSet(key, playerid, {
      score
    })

  }

  async getRedisKey(gameroundid) {
    let round = await this.getGameRound()
    return `${round.name}:${gameroundid}`
  }

  async getRedisPlayerScores(gameroundid) {
    let key = this.getRedisKey(gameroundid)
    var p = new Promise((resolve) => {
      redisdb.hGetAll(key, (error, players) => {
        if (error || !players) resolve([])
        else {
          var ar = new Array()
          console.log("getRedisPlayerScores = ", players)
          for (var playerid in players) {
            var player = JSON.parse(players[playerid])
            ar.push({
              player_id: playerid,
              score: player.score
            })
          }
          resolve(ar)
        }
      })
    })
    return p
  }
  /**
   * 取得玩家信息，在数据库取得，以便显示玩家列表
   * @param {} gameroundid
   */
  async getAllPlayers() {
    let round = await this.getGameRound()
    let gameroundid = round.id
    let gamePlayers = await DpYiyGamePlayer.findAll({
      where: {
        game_round_id: gameroundid
      }
    })
    return gamePlayers
  }
  /**
   * 取得玩家成绩，结果按照成绩排序
   * 开始游戏后，缓存中取得
   * @param {} gameroundid
   */
  async getPlayerScores() {
    let round = await this.getGameRound()
    let gameroundid = round.id
    let playerScores = await this.getRedisPlayerScores(gameroundid)
    console.log("GetPlayerScores", playerScores)
    let players = new Array()
    if (players) {
      playerScores.forEach((x) => {
        let player = {
          player_id: x.player_id,
          score: x.score
        }
        players.push(player)
      })
    }
    players.sort((a, b) => {
      return b.score - a.score
    })
    return players
  }
  /**
   * 结束游戏
   * @param {*}
   */
  async endRound() {
    let state = 'completed'
    let round = await this.getGameRound()
    let gameroundid = round.id

    var players = await this.getRedisPlayerScores(gameroundid)
    var updates = []
    players.sort((a, b) => {
      return (b.score - a.score)
    })
    for (var i = 0; i < players.length; i++) {
      let player = players[i]
      let res = DpYiyGamePlayer.update({
        rank: i + 1,
        'score': player.score
      }, {
        where: {
          id: player.player_id
        }
      })
      updates.push(res)
    }
    await Promise.all(updates)
    await DpYiyGameRound.update({
      state: state,
      end_at: Sequelize.fn('NOW')
    }, {
      where: {
        id: gameroundid
      }
    })
    let game_round = await DpYiyGameRound.findByPk(gameroundid)
    return game_round
  }

  /**
   * 重置游戏，便于调试使用，即设置游戏状态为created
   * @param {*}
   */
  async resetRound() {
    let round = await this.getGameRound()
    await round.update({
      state: DpGameRoundStates.created
    })
    return round
  }

  async getGameRound() {
    return await DpYiyGameRound.findOne({
      where: {
        number: this.number
      }
    })
  }
}

export default YiyRunner
