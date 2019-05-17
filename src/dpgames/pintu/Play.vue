<template>
<div id="app">
  <div class="sign_up" v-show="ui.sign_up">
        <div class="weui-toptips weui-toptips_warn js_tooltips"></div>
        <div id="awardUserInfoBox" class="page  input js_show">
            <div class="awardUserInfoTitle">
                <h2>填写联系信息</h2>
                <p class="tipsColor">为了方便兑奖，请先填写您的联系信息</p>
            </div>

            <div class="awardUserInfoForm">
                <div class="weui-cells weui-cells_form">
                  <div style="text-align: center"><img id="headImg" v-bind:src="gamePlayer.avatar"></div>
                    <div class="weui-cell contactInput-ausername contactInput">
                        <div class="weui-cell__hd"><label class="weui-label">姓名</label></div>
                        <div class="weui-cell__bd">
                            <input style="margin:0px;border: none;" id="name" class="weui-input theInputDecide textInput" propname="姓名" propkey="ausername" type="text" placeholder="请输入姓名">
                        </div>
                        <div class="weui-cell__ft warnIcon hide">
                            <i class="weui-icon-warn"></i>
                        </div>
                    </div>
                    <div class="weui-cell contactInput-aphone contactInput">
                        <div class="weui-cell__hd"><label class="weui-label">联系电话</label></div>
                        <div class="weui-cell__bd">
                            <input style="margin:0px;border: none;" id="tel" class="weui-input theInputDecide textInput" propname="联系电话" propkey="aphone" type="text" placeholder="请输入联系电话">
                        </div>
                        <div class="weui-cell__ft warnIcon phoneWarn hide">
                            <i class="weui-icon-warn"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="weui-cells__tips">
                注:若因未填写资料或资料填写错误导致无法兑奖，主办方不承担相关法律责任;
            </div>
            <div class="weui-btn-area">
                <a class="weui-btn weui-btn_primary userSubmitBtn" @click="post_msg()" href="javascript:" id="showTooltips">提交</a>
            </div>
        </div>
  </div>

  <div class="home" v-show="ui.homeVisible">
    <div v-show="ui.wait">
      <div id="homeBgBox">
        <img id="homeBg" :src="homeBgImg" />
      </div>
      <div class="this.gameInfoBox">
        <div class="titleImg imgContainer absCenter">
          <img id="titleImg" class="slaveImg abs" :src="titleImg" style="width:15.232rem;height:5.778666666666667rem;top:2.524rem;left:0.384rem;" />
        </div>
      </div>
    </div>

    <div id="playInfo" class="abs editTarget-playInfo hide" style="width:9rem;text-align:center;">
      <div class="dayPlayHint">您今天还有 <span id="count" class="specil todayPlayCount"></span> 次参与机会</div>
      <div class="totalPlayHint">您还有 <span class="totalPlayCount specil"></span> 次参与机会</div>
      <div class="dayPlayHint4Total">今天有 <span class="count specil todayPlayCount"></span> 次</div>
    </div>

  </div>

  <Game ref="game" :hg="hg" :gamePlayer="gamePlayer" :timeToEnd="timeToEnd" :command="gameState" @game-over="handleGameOver" v-show="ui.gameBoxVisible"> </Game>
  <LoadToast ref="load-toast" is-loading="loadToast.isLoading"> </LoadToast>
  <ResultBox ref="result-box" :home-callback="home" @rankBtnClicked="getRank" :again-callback="handleGameRestart" v-show="resultBoxVisible" :params="resultBoxParams" :command="resultBoxCommand"> </ResultBox>
  <RuleBox :ruleIconUrl="skinAssets.ruleIconPath" :game-round="gameRound" :game-player="gamePlayer" :params="resultBoxParams" :command="ruleBoxCommand" @commandDone="handleResetRuleCommand"> </RuleBox>
</div>
</template>

<script>
import weui from 'weui.js'
import Game from './game/Game.vue'
import GameRes from './game/GameRes'
import GameArg from './game/GameArg'
import HdGame from '@/lib/hdgame'
import GameState from '@/lib/GameState'
import {
  setAchievebycode,
  getGameResult,
  postMsg,
} from '@/api/dpgame/pintu.js'
import LoadToast from '@/components/LoadToast.vue'
import ResultBox from './ResultBox.vue'
import RuleBox from './RuleBox.vue'
import {
  GameBackgroundMusicLoadEvent
} from '@/lib/GameEvent'
import queryString from 'query-string'
import io from 'socket.io-client'
import constant from '@/game_constant.js'

const gameUrlBase = process.env.GAME_URL_BASE
//import {simplifyLufylegend } from '@/lib/simplify'
//关于玩家的配置信息
const g_config = {
  scoreType: false,
  initTime: 0,
  ipInfo: {
    provice: null,
    city: null
  }
}

const gameType = 1 // 0抽奖， 1刷记录

export default {
  name: 'app',
  components: {
    Game,
    LoadToast,
    ResultBox,
    RuleBox
  },
  created() {
    var that = this
    this.hg.grade = new HdGame.Grade(0)

    this.hg.time = new HdGame.Time(g_config.initTime, { updateFlag: true, isDesc: false })

    GameArg.eventBus.$on(GameBackgroundMusicLoadEvent.name, (event) => {
      this.initBackgroundMusic()
    })
    //simplifyLufylegend( this.hg, window.g_rem )
    HdGame.initJsHead(this.hg, GameRes)

    this.hg.assets.add( GameRes.skinAssets )

    if( this.debug ){
      window.hg = this.hg
      window.gameArg = GameArg
    }

    const parsed = queryString.parse(location.search);

    var number = parsed.number;

    var params = {
      parsed: parsed
    }

    that.socketNameSpace = "/channel-dppintu-"+ number
    that.socket = io( that.socketNameSpace , { transports: [ 'websocket' ] })
    that.socket.on('connect', () => {
      that.loading = false;
      that.bindSocketEvents()
    });

    getGameResult(number,params).then(data => {
      this.gameInfo = data
      console.log('gameInfo=======:',this.gameInfo);
      this.gameRound = this.gameInfo['gameRound']
      this.timeToEnd = this.gameRound.duretion
      this.gameState = this.gameRound.state
      this.gamePlayer = this.gameInfo['gamePlayer']
      this.playPath = this.gameRound.playPath

      let wxConfig = this.gameInfo['wxConfig']
      if( wxConfig ){
        HdGame.initWxConfig( wxConfig )

        let wxShareArg = {
          title: this.gameRound.name,
          desc: this.gameRound.desc,
          link: gameUrlBase + '/authwx/game?gameurl='+gameUrlBase+this.playPath,
          imgUrl: gameUrlBase + '/static/game/zhaobaba/skin/image/wx/share.jpg'
        }
        console.log('wxShareArg=====:',wxShareArg);
        HdGame.setWxShare( wxShareArg )
      }

      if(this.gameState==GameState.started&&this.gamePlayer.token==undefined){
        this.gameState=GameState.created
      }else if((this.gameState==GameState.open||this.gameState==GameState.created)&&this.gamePlayer.token==undefined&&this.gameInfo['gameRound'].contact_required==1){
        this.ui.homeVisible = false
        this.ui.sign_up = true
      }else if ((this.gameState==GameState.open||this.gameState==GameState.created)&&(this.gamePlayer.token!==undefined||this.gameInfo['gameRound'].contact_required==0)) {
        this.ruleBoxCommand = 'showIcon'
        this.ui.wait = true
        this.ui.homeVisible = true
      }else if(this.gameState==GameState.started){
        this.ui.homeVisible = false
        this.ui.gameBoxVisible = true
      }
      if(this.gameState==GameState.completed||(this.gameInfo['gameResult']!==null&&this.gameInfo['gameResult']!==undefined)){
        var r = this.gameInfo['ret']
        if(this.gameInfo['gamePlayer'].score == constant.GameConstant.maxTime){
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
        };

        this.resultBoxParams = arg
        this.resultBoxCommand = "showResult"
        this.resultBoxVisible = true
      }
      document.title = this.gameRound.name
    })
  },
  data() {
    return {
      debug: true,
      hasFinish: false,
      gameInfo:{},
      wx_config:{},
      first_start: true,
      gamePlayer: {},
      gameRound:{},
      hg: {
        showGameBox: true
      },
      gameState: 'initial', // start, restart, over
      homeBgImg: require('@/assets/dp-pintu/image/skin1/wx/gameBg.jpg'),
      titleImg: require('@/assets/dp-pintu/image/skin1/wx/title.png'),
      startBtnImg: require('@/assets/dp-pintu/image/skin1/wx/start.png'),
      ui: {
        sign_up:false,
        homeVisible: true, // 初始页面是否可见，游戏时需要隐藏
        gameBoxVisible: false, // 游戏页面
        ruleImgVisible: true, // 锦囊按钮
        loadToastVisible: false,
        wait: false
      },
      skinAssets:{
        logoImgPath: GameRes.skinAssets.logoImgPath,
        ruleIconPath: GameRes.skinAssets.ruleIconPath,
        homeBgImg: GameRes.skinAssets.homeBgPath,
        titleImg: GameRes.skinAssets.titleImgPath,
        startBtnImg: GameRes.skinAssets.startImgPath
      },
      loadToast: {
        isLoading: false,
        text: null
      },
      resultBoxVisible: false, //游戏结果页面
      resultBoxParams: {},
      resultBoxCommand: null,
      ruleBoxCommand: null,
      timeToEnd: 30
    }
  },
  methods: {
    bindSocketEvents: function(){
      var that = this
      that.socket.on('GameOpeningEvent', function(data){
        console.log('GameOpeningEvent');
        console.log(data);
				that.gameState = data.gameState
        that.resultBoxVisible = false
        console.log("that.gameInfo====:",that.gameInfo);
        console.log(that.gameInfo['gameRound']);
        console.log(that.gameInfo['gameRound'].contact_required==1);
        if(that.gameState==GameState.open&&that.gamePlayer.token==undefined&&that.gameInfo['gameRound'].contact_required==1){
          that.ui.homeVisible = false
          that.ui.sign_up = true
        }else if (that.gameState==GameState.open&&(that.gamePlayer.token!==undefined||that.gameInfo['gameRound'].contact_required==0)) {
          that.ui.wait = true
          that.ui.homeVisible = true
        }
			});
      that.socket.on('GameStartingEvent', function(data){
				that.gameState = data.gameState
				that.timeToStart = data.timeToStart
			});
			//绑定 游戏倒计时事件，游戏时间倒计时
			that.socket.on('GameRunningEvent', function(data){
        that.timeToEnd = data.timeToEnd

        if(that.first_start){
          that.first_start = false
          that.ui.wait = false
          that.gameState = GameState.started
          that.ui.rted = false
          that.ui.homeVisible = false
          that.ui.gameBoxVisible = true
          that.resultBoxVisible = false
        }
        if(that.gameInfo['gameResult']!==null&&that.gameInfo['gameResult']!==undefined){
          var r = that.gameInfo['ret']
          var arg = {
            isSuc: r.isSuc,
            gameScore: that.gameInfo['gamePlayer'].score,
            minScore: 0, //到多少分可以抽奖
            bestScore: r.score,
            gameType: gameType,
            rank: r.rank,
            beat: r.beat,
            isEqualDraw: false,
            bestCostTime: r.bestCostTime
          };

          that.resultBoxParams = arg
          that.resultBoxCommand = "showResult"
          that.resultBoxVisible = true
        }
			});
			that.socket.on('GameEndEvent', function(data){
				that.gameState = GameState.completed
        that.gameOver(that.time)
        that.ui.homeVisible = false
        that.ui.gameBoxVisible = false
        that.resultBoxVisible = true
			});
  },
    post_msg: function () {
      console.log('========post_msg========');
      var msg_is_ok = true
      var realname = document.getElementById('name').value
      var tel = parseInt(document.getElementById('tel').value)

      if (realname == '') {
        weui.form.showErrorTips({
          ele: document.getElementById("name"),
          msg: '姓名不能为空'
        });
        msg_is_ok = false
      }

      var tel0 = /^1\d{10}$/
      var ema = document.getElementById('tel').value
      if (tel0.test(ema) == false) {
          weui.form.showErrorTips({
            ele: document.getElementById("tel"),
            msg: '电话格式错误'
          });
          msg_is_ok = false
      }
      if(msg_is_ok){
        const parsed = queryString.parse(location.search);
        var number = parsed.number;
        var data = {
          gamePlayer: this.gamePlayer,
          realname:realname,
          tel:tel
        }
        postMsg(number,data).then((res)=>{
          this.gamePlayer = res
          this.ui.sign_up = false
          this.ui.homeVisible = true
          return res
        })
        this.ui.wait = true
        this.ui.homeVisible = true
        let that = this
        that.ruleBoxCommand = 'showIcon'
      }
    },
    handleStartGame(event) {
      event.preventDefault()

      let that = this

      this.activateSound();

      function showGame() {

        that.ui.homeVisible = false
        that.ui.gameBoxVisible = true

        let hg = that.hg
        if (typeof hg.sound.cache[0] !== 'undefined' && typeof hg.sound.cache[0].playing !== 'undefined' && !hg.sound.cache[0].playing) {
          hg.sound.readyPlay(0, 0, 'loop');
        }
      }


      // 无论是否显示游戏界面都需要调用的功能
      function complete(result) {

      }
      // 不满足显示界面的条件
      function handleFail() {
        complete(false);
      }

      // rulebox 处理完命令以后，需要重置，以便下次使用同样命令时也可以触发


      function handleResult() {
        function logs() {

        }

        function cookies() {

        }

        showGame();

        logs();

        cookies();

        complete(true);

      }

      Promise.resolve().then(() => {
        handleResult()
        this.gameState = 'start'
      }).catch((error) => {
        handleFail()
      })

    },
    handleGameOver(event) {
      this.gameState = "over"
      this.gameOver(this.time)
    },
    handleGameRestart() {
      this.gameState = 'restart'
      this.resultBoxVisible = false
    },
    home() {

      this.ui.gameBoxVisible = false
      this.startBtnDelay();
      this.ui.homeVisible = true

      this.resultBoxVisible = false

      this.gameState = 'initial'
      this.hg.fire('home');
    },
    startBtnDelay() {

      this.hg.sound.pauseAll();

    },
    activateSound() { //兼容ios下 WebAudio类型的对象无法自动播放，必须在点击事件中播放过一次，才允许播放
      try {
        if (HdGame.isIPhone() && this.hg.sound.list && this.hg.sound.list.length > 0 && !this.hg.sound._activate) {
          this.hg.sound.list.forEach(function (val, i) {
            var data = this.hg.sound.cache[i];
            if (i > 0 && data && data.soundType == "LWebAudio") {
              data.play();
              data.stop();
            }
          });
          this.hg.sound._activate = true;
        }
        if (HdGame.isIPhone()) {
          this.hg.sound.cache['yiy'].play();
          this.hg.sound.cache['yiy'].stop();
        }

      } catch (e) {
        //HdGame.logStd("activateSoundErr", e);
      }
    },
    // 游戏结束，设置游戏成绩
    gameOver(_gameScore, callBack, option, showAjaxBar) {

      var info = {
        headImg: this.gamePlayer.avatar
      };
      const parsed = queryString.parse(location.search);
      var params = {
        gameId: 50,
        style: 22,
        score:_gameScore,
        parsed:parsed
      };

      var number = parsed.number;
      params.info = JSON.stringify(info);

      Object.assign(params, option);
      if(this.hasFinish == false){
        setAchievebycode(number,params).then(data => {
          this.hideLoadToast();
          HdGame.tlog('gameOver', data);
          var r = data;

          if(r.score==constant.GameConstant.maxTime){
            r.score=0
          }
          if(r.bestScore==constant.GameConstant.maxTime){
            r.bestScore=0
          }
          console.log('rrrrrrr',r);
          if (r.rt == 0) {
            var arg = {
              isSuc: r.isSuc,
              gameScore: r.score,
              minScore: 0, //到多少分可以抽奖
              bestScore: r.bestScore,
              gameType: gameType,
              rank: r.rank,
              beat: r.beat,
              isEqualDraw: false,
              bestCostTime: r.bestCostTime,
              headImg: this.gamePlayer.avatar
            };

            g_config.playerId = r.playerId;
            this.resultBoxParams = arg
            this.resultBoxCommand = "showResult"
            this.resultBoxVisible = true //显示游戏结果
            //PlayInfo.addPlayTimes(1);
            g_config.achieveToken = r.achieveToken;
          }
          this.hasFinish = true
      })
}
    },
    handleResetRuleCommand(){
      this.ruleBoxCommand = null
    },
    getRank(event){
      console.log("App - getRank ")
      this.ruleBoxCommand = 'showRank'
    },
    initBackgroundMusic() {
    },

    showLoadToast(text) {
      this.loadToast.isLoading = true
      this.loadToast.text = text
    },
    hideLoadToast() {
      this.loadToast.isLoading = false
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
#headImg{
      border-radius: 100%;
      width: 20%;
      height: auto;
}

.dp-pintu {
  font-size: 14px;
}
</style>
