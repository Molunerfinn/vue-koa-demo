<template>
  <div id="mainContainer">
    <div class="Panel">
      <div  >
        <div class="bg-nei-top">
        				<img src="/game-yiy-assets/app/images/skin1/tu_03.png" class="bg-nei-top-erwei" style="display:none;">
                <div class="bg-nei-top-right"><span></span><img src="/game-yiy-assets/app/images/skin1/tu_05.png"></div>
        				<div class="bg-nei-top-zhong" ><img src="/game-yiy-assets/app/images/skin1/bgtop.gif"  v-show="computedGameState=='open'||computedGameState=='started'">
                  <p  v-show="computedGameState=='started'"><span>游戏倒计时</span><strong>|</strong><span>剩余<b>${timeToEnd}</b>秒</span></p>
                </div>
        </div>
      </div>
    </div>

    <div class="Panel checkin" style="display: block; opacity: 1; top: 0; padding-top: 185px;bottom:30px">
      <div class="bg-nei-bottom1" v-show="computedGameState=='open'||computedGameState=='started'">
      </div>
      <div class="fullfill  game-state state-created" v-show="computedGameState=='created'">
        <div class="box-title">  <img src="/game-yiy-assets/app/images/skin1/bgtop.gif"> </div>
        <div class="box-body">
          <div>    <img src="/game-yiy-assets/app/images/skin1/yao_02.png">      </div>
          <button class="start btn yao-btn" @click="openGameHandler" >准备开始</button>
        </div>
      </div>

      <div v-show="computedGameState=='ready'">
        <div id="mask">
          <div id="mask_bg"> </div>
          <p id="time_count"> </p>
        </div>
      </div>
      <div class="fullfill state-open qiandao" v-show="computedGameState=='open'">

          <div class="bg-zhunbei">已有<b>${gamePlayers.length}</b>人准备<span>请耐心等待游戏开始</span></div>
          <ul class="canyu">
            <li class="qiaodaosf" v-for="player in gamePlayers">
              <img class="qiaodaotx" v-bind:src="player.avatar">
              <p class="qiaodaoxm">${player.nickname}</p>
            </li>
          </ul>
          <div class="actions">
            <button  class="btn yao-btn" @click="startGameHandler">开始摇一摇</button>
          </div>
       </div>
      <div class="fullfill  game-state  state-starting " v-show="computedGameState=='starting'">
        <div class="box-title">  <img src="/game-yiy-assets/app/images/skin1/bgtop.gif" class="logo"> </div>
        <div class="box-body">
          <p class="szbg">${timeToStart}</p>
        </div>
      </div>

      <div class="fullfill game-state state-started" v-show="computedGameState=='started'">
           <ul class="players">
            <li v-for="(player,i ) in computedTop12Players">
              <span class="bg-nei-yd"><img class="avatar" v-bind:src="player.avatar"></span>
              <div class="progress-wrap clear-fix">
                <div class="progress">
                <div class="progress-bar progress-bar-warning progress-bar-striped active" v-bind:style="{width: player.percent+'%'}">
                  <div v-bind:class="['progress-value','car'+i]" >${player.score}</div>
                </div>
                </div>
              </div>
            <span class="mingzi">${player.nickname}</span>
            </li>
          </ul>

      </div>

      <div class="fullfill game-state  state-completed" v-show="computedGameState=='completed'">
        <div class="box-title">  <img src="/game-yiy-assets/app/images/skin1/pm_03.png" class="logo"> </div>
        <div class="player-rank clearfix">
          <div class="pm-top5">
          <table class="rank  ">
            <tr> <th class="paiming"> 排名</th><th class="xingming">姓名</th><th class="chengji">当前成绩</th></tr>
            <tr  v-for="(player, i) in computedTop5Players"><td class="paiming"><span v-bind:class="'pm'+i"> ${i+1}</span></td>
              <td class="xingming"><img v-bind:src="player.avatar"><span  >${player.nickname}</span></td>
              <td class="chengji"> ${player.score}</td>
            </tr>
          </table>
          </div>
          <div class="pm-top10">
            <table class="rank  ">
              <tr> <th class="paiming"> 排名</th><th class="xingming">姓名</th><th class="chengji">当前成绩</th></tr>
              <tr  v-for="(player, i) in computedTop10Players"><td class="paiming"><span v-bind:class="'pm'+i"> ${i+6}</span></td>
                <td class="xingming"><img v-bind:src="player.avatar"><span  >${player.nickname}</span></td>
                <td class="chengji"> ${player.score}</td>
              </tr>
            </table>
          </div>

        </div>
      </div>

    </div>

    <div class="Panel Bottom"  style=" height:0px;">
      <div class="actions">
        <button class="start btn btn-danger btn-lg" @click="resetGameHandler">重置游戏</button>
      </div>
      <div class="debug"  > ${computedGameState}</div>

    </div>

    <div class="loader"  v-show="loading">
      <div class="icon"></div>
    </div>
  </div>
</template>

<script>

import io from 'socket.io-client';
//const socket = io('http://localhost');


export default {
  name: 'app',
  components: {

  },
  created() {
    var that = this
		that.gameRoundId = DGAME.game_round.id
		that.gameRoundState = DGAME.game_round.state;
		that.socket = io( );
		that.socket.on('connect', () => {
			that.loading = false;
			console.log(that.socket.connected); // true
			that.bindSocketEvents()
		});
		// 游戏已经结束，获取游戏排名
		if( that.gameRoundState == 5){
			that.getFinalScores();
		}
  },
  data() {
    return {
      //socket
      loading: true,
      gameRoundId: 0,
      gameRoundState: null,
      canstart: true, // 游戏是否允许开始，防抖
      QRCodeState: false, // 二维码页面是否显示
      countState: false, // 分数排名页面是否显示
      timeToEnd: 30, // 游戏倒计时
      timeToStart: 3, // 扫描二维码倒计时
      countBg: ['#e81320', '#e813b8', '#8613e8', '#1395e8'],
      socket: null,
      playerCheckTimerId: null,
      gamePlayers:[],
      gamePlayerScores:[] // {id, score} top 20
    }
  },
  computed: {
		leftFormatTime: function(){
			return this.timeToEnd < 10 ? '0' + this.timeToEnd : this.timeToEnd;
		},
		computedGameState(){
			switch (this.gameRoundState) {
				case 0: return 'created';
				case 1: return 'open';
				case 2: return 'ready';
				case 3: return 'starting';
				case 4: return 'started';
				case 5: return 'completed';
				case 6: return 'disabled';
				default: return 'unkonwn'
			}
		},
		computedTop5Players(){
			return this.gamePlayerScores.slice(0,5)
		},
		computedTop10Players(){
			return this.gamePlayerScores.slice(5,10)
		},
		computedTop12Players(){
			return this.gamePlayerScores.slice(0,10)
		},
	},
  methods: {
    //绑定socket事件
		bindSocketEvents: function(){
			var that = this
			console.log('bindSocketEvents...')
			if( that.computedGameState == 'open'){
				that.openGame()
			}
			//绑定 游戏开始倒计时事件，点击开始按钮
			that.socket.on('GameStartingEvent', function(data){
				that.gameRoundState = data.gameRoundState
				that.timeToStart = data.timeToStart
				console.log( 'GameStartingEvent', data)
			});
			//绑定 游戏倒计时事件，游戏时间倒计时
			that.socket.on('GameRunningEvent', function(data){
				that.gameRoundState = 4
				that.timeToEnd = data.timeToEnd
				var newGamePlayerScores = data.gamePlayerScores
				//console.log("newGamePlayerScores=",newGamePlayerScores)
				for( var i=0; i< newGamePlayerScores.length; i++ ){
					var playerScore = newGamePlayerScores[i]
					for( var j=0; j< that.gamePlayers.length; j++ ){
						var player = that.gamePlayers[j]
						if( player.id == playerScore.id){
							//console.log( "player=", player)
							playerScore.nickname = player.nickname
							playerScore.avatar = player.avatar
							break;
						}
					}
				}
				that.gamePlayerScores = newGamePlayerScores
				console.log( 'GameRunningEvent', data )
			});
			that.socket.on('GameEndEvent', function(data){
				that.gameRoundState = data.gameRoundState
				that.gamePlayerScores = data.gamePlayerScores
				console.log( 'GameEndEvent', data)
			});
		},
		// 准备开始，玩家开始注册
		openGameHandler: function(){
			var that = this
			that.socket.emit('OpenGameEvent', {}, function(data){
					that.gameRoundState = data.gameRoundState
					console.log("	OpenGameEvent data",data )
					that.openGame()
			});
		},
		// 开始游戏, 玩家开始摇一摇
		startGameHandler: function(){
			var that = this;
			if( !that.canstart ){
				return;
			}
			that.canstart = false;
			// 游戏倒计时开始
			that.socket.emit('StartGameEvent', {}, function(data){
				console.log( 'StartGameEvent', data)
				that.gameRoundState = data.gameRoundState
			});
			clearInterval(this.playerCheckTimerId)
			//this.timeRunning();
		},

		// 获取游戏排名
		getFinalScores: function(){
			var that = this;
			that.socket.emit('GetGamePlayersEvent', {}, function(data){
				console.log( "GetGamePlayersEvent=", data )
				that.gamePlayers = data.gamePlayers
				that.gamePlayerScores = data.gamePlayers.sort(function(a,b){ return b.score-a.score; })
			});
		},
		// 开放游戏签到，获取签到人员
		openGame: function(){
			var that = this;
			// 如果当前游戏开放签到, 每秒取得游戏签到人员信息
			if( this.computedGameState == 'open'){
				var i =0
				this.playerCheckTimerId = setInterval(function(){
						// 取得游戏用户
						that.socket.emit('GetGamePlayersEvent', {}, function(data){
							console.log( `GetGamePlayersEvent ${++i} `, data)
							that.gamePlayers = data.gamePlayers
						});
				}, 1500);
			}
		},

		// 游戏页面倒计时
		timeRunning: function(){
			var that = setInterval(function(){
				if(that.timeToEnd <= 0){
					clearInterval(timeId);
					// 触发游戏结束事件
					socket.emit('gameOver');
					var finalTimeId = setTimeout(function(){
						socket.removeListener('shakeUserInfo', that.changeCount);
						// 断开与服务器的连接
						//socket.disconnect();
						alert('游戏时间到！');
					}, 2000);
					return;
				}
				that.timeToEnd--;
			}, 1000);
		},

		// 重置游戏
		resetGameHandler: function(){
			var that = this
			console.log("	emit ResetGameEvent" )
			that.socket.emit('ResetGameEvent', {}, function(data){
					that.gameRoundState = data.gameRoundState;
					console.log("	that.gameRoundState =",	that.gameRoundState );
					that.timeToEnd = 3;
					that.canstart = true;
					clearInterval(that.playerCheckTimerId);

			});
		}

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

.dp-pintu {
  font-size: 14px;
}
</style>
