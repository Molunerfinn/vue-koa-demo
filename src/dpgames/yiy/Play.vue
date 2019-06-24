<template>
  <div class="main-container indexbg" id="mainContainer">
    <div v-show="ui.wait">
      <div class="gamestate" v-show="gameRoundState=='open'">
        <p class="msg">请关注大屏幕,等待游戏开始 </p>
      </div>

      <div class="gamestate" v-show="gameRoundState=='created' ">
        <p class="msg">请耐心等待游戏开始 </p>
      </div>

      <!-- <div  class="gamestate" v-show="gameRoundState=='starting'">
        <img class="countdownimg" :src='countdownImg'>
      </div> -->
    </div>
    <!-- <audio id="bgMusic">
      <source src="~@/assets/dpgame/yiy/shake.mp3" type="audio/mpeg">
    </audio> -->
    <div class="msg weui-toptips weui-toptips_visible" v-show="computedToptips"> {{computedToptips}} </div>
		<!-- 分数容器 -->

    <div v-show="ui.wait">
      <div class="indexb-half-top">
      			<img src="~@/assets/dpgame/yiy/images/skin1/wx/tu_05.png" class="tu1">
      			<img src="~@/assets/dpgame/yiy/images/skin1/wx/bgtop.gif" class="tu2">
      </div>
      		<div class="indexb-bottom">
      			<img src="~@/assets/dpgame/yiy/images/skin1/wx/yao_01.png">
      		</div>
    </div>
		<div class="gameInfo-container" v-show="gameRoundState=='started'">
      <ul class="shake-ani">
      </ul>

      <div class="indexb-half-top">
  			<div class="timeContainer">
  				<img src="~@/assets/dpgame/yiy/images/shakeMP_timeIcon.png" class="time-icon">
  				00:<span v-text="formatTime"></span>
  			</div>
  			<div class="countsContainer" >
          <span class="pull-left">当前得分</span>
          <span class="pull-right" v-text="score"></span>
  			</div>
      </div>
      <div class="indexb-bottom">
        <img src="~@/assets/dpgame/yiy/images/skin1/wx/yao_01.png" class="tt">
      </div>
		</div>
		<!-- 开始游戏倒计时遮罩层 -->
		<div class="runningTime-shade" v-show="gameRoundState=='starting'">
			<p>游戏开始倒计时</p>
			<p>
				<span v-text="timeToStart" class="runningTime"></span>
				<span>秒</span>
			</p>
			<p>马上进入“摇一摇”</p>
		</div>

    <div class="state-completed" v-show="gameRoundState=='completed'">
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
      {{gameRoundState}}
			<p>加载中...</p>
		</div>
    <div class="debug" style="display:none;"> {{gameRoundState}}  </div>
    <SignUp :game-player="gamePlayer" :gameRound="gameRound" :command="signUpCommand" @signUpOver="signUpOver"> </SignUp>
    <Logger ref="logger"> </Logger>
	</div>

</template>

<script>

  // import Game from './game/Game.vue'
  import GameRes from './game/GameRes'
  import GameArg from './game/GameArg'
  import HdGame from '@/lib/hdgame'
  import GameState from '@/lib/GameState'
  import SignUp from '@/components/SignUp.vue'
  import Logger from '@/components/Logger.vue'
  import {
    // setAchievebycode,
    getGameResult
  } from '@/api/dpgame/yiy.js'
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

  function s(){
  	return window.jQuery;
  }

  export default {
    name: 'app',
    components: {
      SignUp,
      Logger
    },
    data() {
      return{
        o_list:[],
        signUpCommand: null,
        hg: {
          showGameBox: true
        },
        socket:null,
        gameRound:{},
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
        ui: {
          sign_up: false,
          homeVisible: true, // 初始页面是否可见，游戏时需要隐藏
          gameBoxVisible: false, // 游戏页面
          ruleImgVisible: true, // 锦囊按钮
          loadToastVisible: false,
          wait: false
        }
      }
  	},
  	computed: {
  		formatTime: function(){
  			return this.timeToEnd < 10 ? '0' + this.timeToEnd :this.timeToEnd;
  		},
  		computedToptips(){
        console.log("=====",this.gameRoundStateTips);
  			return this.gameRoundStateTips[this.gameRoundState]
  		},
      // gameRoundState(){
      //     console.log('this.gameRoundState=====:',this.gameRoundState);
  		// 	switch (this.gameRoundState) {
  		// 		case 'created': return 'created';
  		// 		case 'open': return 'open';
  		// 		case 'ready': return 'ready';
  		// 		case 'starting': return 'starting';
  		// 		case 'started': return 'started';
  		// 		case 'completed': return 'completed';
  		// 		case 'disabled': return 'disabled';
  		// 		default: return 'unkonwn'
  		// 	}
  		// }
  	},
  	created: function(){
  		var that = this;
      this.hg.grade = new HdGame.Grade(0)

      this.hg.time = new HdGame.Time(g_config.initTime, { updateFlag: true, isDesc: false })

      //simplifyLufylegend( this.hg, window.g_rem )
      HdGame.initJsHead(this.hg, GameRes)
      if (this.debug) {
        window.hg = this.hg
        window.gameArg = GameArg
      }
      const parsed = queryString.parse(location.search)
      var number = parsed.number

      var params = {
        parsed: parsed
      }
  		// 监听设备的加速度事件
  		// 检测设备是否支持加速度传感器
  		if(!window.DeviceMotionEvent){
  			alert('您的设备不支持摇一摇功能！');
  			return;
  		}
      let socketPath = process.env.SOCKETIO_PATH
      that.socketNameSpace = '/channel-dpyiy-' + number
      that.socket = io( that.socketNameSpace , { transports: [ 'websocket' ], path: socketPath })
      that.socket.on('connect', () => {
        that.loading = false;
        that.bindSocketEvents()
      });
      getGameResult(number, params).then(data => {
        this.gameInfo = data
        console.log('gameInfo=======:', this.gameInfo)
        this.gameRound = this.gameInfo['gameRound']
        this.timeToEnd = this.gameRound.duretion
        this.gameRoundState = this.gameRound.state
        console.log('this.gameRoundState++++++:',this.gameRoundState);
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
          // this.ui.homeVisible = false
          this.ruleBoxCommand = 'hideIcon'
          this.signUpCommand = 'show'
        } else if (
          (this.gameRoundState == GameState.open || this.gameRoundState == GameState.created) &&
          (this.gamePlayer.token !== undefined || this.gameInfo['gameRound'].contact_required == 0)
        ) {
          this.ruleBoxCommand = 'showIcon'
          this.ui.wait = true
          // this.ui.homeVisible = true
        } else if (this.gameRoundState == GameState.started) {
          // this.ui.homeVisible = false
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
          this.rank = r.rank
        }
        document.title = this.gameRound.name
      })
      this.activateSound()
      this.hg.sound.pauseAll()
      let hg = that.hg
      if (
        typeof hg.sound.cache[0] !== 'undefined' &&
        typeof hg.sound.cache[0].playing !== 'undefined' &&
        !hg.sound.cache[0].playing
      ) {
        hg.sound.readyPlay(0, 0, 'loop')
      }
  	},
  	methods: {
      activateSound() {
        //兼容ios下 WebAudio类型的对象无法自动播放，必须在点击事件中播放过一次，才允许播放
        try {
          if (HdGame.isIPhone() && this.hg.sound.list && this.hg.sound.list.length > 0 && !this.hg.sound._activate) {
            this.hg.sound.list.forEach(function(val, i) {
              var data = this.hg.sound.cache[i]
              if (i > 0 && data && data.soundType == 'LWebAudio') {
                data.play()
                data.stop()
              }
            })
            this.hg.sound._activate = true
          }
          if (HdGame.isIPhone()) {
            this.hg.sound.cache['yiy'].play()
            this.hg.sound.cache['yiy'].stop()
          }
        } catch (e) {
          //HdGame.logStd("activateSoundErr", e);
        }
      },
      bindSocketEvents: function(){
        var that = this
        that.socket.on('GameOpeningEvent', function(data) {
          console.log('GameOpeningEvent')
          that.gameRoundState = data.gameState
          that.resultBoxVisible = false
          console.log('that.gameRoundState=====:',that.gameRoundState);
          if (
            that.gameRoundState == GameState.open &&
            that.gamePlayer.token == undefined &&
            that.gameInfo['gameRound'].contact_required == 1
          ) {
            that.ui.homeVisible = false
            that.signUpCommand = 'show'
          } else if (
            that.gameRoundState == GameState.open &&
            (that.gamePlayer.token !== undefined || that.gameInfo['gameRound'].contact_required == 0)
          ) {
            that.ui.wait = true
            that.ui.homeVisible = true
          }
        })

        that.socket.on('GameStartingEvent', function(data){
  				console.log('io:GameStartingEvent')
  				that.timeToStart = data.timeToStart
  				that.gameRoundState = data.gameRoundState
  				// 倒计时0，即游戏开始
  				if( that.timeToStart == 1 ){
            that.score = 0
  					that.startGame()
            that.ui.wait = false
  				}
  			});
  			// 游戏运行结束倒计时事件,
  			that.socket.on('GameRunningEvent', function(data){
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
  			that.socket.on('GameEndEvent', function(data){
  				console.log('io:GameEndEvent', data)
          console.log('data====:',data);
          that.gameRoundState = GameState.completed
          for(var i=0;i<data.gamePlayerScores.length;i++){
            if(data.gamePlayerScores[i].openid==that.gamePlayer.openid){
              that.rank = data.gamePlayerScores[i].rank+1
            }
          }

  				//socket.disconnect();

  				console.log('游戏时间到！');
  			});
      },
  		handlePlayMusic: function() {
  			try{
  				document.querySelector("#bgMusic").play();
  			}catch(err){
  				alert(err)
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
            //this.o_list.push(o)
            //o > this.status.SHAKE_THRESHOLD && (this.status.count++, this.status.canShake && (this.status.canShake = !1, this.handleShaking())),
  					if( o > this.status.SHAKE_THRESHOLD ){
              this.$refs['logger'].log( o )
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
  					game_player_id: that.gamePlayer.id,
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
  				game_player_id: that.gamePlayer.id,
  				score: that.score
  			};
  			that.socket.emit('ShakeEvent', query);
        that.socket.emit('addReultEvent', query);
  		},
      signUpOver(res) {
        console.log('==============signUpOver==============')
        this.ui.homeVisible = true
        this.ui.wait = true
        this.gamePlayer = res
        let that = this
        that.ruleBoxCommand = 'showIcon'
        that.signUpCommand = 'hide'
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
    top: 90vh;
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
