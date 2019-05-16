const {
  CronJob
} = require('cron')
const moment = require('moment')
const db = require('../models/index')

const { GameRoundStates }  = require('../models/constant')
/**
 * 为当前的游戏添加计划任务，定时开始游戏，结束游戏
 * @param {*} gameround
 */
export function addGameRoundJob(gameround) {
  //console.log( "start_at", gameround, ( gameround.start_at instanceof Date))
  addGameRoundStartJob(gameround)
  addGameRoundEndJob(gameround)
}
//
function addGameRoundStartJob(gameround) {
  if ((gameround.start_at instanceof Date) && (gameround.end_at instanceof Date)) {
    //游戏状态为 ‘新建’， 才可以开始
    console.log(" gameround.start_at= ", gameround.start_at.toLocaleString())
    if ((gameround.start_at > new Date()) && (gameround.state == GameRoundStates.created)) {
      let Model = db[gameround.modelName]
      let startDate = gameround.start_at
      let gameRoundId = gameround.id
      const job = new CronJob({
        cronTime: startDate,
        timeZone: 'Asia/Shanghai',
        onTick: function() {
          // 1.检查是否已经开始，2.检查当前时间是否等于开始时间
          // 2.考虑延时，60秒之内为有效
          const d = new Date();
          let from = moment().subtract({
            minutes: 5
          }).toDate()
          let to = moment().add({
            minutes: 5
          }).toDate()
          Model.update({
            state: GameRoundStates.started
          }, {
            where: {
              id: gameRoundId,
              start_at: {
                [Op.gte]: from,
                [Op.lte]: to
              }
            }
          })
          console.log('Specific date:', startDate, ', onTick at:', d, from, to);
        }
      });
      console.log("startjob=", job)
      job.start();
    }
  }
}

function addGameRoundEndJob(gameround) {
  if ((gameround.start_at instanceof Date) && (gameround.end_at instanceof Date)) {
    //游戏状态为 ‘新建’， 才可以开始
    console.log(" gameround.start_at= ", gameround.start_at.toLocaleString())
    if ((gameround.end_at > new Date()) && (gameround.state != GameRoundStates.completed)) {
      let Model = db[gameround.modelName]
      let startDate = gameround.end_at
      let gameRoundId = gameround.id
      const job = new CronJob({
        cronTime: startDate,
        timeZone: 'Asia/Shanghai',
        onTick: function() {
          // 1.检查是否已经开始，2.检查当前时间是否等于开始时间
          // 2.考虑延时，60秒之内为有效
          const d = new Date();
          let min = moment().subtract({
            minutes: 5
          }).toDate()
          let max = moment().add({
            minutes: 5
          }).toDate()
          .Model.update({
            state: GameRoundStates.completed
          }, {
            where: {
              id: gameRoundId,
              end_at: {
                [Op.gte]: min,
                [Op.lte]: max
              }
            }
          })
          console.log('Specific date:', startDate, ', onTick at:', d, min, max);
        }
      });
      console.log("endjob=", job)
      job.start();
    }
  }
}
