// 处理游戏运行控制逻辑
// 操作 数据库实现游戏的运行逻辑
// 这里不创建任何数据库记录，只是读取和跟新状态
const { Sequelize, PintuGameRound } = require('./index')
const { DpGameRoundStates } = require('../../constant')

class PintuRunner {
    constructor(number) {
      this.number = number
    }

    /**
     * 开放游戏，用户可以注册
     * @param {*}
     */
    async openRound() {

      let round = await this.getGameRound()
      await round.update( { state:  DpGameRoundStates.open})
      return round
    }
    /**
     * 开始游戏，save the round start_at time in the db
     * @param {*}
     * return  updated game_round
     */
    async startRound() {
      let round = await this.getGameRound()
      await round.update( { state:  DpGameRoundStates.start})
      return round
    }
    /**
     * 取得玩家信息，在数据库取得，以便显示玩家列表
     * @param {} gameroundid
     */
    async GetRoundAllPlayers() {
      let round =  await this.getGameRound()
      let gameroundid = round.id
      let gamePlayers = await game_players.findAll({ where:{ game_round_id:gameroundid }})
      return gamePlayers
    }
    /**
     * 取得玩家成绩，结果按照成绩排序
     * 开始游戏后，缓存中取得
     * @param {} gameroundid
     */
    async GetPlayerScores() {
      let gameroundid = this.gameroundid
      let rs = this.GetRoundAllPlayers()
      let players =this.GetRoundAllPlayers()

      players.sort((a,b)=>{ return b.score-a.score } )
      return players
    }
    /**
     * 结束游戏
     * @param {*}
     */
    async endRound() {

      let round = this.getGameRound()
      await round.update( { state:  DpGameRoundStates.completed})
      return round
    }

    /**
     * 控制台点击开始游戏时，添加玩家到缓存
     * return player information include the id of the player
     */
    async AddPlayersToMemoryDb() {
      //let gameroundid = this.gameroundid
      //const players = await this.GetRoundAllPlayers()
      //await dbOperation.MemoryDbOperation.AddBatchPlayersToRound( gameroundid, players )
    }


    /**
     * update player score
     * return award
     * @param {*} awardid
     */
     async updatePlayerScore( playerid, score) {
       //let gameroundid = this.gameroundid
       //await dbOperation.MemoryDbOperation.UpdatePlayerScore(gameroundid, playerid, score)
     }

     async getGameRound(){
       return await PintuGameRound.findOne({
           where: {
               number: this.number
           }
       })
     }
}

export default PintuRunner
