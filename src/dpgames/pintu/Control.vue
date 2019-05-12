<template>
  <div id="app" :class="skin">
    <div class="Panel Top">
      <div  >
        <div class="bg-nei-top">
        				<img src="~@/assets/dp-pintu/image/skin1/tu_03.png" class="bg-nei-top-erwei" style="display:none;">
                <div class="bg-nei-top-right"><span></span><img src="~@/assets/dp-pintu/image/skin1/tu_05.png"></div>
        				<div class="bg-nei-top-zhong" ><img src="~@/assets/dp-pintu/image/skin1/wx/bgtop.gif"  v-show="computedGameState=='open'||computedGameState=='started'">
                  <!-- <p  v-show="computedGameState=='started'"><span>游戏倒计时</span><strong>|</strong><span>剩余<b>{{timeToEnd}</b>秒</span></p> -->
                </div>
        </div>
      </div>
    </div>

    <div class="Panel checkin" style="display: block; opacity: 1; top: 0; padding-top: 185px;bottom:30px">
      <div class="bg-nei-bottom1" v-show="computedGameState=='open'||computedGameState=='started'">
      </div>
      <div class="fullfill  game-state state-created" v-show="computedGameState=='created'">
        <div class="box-title">  <img src="~@/assets/dp-pintu/image/skin1/wx/bgtop.gif"> </div>
        <div class="box-body">
          <div>    <img src="~@/assets/dp-pintu/image/skin1/yao_02.png">      </div>
          <button class="start btn yao-btn btn-primary" @click="openGameHandler" >准备开始</button>
        </div>
      </div>

      <div v-show="computedGameState=='ready'">
        <div id="mask">
          <div id="mask_bg"> </div>
          <p id="time_count"> </p>
        </div>
      </div>
      <div class="fullfill state-open qiandao" v-show="computedGameState=='open'">
        <!-- <p style="font-size:30px;">剩余{{timeToEnd}}秒</p> -->
          <div class="bg-zhunbei">已有<b>{{gamePlayers.length}}</b>人准备<span>请耐心等待游戏开始</span></div>
          <ul class="canyu">
            <li class="qiaodaosf" v-for="player in gamePlayers">
              <img class="qiaodaotx" v-bind:src="player.avatar">
              <p class="qiaodaoxm">{{player.nickname}}</p>
            </li>
          </ul>
          <div class="actions">
            <button  class="btn btn-primary" @click="handleStartGame" >开始游戏</button>
          </div>
       </div>
      <div class="fullfill game-state state-starting " v-show="computedGameState=='starting'">
        <div class="box-title">  <img src="~@/assets/dp-pintu/image/skin1/wx/bgtop.gif" class="logo"> </div>
        <div class="box-body">
          <p class="szbg">{{timeToStart}}</p>
        </div>
      </div>

      <div class="fullfill game-state state-started" v-show="computedGameState=='started'">
        <p style="font-size:30px;">剩余{{timeToEnd}}秒</p>
           <ul class="players">
            <li v-for="(player,i ) in computedTop12Players">
              <span class="bg-nei-yd"><img class="avatar" v-bind:src="player.avatar"></span>
              <div class="progress-wrap clear-fix">
                <div class="progress">
                <div class="progress-bar progress-bar-warning progress-bar-striped active" v-bind:style="{width: player.percent+'%'}">
                  <div v-bind:class="['progress-value','car'+i]" >{{player.score}}</div>
                </div>
                </div>
              </div>
            <span class="mingzi">{{player.nickname}}</span>
            </li>
          </ul>

      </div>

      <div class="fullfill game-state state-completed" v-show="computedGameState=='completed'">
        <div class="box-title">  <img src="~@/assets/dp-pintu/image/skin1/pm_03.png" class="logo"> </div>
        <div class="player-rank clearfix">
          <div class="pm-top5">
          <table class="rank  ">
            <tr> <th class="paiming"> 排名</th><th class="xingming">姓名</th><th class="chengji">当前成绩</th></tr>
            <tr  v-for="(player, i) in computedTop5Players"><td class="paiming"><span v-bind:class="'pm'+i"> {{i+1}}</span></td>
              <td class="xingming"><img v-bind:src="player.avatar"><span  >{{player.nickname}}</span></td>
              <td class="chengji"> {{player.score}}</td>
            </tr>
          </table>
          </div>
          <div class="pm-top10">
            <table class="rank  ">
              <tr> <th class="paiming"> 排名</th><th class="xingming">姓名</th><th class="chengji">当前成绩</th></tr>
              <tr  v-for="(player, i) in computedTop10Players"><td class="paiming"><span v-bind:class="'pm'+i"> {{i+6}}</span></td>
                <td class="xingming"><img v-bind:src="player.avatar"><span  >{{player.nickname}}</span></td>
                <td class="chengji"> {{player.score}}</td>
              </tr>
            </table>
          </div>

        </div>
      </div>

    </div>

    <div class="Panel Bottom"  style="">
      <div class="actions">
        <button class="start btn btn-danger btn-lg" @click="resetGameHandler">重置游戏</button>
      </div>
      <div class="debug"  v-show="debug" > {{computedGameState}}</div>

    </div>

    <div class="loader"  v-show="loading">
      <div class="icon"></div>
    </div>

    <div class="error"  v-show="error">
      <div class=""> {{errorMsg}}</div>
    </div>
  </div>
</template>

<script>
// 游戏流程
// PC端（控制端）
// 准备开始-> 玩家签到 -> 点击开始游戏 ->(开始前倒计时)->游戏进行中-> 游戏结束 ->显示排名
import io from 'socket.io-client'
import queryString from 'query-string'
import { getGameInfoByNumber } from '@/api/dpgame/pintu'
import 'bootstrap/dist/css/bootstrap.css'
import '@/assets/dpgame/pintu/css/skin/runlin.css'
import GameState from '@/lib/GameState'

import '@/assets/dp-pintu/css/bootstrap.min.css'
import '@/assets/dp-pintu/css/basic.css'
import '@/assets/dp-pintu/css/game-yiy.css'

const skin = 'runlin'

export default {
  name: 'control',
  components: {
  },
  data() {
    return {
      //socket
      MAX_TIME: 9999.99,
      s: 30,
      debug: true,
      error: false,
      errorMsg: null,
      loading: true,
      skin: ['base', skin],
      socketNamespace: null, // socketio namespace
      gameRoundNumber: null,
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
  created() {
    var that = this
    const parsed = queryString.parse(location.search);
    if( parsed.number != null ){
      getGameInfoByNumber( parsed.number ).then((res)=>{
        that.socketNameSpace = "/channel-dppintu-"+ res.number
        that.gameRoundState = res.state
        that.socket = io( that.socketNameSpace , { transports: [ 'websocket' ] })
        console.log( "that.socketNameSpace = ", that.socketNameSpace, that.socket)
        that.socket.on('connect', () => {
          that.loading = false;
          console.log("socket.connect=",that.socket.connected); // true
          that.bindSocketEvents()
        });
        // 游戏已经结束，获取游戏排名
        if( that.gameRoundState == GameState.completed){
          that.getFinalScores();
        }
        this.loading = false
      })
    }else{
      this.loading = false
      this.error = true
      this.errorMsg = "游戏不存在！"
    }


  },
  computed: {
		leftFormatTime: function(){
			return this.timeToEnd < 10 ? '0' + this.timeToEnd : this.timeToEnd;
		},
		computedGameState(){
			switch (this.gameRoundState) {
				case 'created': return 'created';
				case 'open': return 'open';
				case 'ready': return 'ready';
				case 'starting': return 'starting';
				case 'started': return 'started';
				case 'completed': return 'completed';
				case 'disabled': return 'disabled';
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
			return this.gamePlayerScores.slice(0,12)
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
        console.log('===========gameRoundState============:',that.gameRoundState)
				that.gameRoundState = data.gameRoundState
				that.timeToStart = data.timeToStart
				console.log( 'GameStartingEvent', data)
			});
			//绑定 游戏倒计时事件，游戏时间倒计时
			that.socket.on('GameRunningEvent', function(data){
				that.gameRoundState = GameState.started
				that.timeToEnd = data.timeToEnd
				var newGamePlayerScores = data.gamePlayerScores
				console.log("newGamePlayerScores=",newGamePlayerScores)
        if(newGamePlayerScores!==null&&newGamePlayerScores!==undefined){
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
            for(var k=0; k< that.gamePlayerScores.length; k++){
              if(that.gamePlayerScores[k].score == that.MAX_TIME){
                that.gamePlayerScores[k].score = 0
              }
            }
        }
				console.log( 'GameRunningEvent', data )
			});
			that.socket.on('GameEndEvent', function(data){
        console.log('data.gameRoundState----:',data.gameRoundState);
				that.gameRoundState = data.gameRoundState
        that.gamePlayerScores = data.gamePlayerScores
        for(var i=0; i< that.gamePlayerScores.length; i++){
          if(that.gamePlayerScores[i].score == that.MAX_TIME){
            that.gamePlayerScores[i].score = 0
          }
        }
				console.log( 'GameEndEvent', data)
			});
		},
		// 准备开始，玩家开始注册
		openGameHandler: function(){
      console.log( 'openGameHandler')
			var that = this
			that.socket.emit('OpenGameEvent', {}, function(data){
					that.gameRoundState = data.gameRoundState
					console.log("	OpenGameEvent data",data )
					that.openGame()
			});
		},
		// 开始游戏, 玩家开始摇一摇
		handleStartGame: function(){
			var that = this;
			if( !that.canstart ){
				return;
			}
			that.canstart = false;
			// 游戏倒计时开始
			that.socket.emit('StartGameEvent', {}, function(data){
        console.log("	that.gameRoundState =",	that.gameRoundState );
				console.log( 'StartGameEvent', data)
				that.gameRoundState = data.gameRoundState
			});
			clearInterval(this.playerCheckTimerId)
		},

		// 获取游戏排名
		getFinalScores: function(){
      console.log('getFinalScores-------:');
			var that = this;
			that.socket.emit('GetGamePlayersEvent', {}, function(data){
        that.gameRoundState = data.gameRoundState;
        console.log("	that.gameRoundState =",	that.gameRoundState );
				console.log( "GetGamePlayersEvent=", data )
				that.gamePlayers = data.gamePlayers
        console.log('that.gamePlayers----:',that.gamePlayers);
				that.gamePlayerScores = that.gamePlayers.sort(function(a,b){ return a.score-b.score; })
        console.log('gamePlayerScores-----:',that.gamePlayerScores);
			});
		},
		// 开放游戏签到，获取签到人员
		openGame: function(){
			var that = this;
			// 如果当前游戏开放签到, 每秒取得游戏签到人员信息
			if( this.computedGameState == 'open'){
				this.playerCheckTimerId = setInterval(function(){
						// 取得游戏用户
						that.socket.emit('GetGamePlayersEvent', {}, function(data){
							that.gamePlayers = data.gamePlayers
						});
				}, 1500);
			}
		},
		// 重置游戏
		resetGameHandler: function(){
			var that = this
			console.log("	emit ResetGameEvent" )
			that.socket.emit('ResetGameEvent', {}, function(data){
        console.log('data--:',data)
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
.base{

}

.dp-pintu {
  font-size: 14px;
}
</style>
