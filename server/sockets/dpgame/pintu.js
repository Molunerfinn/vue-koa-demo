const PintuSocketEvent = {
  OpenGameEvent: "OpenGameEvent",
  GetGamePlayersEvent: "GetGamePlayersEvent",
  StartGameEvent: "StartGameEvent",
  ResetGameEvent: "ResetGameEvent",
  GameStartingEvent: "GameStartingEvent", // data: countTime
  GameRunningEvent: "GameRunningEvent",
  GameOpeningEvent: "GameOpeningEvent",
  GameEndEvent: "GameEndEvent",
}
// 游戏socketio通讯
// 游戏流程
// PC端（控制端）
// 准备开始-> 玩家签到 -> 点击开始游戏 ->(开始前倒计时)->游戏进行中-> 游戏结束 ->显示排名
import {
  getGameRoundNumber
} from './helper'
import PintuRunner from '../../models/dpgame/pintu/runner'
import {
  DpGameRoundStates
} from '../../models/constant'

export default class DpPintuSocket {
  // bind on connection
  static async bind(io) {
    const dynamicNsp = io.of(/^\/channel-dppintu-\w+$/).on('connect', (socket) => {

      // broadcast to all clients in the given sub-namespace
      let number = getGameRoundNumber(socket)
      const newNamespace = socket.nsp; // newNamespace.name === '/dynamic-101'

      newNamespace.emit('hello');
      DpPintuSocket.bindPlay(socket, number);

    });

  }


  // 绑定大屏游戏页面触发的事件
  static async bindPlay(socket, number) {

    // 游戏开始签到事件
    socket.on('OpenGameEvent', async (data, callback) => {
      console.log('OpenGameEvent');
      const namespace = socket.nsp; // newNamespace.name === '/dynamic-101'
      let runner = new PintuRunner(number)
      let game_round = await runner.openRound()
      socket.emit('GameOpeningEvent', {
        gameState: 1
      });
      let payload = {
        gameState: 1
      }
      namespace.emit('GameOpeningEvent', payload);
      callback({
        gameRoundState: game_round.state
      })
    });

    // 取得签到用户事件, 当游戏结束后，重新加载页面，也会调用这个事件，列出成绩
    socket.on('GetGamePlayersEvent', async (data, callback) => {
      console.log("GetGamePlayersEvent:", socket.id)
      //console.log("GetGamePlayersEvent rooms=",socket.rooms);
      let number = getGameRoundNumber(socket)
      let runner = new PintuRunner(number)
      let gamePlayers = await runner.getAllPlayers()
      callback({
        gamePlayers
      })
    });

    // 游戏开始玩事件
    socket.on('StartGameEvent', async (data, callback) => {
      const namespace = socket.nsp; // newNamespace.name === '/dynamic-101'
      console.log("StartGameEvent:", socket.client.id)
      console.log("StartGameEvent rooms=", socket.rooms);

      let countTime = 3
      let number = getGameRoundNumber(socket)

      //let game_round = await MemoryDbOperation.GetRoundById(game_round_id)
      //let gamePlayers = await game_players.findAll( {where: { game_round_id }})
      //改变游戏状态
      let runner = new PintuRunner(number)
      let gameRound = await runner.startRound()
      let runningTime = gameRound.duration

      // 这时游戏状态是started
      callback({
        gameRoundState: DpGameRoundStates.starting,
        gameRound: gameRound
      })

      //点击开始游戏，开始倒计时 ，3， 2， 1
      var countTimeId = setInterval(function() {
        // 玩家端，当在倒计时时间内完成，即时上报成绩，或当倒计时时间为1时，结束游戏，上报成绩
        // 2秒时间内: 服务器广播倒计时1-> 玩家收到倒计时1事件 -> 上报成绩 ->服务器收到最后成绩
        if (countTime <= 1) {
          clearInterval(countTimeId);
          // 触发客户端的开始游戏事件
          var runningTimeId = setInterval(function() {
            if (runningTime <= 0) {
              clearInterval(runningTimeId);
              console.log('......socket:broadcast:GameEndEvent')
              runner.endRound().then(() => {
                // 广播游戏结束。并广播成绩
                let payload = {
                  gameRoundState: DpGameRoundStates.completed
                }
                runner.getAllPlayers().then((players) => {
                  players.sort((a, b) => {
                    return a.score - b.score
                  })
                  payload.gamePlayerScores = players
                  namespace.emit('GameEndEvent', payload);
                  socket.emit('GameEndEvent', payload);
                }).catch(function(err) {
                  console.log("GameEndEvent", err)
                })
                return;
              })
            }
            let lastRunningTime = runningTime
            // 广播游戏结束倒计时，触发客户端的倒计时事件
            let payload = {
              timeToEnd: lastRunningTime,
              gameRoundState: DpGameRoundStates.started
            }

            namespace.emit('GameRunningEvent', payload);
            // PC端 返回玩家成绩
            runner.getPlayerScores().then((players) => {
              let cachedPlayers = players
              cachedPlayers.forEach((player) => {
                player.id = player.player_id,
                  player.score = player.score, //parseInt(Math.random()*1000) //
                  player.percent = player.score * 100 / 1500;
              })
              var topPlayers = cachedPlayers.slice(0, 20)
              socket.emit('GameRunningEvent', {
                timeToEnd: lastRunningTime,
                gamePlayerScores: topPlayers
              });
              console.log(`......socket:broadcast->${namespace.name}:startGame${runningTime} - ${cachedPlayers.length}`)
            }).catch(function(err) {
              console.log("GameRunningEvent", err)
            })
            runningTime--;
          }, 1000);
          //namespace.emit('GameStartEvent');
          callback({
            gameRoundState: DpGameRoundStates.completed
          })
          return
        }
        countTime--;
        // 触发客户端的倒计时事件
        let payload = {
          gameRoundState: DpGameRoundStates.starting,
          timeToStart: countTime
        }
        namespace.emit('GameStartingEvent', payload);
        socket.emit('GameStartingEvent', payload);

        console.log(`......socket:broadcast->${namespace.name}:startingGame${countTime}`)
      }, 1000);
    })

    // 重置游戏，清除游戏玩家和成绩，重新开始
    //       remove_players 1,0 是否删除玩家
    socket.on('ResetGameEvent', async (data, callback) => {
      console.log('ResetGameEvent.')
      let number = getGameRoundNumber(socket)
      let runner = new PintuRunner(number)
      let gameRound = await runner.resetRound()
      callback({
        gameRoundState: DpGameRoundStates.created
      })
    });

    // 客户端断开连接事件
    socket.on('disconnect', function(data) {
      console.log(`user disconnect ${socket.id}.`);
    });


  }

}
