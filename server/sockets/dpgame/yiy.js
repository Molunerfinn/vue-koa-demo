// 绑定摇一摇游戏的websocket事件
// 用户： 控制台，玩家
// userInfo存储用户所得分数
// 数据格式：
// {
// 	game_player_id: game_player_id,
// 	score:score 分数
// }
// 每次移动端用户触发的ShakeEvent事件，服务端都会排列数组
// 并将最新的结果给PC端发送过去。
// 而其实移动端触发的ShakeEvent事件本质是改变自己在userInfo中的分数，
// 并不需要服务端对userInfo数组进行重新排列并发送给PC端。而且PC端频繁的刷新
// 排行榜也会造成性能的极大损失，并且页面刷新也会出现卡顿的现象。
// 因此采取一个折中的方法：
// ShakeEvent事件的监听只会更新（或者是初始化）该用户在userInfo中的分数；
// 服务端每隔一秒排列数组，并将最新的排名结果发送给PC端
// 游戏流程
// PC端（控制端）
// 准备开始-> 玩家签到 -> 点击开始游戏 ->(开始前倒计时)->游戏进行中-> 游戏结束 ->显示排名
// 手机端（玩家）
const logger = require('koa-log4').getLogger('index')
const { game_rounds, game_players } = require('../../app-db/DBMODAL')
const YiyRunner = require('./game-yiy-runner')
const { GameRoundStates } = require('../../app-db/constant')
const dbOperation = require('../../app-db/dbOperation')

const YiySocketEvent={
  OpenGameEvent: "OpenGameEvent",
  GetGamePlayersEvent:"GetGamePlayersEvent",
 	StartGameEvent: "StartGameEvent",
  ResetGameEvent:"ResetGameEvent",
	GameStartingEvent:"GameStartingEvent",  // data: countTime
	GameRunningEvent:"GameRunningEvent",
	GameEndEvent:"GameEndEvent",
  ShakeEvent:"ShakeEvent" // 摇一摇成绩事件
}
// 游戏状态
//    created	   0 created	新建
//		open	     1 open	开始签到
//		ready	     2 ready	结束签到，准备开始
//		starting	 3 starting	开始前倒计时中
//		started	   4 started	游戏已开始
//		completed	 5 completed	游戏已结束
//		disabled	 6 disabled	游戏已关闭

class YiySocket{
	// bind on connection
	static async bind(io) {
    let i = 0;
    io.on('connection', ( socket ) =>{
      console.log(`connection...${i++} `, socket.id)
      //console.log( " socket.request= ", socket.request)
      //http://127.0.0.1/game-yiy/14/play-wx
      const url = socket.request.headers.referer;
      //logger.error('socket.request.headers.referer', url)

      let splited = url.split('/')
      let game_round_id = splited[splited.length-2]
      let room = `game_round${game_round_id}`
      socket.join(room)
      try{
        //如果是微信端连接
        let game_player_id = socket.handshake.query.game_player_id
        if( game_player_id ){
          console.log( `wxclient..${game_player_id}` )
        }
        YiySocket.bindPlay(socket);
        console.log( "YiySocket.bindPlay ")
    		YiySocket.bindPlayWx(socket);
        console.log( "YiySocket.bindPlayWx ")
      }catch(err){
        console.log( err )
      }
    })
	}

	// 绑定大屏游戏页面触发的事件
	static async bindPlay(socket) {
    // 游戏开始签到事件
    socket.on('OpenGameEvent', async (data, callback) =>{
      let gameroundid = YiySocket.getGameRoundId( socket )
      let runner =  new YiyRunner(gameroundid)
      let game_round = await runner.openRound()
      callback({ gameRoundState: game_round.state })
    });

    // 取得签到用户事件, 当游戏结束后，重新加载页面，也会调用这个事件，列出成绩
    socket.on('GetGamePlayersEvent', async ( data, callback ) => {
      console.log("GetGamePlayersEvent:", socket.id )
      //console.log("GetGamePlayersEvent rooms=",socket.rooms);
      let gameroundid = YiySocket.getGameRoundId( socket )
      let runner =  new YiyRunner(gameroundid)
      let gamePlayers = await runner.GetRoundAllPlayers()
      callback({ gamePlayers })
    });

    // 游戏开始玩事件
    socket.on('StartGameEvent', async ( data, callback) =>{
      console.log("StartGameEvent:", socket.client.id)
      console.log("StartGameEvent rooms=",socket.rooms);

      let countTime = 3
      let runningTime = 30
      let game_round_id = YiySocket.getGameRoundId( socket )
      let room = `game_round${game_round_id}`

      //let game_round = await MemoryDbOperation.GetRoundById(game_round_id)
      //let gamePlayers = await game_players.findAll( {where: { game_round_id }})
      //改变游戏状态
      let runner =  new YiyRunner(game_round_id)
      let game_round = await runner.startRound()

      // 这时游戏状态是started
    callback({ gameRoundState: GameRoundStates.starting, gameRound: game_round })
      console.log(`StartGameEvent:rooms=${room}`, socket.rooms);

      //点击开始游戏，开始倒计时 ，3， 2， 1
      var countTimeId = setInterval(function(){
          // 玩家端，当倒计时事件，时间为1时，结束游戏，上报成绩
          // 2秒时间内: 服务器广播倒计时1-> 玩家收到倒计时1事件 -> 上报成绩 ->服务器收到最后成绩
          if(countTime <= 1){
              clearInterval(countTimeId);
              // 触发客户端的开始游戏事件
              var runningTimeId = setInterval( function(){
                  if(runningTime <= 0){
                      clearInterval(runningTimeId);
                      console.log('......socket:broadcast:GameEndEvent')
                      runner.endRound().then(()=>{
                        // 广播游戏结束。并广播成绩
                        let payload =  { gameRoundState: GameRoundStates.completed }
                        runner.GetRoundAllPlayers().then((players)=>{
                          players.sort((a,b)=>{
                            return b.score - a.score
                          })
                          payload.gamePlayerScores = players
                          socket.broadcast.to(room).emit('GameEndEvent', payload);
                          socket.emit('GameEndEvent', payload);
                        }).catch(function(err){
                          console.log("GameEndEvent",err)
                        })
                        return;
                      })
                  }
                  let lastRunningTime = runningTime
                  // 广播游戏结束倒计时，触发客户端的倒计时事件
                  let payload =  { timeToEnd: lastRunningTime, gameRoundState: GameRoundStates.started }
                  socket.broadcast.to(room).emit('GameRunningEvent', payload);
                  // PC端 返回玩家成绩
                  runner.GetPlayerScores().then((players)=>{
                    let cachedPlayers = players
                    cachedPlayers.forEach((player)=>{
                      player.id = player.player_id,
                      player.score = player.score, //parseInt(Math.random()*1000) //
                      player.percent = player.score*100/1500;
                    })
                    var topPlayers = cachedPlayers.slice(0,20)
                    socket.emit('GameRunningEvent', { timeToEnd: lastRunningTime, gamePlayerScores: topPlayers });
                    console.log(`......socket:broadcast->${room}:startGame${runningTime} - ${cachedPlayers.length}` )
                  }).catch(function(err){
                    console.log("GameRunningEvent",err)
                  })
                  runningTime--;
              }, 1000);
              //socket.broadcast.to(room).emit('GameStartEvent');
              return
          }
          countTime--;
          // 触发客户端的倒计时事件
          let payload = {gameRoundState: GameRoundStates.starting , timeToStart: countTime}
          socket.broadcast.to(room).emit('GameStartingEvent', payload);
          socket.emit('GameStartingEvent', payload);
          console.log(`......socket:broadcast->${room}:startingGame${countTime}`)
      }, 1000);
    })

    // 重置游戏，清除游戏玩家和成绩，重新开始
    //       remove_players 1,0 是否删除玩家
    socket.on('ResetGameEvent', async (data, callback) =>{
       console.log('ResetGameEvent.')
       let game_round_id = YiySocket.getGameRoundId( socket )
       await game_rounds.update({state: GameRoundStates.created},{ where:{ id: game_round_id}})
       await dbOperation.MemoryDbOperation.DeleteRound(game_round_id )
       if( false ){
         let count = await game_players.destroy({ where:{ game_round_id: game_round.id}})
       }
       const game_round = await game_rounds.findById(game_round_id)
       callback({ gameRoundState: game_round.state })
    });

    socket.on('disconnect', function(data){
      console.log(`user disconnect ${socket.id}.`);
    });


	}


	static async bindPlayWx(socket) {
    // 监听客户端“摇一摇”事件
    // 参数 game_player_id, count
    socket.on('ShakeEvent', function(socket){
      let game_player_id = data.game_player_id
      let score = data.score
      let game_round_id = YiySocket.getGameRoundId( ctx )
      let runner =  new YiyRunner(game_round_id)

      runner.updatePlayerScore(game_player_id, score ).then((result)=>{
        console.log(' updatePlayerScore return ',result )
      })
      console.log(`ShakeEvent:game_player_id= ${game_player_id} score =${score}`)
      //callback({ })
    });
	}

  // 取得当前游戏ID
	static getGameRoundId( socket ){

		const url = socket.request.headers.referer;
		let splited = url.split('/')
		let game_round_id = splited[splited.length-2]
		let room = `game_round${game_round_id}`
		return parseInt(game_round_id)
	}
}

module.exports = YiySocket;
