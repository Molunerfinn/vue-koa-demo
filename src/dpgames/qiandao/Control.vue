<template>
  <div id="app" :class="skin">
    <div class="Panel">
      <div  >
        <div class="bg-nei-top">
          <div class="bg-nei-top-erwei">
                <img src="" id="share-qrcode-img" >
              </div>
                <img src="~@/assets/dpgame/yiy/images/skin1/tu_03.png" class="bg-nei-top-erwei" style="display:none;">
                <div class="bg-nei-top-right"><span></span><img src="~@/assets/dpgame/yiy/images/skin1/tu_05.png"></div>
                <div class="bg-nei-top-zhong" ><img src="~@/assets/dpgame/yiy/images/skin1/bgtop.gif"  v-show="computedGameState=='open'||computedGameState=='started'">
                  <p  v-show="computedGameState=='started'"><span>游戏倒计时</span><strong>|</strong><span>剩余<b>{{timeToEnd}}</b>秒</span></p>
                </div>
        </div>
      </div>
    </div>

    <div class="Panel checkin" style="display: block; opacity: 1; top: 0; padding-top: 185px;bottom:30px">
      <div class="bg-nei-bottom1" v-show="computedGameState=='open'||computedGameState=='started'">
      </div>
      <div class="fullfill  game-state state-created" v-show="computedGameState=='created'">
        <div class="box-title">  <img src="~@/assets/dpgame/yiy/images/skin1/bgtop.gif"> </div>
        <div class="box-body">
          <div>    <img src="~@/assets/dpgame/yiy/images/skin1/yao_02.png">      </div>
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

          <div class="bg-zhunbei">已有<b>{{gamePlayers.length}}</b>人准备<span>请耐心等待游戏开始</span></div>
          <ul class="canyu">
            <li class="qiaodaosf" v-for="player in gamePlayers">
              <img class="qiaodaotx" v-bind:src="player.avatar">
              <p class="qiaodaoxm">{{player.nickname}}</p>
            </li>
          </ul>
          <div class="actions">
            <button  class="btn yao-btn" @click="startGameHandler">开始摇一摇</button>
          </div>
       </div>
      <div class="fullfill  game-state  state-starting " v-show="computedGameState=='starting'">
        <div class="box-title">  <img src="~@/assets/dpgame/yiy/images/skin1/bgtop.gif" class="logo"> </div>
        <div class="box-body">
          <p class="szbg">{{timeToStart}}</p>
        </div>
      </div>

      <div class="fullfill game-state state-started" v-show="computedGameState=='started'">
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

      <div class="fullfill game-state  state-completed" v-show="computedGameState=='completed'">
        <div class="box-title">  <img src="~@/assets/dpgame/yiy/images/skin1/pm_03.png" class="logo"> </div>
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

    <div class="Panel Bottom" >
      <div class="actions">
        <button class="start btn btn-danger btn-lg" @click="resetGameHandler">重置游戏</button>
      </div>
      <div class="debug"  v-show="debug" > {{computedGameState}}</div>
    </div>

    <div class="loader"  v-show="loading">
      <div class="icon"></div>
    </div>

    <div id="show_hide_nav">
      <img src="~@/assets/common/image/wall/opened.png" class="opened_image">
      <img src="~@/assets/common/image/wall/closed.png" class="closed_image hide">
    </div>

  </div>
</template>

<script>
// 游戏流程
// PC端（控制端）
// 准备开始-> 玩家签到 -> 点击开始游戏 ->(开始前倒计时)->游戏进行中-> 游戏结束 ->显示排名
import io from 'socket.io-client'
import queryString from 'query-string'
import { getGameInfoForDp } from '@/api/dpgame/qiandao'
import GameState from '@/lib/GameState'
import QRCode from 'qrcode'
import $ from 'jquery'
// import QRCode from 'qrcode'
// import $ from 'jquery'
// import constant from '@/game_constant.js'

import '@/assets/dpgame/pintu/css/skin_control.css'

const skin = 'default'

// const countDownImages = [
//   require('@/assets/dpgame/pintu/image/c0.png'),
//   require('@/assets/dpgame/pintu/image/c1.png'),
//         require('@/assets/dpgame/pintu/image/c2.png'),
//         require('@/assets/dpgame/pintu/image/c3.png'),
//       ]
export default {
  name: 'control',
  data() {
    return{
      shareUrl:'',
      skin: ['base', skin],
      debug: true,
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
	created(){
    var that = this
    const parsed = queryString.parse(location.search);
    if( parsed.number != null ){
      getGameInfoForDp( parsed.number ).then((res)=>{
        console.log('res=====:',res);
        let socketPath = process.env.SOCKETIO_PATH
        that.gameRoundId = res['round'].id
        that.socketNameSpace = "/channel-dpqiandao-"+ res['round'].number
        that.gameRoundState = res['round'].state
        that.shareUrl = res['shareUrl']
        that.socket = io( that.socketNameSpace , { transports: [ 'websocket' ], path: socketPath })
        that.socket.on('connect', () => {
          that.loading = false;
          that.bindSocketEvents()
        });
        // 游戏已经结束，获取游戏排名
        if( that.gameRoundState == GameState.completed){
          that.getFinalScores();
        }
        this.loading = false
        this.creatQRCodeImg()
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
      console.log('this.gameRoundState==:',this.gameRoundState);
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
			return this.gamePlayerScores.slice(0,10)
		},
	},
	methods: {
    creatQRCodeImg: function() { //生成二维码
      console.log('this.shareUrl===:',this.shareUrl);
      QRCode.toDataURL(this.shareUrl,{type:'image/png'}, function(error, gameurl){
        if (error) {
          console.error(error);
        }
          console.log('toDataURL success!');
          $('#share-qrcode-img').attr('src', gameurl);
          $('#shareimg').attr('src', gameurl);
      })
    },
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
				that.gameRoundState = 'started'
				that.timeToEnd = data.timeToEnd
				var newGamePlayerScores = data.gamePlayerScores
				// console.log("newGamePlayerScores=",newGamePlayerScores)
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
        console.log('data====:',data);
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
							console.log( `GetGamePlayersEvent  `,++i, data)
							that.gamePlayers = data.gamePlayers
						});
				}, 1500);
			}
		},

		// 重置游戏
		resetGameHandler: function(){
			var that = this
			console.log("	emit ResetGameEvent" )
      that.timeToStart = 3
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

.bg-nei-top-erwei{
  padding: 15px;
}
#share-qrcode-img{
   width: 100%;
}
.shareimg-wrap{
  position: absolute;
  top:0;
  bottom: 3em;
  left:0;
  right: 0;
  font-size: 25px;
  padding: 20px;
}
.shareimg-wrap img{
  height: 100%;
}
.shareimg-txt{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3em;
  font-size: 25px;
  color: #FFF;
}
.gameimg-wrap{
  position: absolute;
  top:0;
  bottom: 3em;
  left:0;
  right: 0;
  font-size: 25px;
  background-image: url('~@/assets/dpgame/pintu/skin-runlin/image/bgtop.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.gameimg-wrap img{
  width: 100%;
}
.state-created .box-body2 {
   position: absolute;
   text-align: center;
   top: 24vh;
   bottom: 24vh;
   left: 15vw;
   right: 15vw;
   /* margin: 80px auto; */
}


.state-created .box-body-background {
  position: absolute;
  text-align: center;
  top:24vh;
  bottom:24vh;
  left:15vw;
  right:15vw;
  background: #000;
  filter:alpha(opacity=50); /*支持 IE 浏览器*/
  opacity:0.50; /*支持 Chrome, Opera, Safari 等浏览器*/
  /*margin: 80px auto;*/
}
.actions{
  text-align: center;
}
.dppintu {
  font-size: 14px;
}


.countdown-img{
  position: absolute;
  top: 50%;
  left: 50%;

  width: 12vh;
  height: 12vh;
  margin-left: -6vh;
}
.timetoend{
  position: absolute;
  bottom: 0;
  text-align: center;
  color: #fff;
  text-align: center;
  width: 100%;
}
.game-wrap{
  position: absolute;
  top: 30vh;
  bottom: 20vh;
  left: 0;
  right: 0;
}
</style>
