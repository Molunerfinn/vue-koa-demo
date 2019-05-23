<template>
  <div class="main-container indexbg" id="mainContainer">
    <audio id="bgMusic">
      <source src="/game-yiy-assets/app/css/shake.mp3" type="audio/mpeg">
    </audio>
    <div class="msg weui-toptips weui-toptips_visible" v-show="computedToptips"> {{computedToptips}} </div>
		<!-- 分数容器 -->

    <div v-show="computedGameState=='open'||computedGameState=='created'">
      <div class="indexb-half-top">
      			<img src="/game-yiy-assets/app/images/skin1/wx/tu_05.png" class="tu1">
      			<img src="/game-yiy-assets/app/images/skin1/wx/bgtop.gif" class="tu2">
      </div>
      		<div class="indexb-bottom">
      			<img src="/game-yiy-assets/app/images/skin1/wx/yao_01.png">
      		</div>
    </div>
		<div class="gameInfo-container" v-show="computedGameState=='started'">
      <ul class="shake-ani">
      </ul>

      <div class="indexb-half-top">
  			<div class="timeContainer">
  				<img src="/game-yiy-assets/app/images/shakeMP_timeIcon.png" class="time-icon">
  				00:<span v-text="formatTime"></span>
  			</div>
  			<div class="countsContainer" style="display:none;">
  				<span class="pull-left">当前得分</span>
  				<span class="pull-right" v-text="score"></span>
  			</div>
      </div>
      <div class="indexb-bottom">
        <img src="/game-yiy-assets/app/images/skin1/wx/yao_01.png" class="tt">
      </div>
		</div>
		<!-- 开始游戏倒计时遮罩层 -->
		<div class="runningTime-shade" v-show="computedGameState=='starting'">
			<p>游戏开始倒计时</p>
			<p>
				<span v-text="timeToStart" class="runningTime"></span>
				<span>秒</span>
			</p>
			<p>马上进入“摇一摇”</p>
		</div>

    <div class="state-completed" v-show="computedGameState=='completed'">
      <div class="head" style="height:150px;">
        游戏成绩
      </div>
      <div class="touxiang-wrap">
        <img v-bind:src="gamePlayer.avatar">
      </div>
      <div class="paiming-wrap">
        <p class="paiming">
        恭喜您在游戏中获得 <strong>第 {{rank}} 名</strong>
        </p>
      </div>

    </div>
		<!-- 加载遮罩层 -->
		<div class="loading" v-show="loading">
			<p>加载中...</p>
		</div>
    <div class="debug" style="display:none;"> {{computedGameState}}  </div>
	</div>
</template>

<script>

  // import Game from './game/Game.vue'
  import GameRes from './game/GameRes'
  import GameArg from './game/GameArg'
  import HdGame from '@/lib/hdgame'
  import GameState from '@/lib/GameState'
  import {
    // setAchievebycode,
    getGameResult
  } from '@/api/dpgame/pintu.js'
  // import LoadToast from '@/components/LoadToast.vue'
  // import ResultBox from './ResultBox.vue'
  // import RuleBox from './RuleBox.vue'
  // import SignUp from '@/components/SignUp.vue'
  import { GameBackgroundMusicLoadEvent } from '@/lib/GameEvent'
  import queryString from 'query-string'
  import io from 'socket.io-client'
  import constant from '@/game_constant.js'

  const gameUrlBase = process.env.GAME_URL_BASE
  // //import {simplifyLufylegend } from '@/lib/simplify'
  // //关于玩家的配置信息
  const g_config = {
    scoreType: false,
    initTime: 0,
    ipInfo: {
      provice: null,
      city: null
    }
  }
  // const countDownImages = [
  //   require('@/assets/dpgame/pintu/image/c0.png'),
  //   require('@/assets/dpgame/pintu/image/c1.png'),
  //   require('@/assets/dpgame/pintu/image/c2.png'),
  //   require('@/assets/dpgame/pintu/image/c3.png')
  // ]
  const gameType = 1 // 0抽奖， 1刷记录

  function s(){
  	return window.jQuery;
  }

  export default {
    name: 'app',
    data: {
      socket: null,
  		gamePlayer: {},
  		gamePlayerId: 0,
  		gameRoundState: null,
  		loading: false, // 加载层显示状态
  		wx_openid: '', // 微信openid
  		wx_nickname: '', // 微信昵称
  		sendCountTimeId: null,// 发送游戏分数定时器
  		score: 0, // 记录所得分数
  		rank: 0, // 记录当前名次
  		timeToEnd: 30, // 游戏剩余时间，初始为30s
  		timeToStart: 0, // 游戏开始前倒计时
  		gameRoundStateTips:{
  			created: '您好，游戏还没开始，请耐心等待',
  			open: '您好，请耐心等待大屏幕倒计时开始',
  			started: '游戏过程中请注意不要退出页面！',
  			completed: '游戏结束，谢谢参与',
  		},
  		status: {
  				canShake: false,
  				shakeData: null,
  				count: 0,
  				couldJoin: !1,
  				SHAKE_THRESHOLD: 0.8e4,
  				lastUpdate: 0,
  				x: 0,
  				y: 0,
  				z: 0,
  				lastX: 0,
  				lastY: 0,
  				lastZ: 0
  		},
  	},
  	computed: {
  		formatTime: function(){
  			return this.timeToEnd < 10 ? '0' + this.timeToEnd :this.timeToEnd;
  		},
  		computedToptips(){
  			return this.gameRoundStateTips[this.computedGameState]
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
  				default: return 'void'
  			}
  		}
  	},
  	created: function(){
  		var that = this;
      const parsed = queryString.parse(location.search)
      var number = parsed.number

      var params = {
        parsed: parsed
      }

      this.hg.grade = new HdGame.Grade(0)

      this.hg.time = new HdGame.Time(g_config.initTime, { updateFlag: true, isDesc: false })

      GameArg.eventBus.$on(GameBackgroundMusicLoadEvent.name, event => {
        this.initBackgroundMusic()
      })
      //simplifyLufylegend( this.hg, window.g_rem )
      HdGame.initJsHead(this.hg, GameRes)

      this.hg.assets.add(GameRes.skinAssets)

      if (this.debug) {
        window.hg = this.hg
        window.gameArg = GameArg
      }
  		// 监听设备的加速度事件
  		// 检测设备是否支持加速度传感器
  		if(!window.DeviceMotionEvent){
  			alert('您的设备不支持摇一摇功能！');
  			return;
  		}
  		that.socket = io( null, {
  			transports: [ 'websocket' ],
  			query: {
  			game_player_id: window.DGAME.game_player.id
      }});
  		that.socket.on('connect', () => {
  			console.log(that.socket.connected); // true
  		});
  		var socket = that.socket;
      getGameResult(number, params).then(data => {
        this.gameInfo = data
        console.log('gameInfo=======:', this.gameInfo)
        this.gameRound = this.gameInfo['gameRound']
        this.timeToEnd = this.gameRound.duretion
        this.gameRoundState = this.gameRound.state
        this.gamePlayer = this.gameInfo['gamePlayer']
        this.playPath = this.gameRound.playPath

        let wxConfig = this.gameInfo['wxConfig']
        if (wxConfig) {
          HdGame.initWxConfig(wxConfig)

          let wxShareArg = {
            title: this.gameRound.name,
            desc: this.gameRound.desc,
            link: wxConfig.shareUrl,
            imgUrl: gameUrlBase + '/static/game/zhaobaba/skin/image/wx/share.jpg'
          }
          console.log('wxShareArg=====:', wxShareArg)
          HdGame.setWxShare(wxShareArg)
        }

        if (this.gameRoundState == GameState.started && this.gamePlayer.token == undefined) {
          this.gameRoundState = GameState.created
        } else if (
          (this.gameRoundState == GameState.open || this.gameRoundState == GameState.created) &&
          this.gamePlayer.token == undefined &&
          this.gameInfo['gameRound'].contact_required == 1
        ) {
          this.ui.homeVisible = false
          this.ruleBoxCommand = 'hideIcon'
          this.signUpCommand = 'show'
        } else if (
          (this.gameRoundState == GameState.open || this.gameRoundState == GameState.created) &&
          (this.gamePlayer.token !== undefined || this.gameInfo['gameRound'].contact_required == 0)
        ) {
          this.ruleBoxCommand = 'showIcon'
          this.ui.wait = true
          this.ui.homeVisible = true
        } else if (this.gameRoundState == GameState.started) {
          this.ui.homeVisible = false
          this.ui.gameBoxVisible = true
        }
        if (
          this.gameRoundState == GameState.completed ||
          (this.gameInfo['gameResult'] !== null && this.gameInfo['gameResult'] !== undefined)
        ) {
          var r = this.gameInfo['ret']
          if (this.gameInfo['gamePlayer'].score == constant.GameConstant.maxTime) {
            this.gameInfo['gamePlayer'].score = 0
          }
          var arg = {
            isSuc: r.isSuc,
            gameScore: this.gameInfo['gamePlayer'].score,
            minScore: 0, //到多少分可以抽奖
            bestScore: r.score,
            gameType: gameType,
            rank: r.rank,
            beat: r.beat,
            isEqualDraw: false,
            bestCostTime: r.bestCostTime,
            headImg: this.gamePlayer.avatar
          }

          this.resultBoxParams = arg
          this.resultBoxCommand = 'showResult'
          this.resultBoxVisible = true
        }
        document.title = this.gameRound.name
      })
  		// that.gamePlayer = DGAME.game_player
  		// that.gamePlayerId =  DGAME.game_player.id
  		// that.rank = DGAME.game_player.rank
  		// 获取用户信息
  		that.getUserInfo(function(){

  			//GameStartingEvent:游戏开始前的倒计时事件
  			//GameRunningEvent: 游戏运行结束倒计时事件
  			//GameEndEvent:"GameEndEvent"
  			// 游戏开始前的倒计时事件
  			socket.on('GameStartingEvent', function(data){
  				console.log('io:GameStartingEvent')
  				that.timeToStart = data.timeToStart
  				that.gameRoundState = data.gameRoundState
  				// 倒计时0，即游戏开始
  				if( that.timeToStart == 1 ){
  					that.startGame()
  				}
  			});
  			// 游戏运行结束倒计时事件,
  			socket.on('GameRunningEvent', function(data){
  				console.log('io:GameRunningEvent')
  				that.timeToEnd = data.timeToEnd
  				that.gameRoundState = data.gameRoundState
  				if( that.timeToEnd == 1 ){
  					console.log("timeToEnd= ", that.timeToEnd)
  					// 结束游戏并上传最后成绩到服务器
  					that.endGame()
  				}
  			});
  			// 监听游戏结束事件
  			socket.on('GameEndEvent', function(data){
  				console.log('io:GameEndEvent', data)
  				that.gameRoundState = data.gameRoundState
  				var gamePlayerScores = data.gamePlayerScores.sort()
  				for(var i=0; i< gamePlayerScores.length; i++){
  					var player = gamePlayerScores[i];
  					if( player.id == that.gamePlayerId){
  						that.score = player.score;
  						that.rank = player.rank;
  						break;
  					}
  				}
  				//socket.disconnect();
  				console.log('游戏时间到！');
  			});
  			// 正在游戏，但是不小心退出了
  			if( that.gameRoundState == 4){
  				that.startGame()
  			}
  		});
  	},
  	methods: {
  		handlePlayMusic: function() {
  			try{
  				document.querySelector("#bgMusic").play();
  				window.wx.config({
  						debug: false,
  						appId: window.DGAME.wx_config.appId||'',
  						timestamp:  window.DGAME.wx_config.timestamp||'',
  						nonceStr: window.DGAME.wx_config.nonceStr||'',
  						signature: window.DGAME.wx_config.signature||'',
  						jsApiList: []
  				});
  				window.wx.ready(function() {
  						document.querySelector("#bgMusic").play()
  				});
  			}catch(err){
  				alert(err)
  			}
  		},
  		// 获取用户信息
  		getUserInfo: function(callback){
  			var that = this;
  			// 显示加载层
  			this.loading = true;
        if( window.DGAME.game_player ){
            // var userInfo = window.DGAME.game_player
            that.loading = false;
            that.wx_nickname = window.DGAME.game_player.nickname;
            that.wx_openid = window.DGAME.game_player.openid;
            that.gameRoundState = window.DGAME.game_round.state;
            callback();
  			}else{
          alert('获取用户信息失败：');
  			}
  		},
  		// 处理摇一摇事件
  		handleMotion: function(e){
  			//var t = e.acceleration;
  			var t = e.accelerationIncludingGravity;
  			var n = (new Date).getTime();
  			if (n - this.status.lastUpdate > 10) {
  					var i = n - this.status.lastUpdate;
  					this.status.lastUpdate = n,
  					this.status.x = t.x,
  					this.status.y = t.y,
  					this.status.z = t.z;
  					var o = Math.abs(this.status.x + this.status.y + this.status.z - this.status.lastX - this.status.lastY - this.status.lastZ) / i * 1e4;
  					//o > this.status.SHAKE_THRESHOLD && (this.status.count++, this.status.canShake && (this.status.canShake = !1, this.handleShaking())),
  					if( o > this.status.SHAKE_THRESHOLD ){
              this.score++;
              if( this.status.canShake){
                this.status.canShake = false, this.handleShaking();
              }
            }

  					this.status.lastX = this.status.x,
  					this.status.lastY = this.status.y,
  					this.status.lastZ = this.status.z
  			}
  		},
  		// 开始游戏
  		startGame: function(){
  			var that = this;
  			this.status.canShake = true;
  			// 添加事件监听器
  			window.addEventListener("devicemotion", that.handleMotion, true);
  			// 将分数实时发送给服务端
  			that.sendCount();

  		},
  		// 将分数实时发送给服务端，并设置定时发送
  		sendCount: function(){
  			var that = this;
  			that.sendCountTimeId = setInterval(function(){
  				var query = {
  					game_player_id: that.gamePlayerId,
  					score: that.score
  				};
  				console.log(`ShakeEvent:score={that.score}`)
  				that.socket.emit('ShakeEvent', query);
  			}, 1000);
  		},
  		//结束游戏
  		endGame:function(){
  			var that = this;
  			clearInterval(that.sendCountTimeId);
  			window.removeEventListener("devicemotion", that.handleMotion, true);
  			// 将最后一次的分数发送给服务端
  			var query = {
  				game_player_id: that.gamePlayerId,
  				score: that.score
  			};
  			that.socket.emit('ShakeEvent', query);
  		},


  		handleShaking: function() {
  				var e = this;
  				s()(".shark-img").addClass("shake-animate"),
  				e.handlePlayMusic(),
  				setTimeout(function() {
  						s()(".shark-img").removeClass("shake-animate"),
  						e.status.canShake = true
  				},
  				1e3),
  				document.querySelectorAll(".shake-ani li").length < 15 && e.downAnimate()
  		},
  		downAnimate: function() {
  				for (var e = this, t = 0; t < 5; t++) {
  						var n = Math.random() * s()(window).width(),
  						i = parseInt(3 * Math.random() + 1),
  						o = s()('<li class="shake-ani-' + i + '" style="left: ' + n + 'px"></li>');
  						s()(".shake-ani").append(o),
  						e.removeDom(o)
  				}
  		},
  		removeDom: function(e) {
  				e.animate({
  						top: "100%"
  				},
  				1e3 * Math.random() + 2e3,
  				function() {
  						s()(this).remove()
  				})
  		},
  	}
  }

</script>

<style>

  #app {
    color: #2c3e50;
    height: 100%;
    width: 100%;
  }
  #headImg {
    border-radius: 100%;
    width: 20%;
    height: auto;
  }

  .home {
    overflow: hidden;
  }
  .gamestate .msg {
    position: absolute;
    top: 60vh;
    left: 0;
    right: 0;
    color: #fff;
    text-align: center;
  }
  .gamestate .countdownimg{
    position: absolute;
    top: 50vh;
    left: 50vw;
    width: 20vw;
    height: 20vw;
    margin-left: -10vw;
    margin-top: -10vw;
    color: #fff;
  }
  .debug-msg{
    z-index: 99999;
    background-color: red;
    position: absolute;
    bottom: 0;
    left: 0;
    color: #fff;
    padding: 5px;
  }
</style>
