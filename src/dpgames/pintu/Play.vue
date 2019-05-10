<template>
<div id="app">

  <div class="sign_up" v-show="ui.sign_up">
    sign_up</br>
    name:<td><input id="name" ></input></td></br>
    tel:<td><input id="tel" ></input></td></br>
    <button  @click="post_msg()" type="button">commit</button>
  </div>

  <div class="home" v-show="ui.homeVisible">
    <div class="unstarted" v-show="ui.unstarted">
      unstarted
    </div>
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
  <ResultBox ref="result-box" :home-callback="home" :again-callback="handleGameRestart" v-show="resultBoxVisible" :params="resultBoxParams" :command="resultBoxCommand"> </ResultBox>
</div>
</template>

<script>
import wx from 'weixin-js-sdk'

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
import ResultBox from '@/components/DpGameResult.vue'
import {
  GameBackgroundMusicLoadEvent
} from '@/lib/GameEvent'
import queryString from 'query-string'
import io from 'socket.io-client'

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
    ResultBox
  },
  created() {
    console.log( "wx=", wx)
    var that = this
    this.hg.grade = new HdGame.Grade(0)

    this.hg.time = new HdGame.Time(g_config.initTime, { updateFlag: true, isDesc: false })

    GameArg.eventBus.$on(GameBackgroundMusicLoadEvent.name, (event) => {
      console.log( "GameBackgroundMusicLoadEvent")
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
    var code = 'dppintu';
    var number = parsed.number;

    var params = {
      parsed: parsed
    }

    that.socketNameSpace = "/channel-dppintu-"+ number
    that.socket = io( that.socketNameSpace )
    that.socket.on('connect', () => {
      that.loading = false;
      that.bindSocketEvents()
    });

    getGameResult(code,number,params).then(data => {
      //console.log(data);
      this.gameInfo = data
      this.timeToEnd = this.gameInfo['gameRound'].duretion
      this.gameState = this.gameInfo['gameRound'].state
      this.gamePlayer = this.gameInfo['gamePlayer']
      this.wx_config = this.gameInfo['wx_config']
      console.log('wx_configwx_config------:',this.wx_config);

      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: this.wx_config.appId, // 必填，公众号的唯一标识
        timestamp: this.wx_config.timestamp, // 必填，生成签名的时间戳
        nonceStr: this.wx_config.nonceStr, // 必填，生成签名的随机串
        signature: this.wx_config.signature,// 必填，签名
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
      });

      var number = this.gameInfo['gameRound'].number;


      wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
        wx.onMenuShareAppMessage({
          title: 'dpgame', // 分享标题
          desc: 'dpgame', // 分享描述
          link: 'http://testwx.getstore.cn/authwx/game?gameurl=http://testwx.getstore.cn/pintu-play.html?number='+number, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: '', // 分享图标
          success: function () {
            // 设置成功
            console.log('updateAppMessageShareData success');
          }
        })

        wx.onMenuShareTimeline({
          title: 'dpgame', // 分享标题
          link: 'http://testwx.getstore.cn/authwx/game?gameurl=http://testwx.getstore.cn/pintu-play.html?number='+number, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: '', // 分享图标
          success: function () {
            // 设置成功
            console.log('updateTimelineShareData success');
          }
        })
      });

      wx.error(function(res){
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log('ERROR MESSEGE---:',res);
      });

      if(this.gameState==GameState.started&&this.gamePlayer.token==undefined){
        this.gameState=GameState.created
      }else if(this.gameState==GameState.open&&this.gamePlayer.token==undefined&&this.gameInfo['gameRound'].contact_required==1){
        this.ui.homeVisible = false
        this.ui.unstarted = false
        this.ui.sign_up = true
      }else if (this.gameState==GameState.open&&(this.gamePlayer.token!==undefined||this.gameInfo['gameRound'].contact_required==0)) {
        this.ui.unstarted = false
        this.ui.wait = true
        this.ui.homeVisible = true
      }else if(this.gameState==GameState.started){
        this.ui.unstarted = false
        this.ui.homeVisible = false
        this.ui.gameBoxVisible = true
      }
      if(this.gameState==GameState.completed||(this.gameInfo['gameResult']!==null&&this.gameInfo['gameResult']!==undefined)){
        var r = this.gameInfo['ret']
        if(this.gameInfo['gamePlayer'].score == 9999.99){
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

    })
  },
  data() {
    return {
      debug: true,
      gameInfo:{},
      wx_config:{},
      first_start: true,
      gamePlayer: {},
      hg: {
        showGameBox: true
      },
      gameState: 'initial', // start, restart, over
      homeBgImg: require('@/assets/dp-pintu/image/skin1/wx/gameBg.jpg'),
      titleImg: require('@/assets/dp-pintu/image/skin1/wx/title.png'),
      startBtnImg: require('@/assets/dp-pintu/image/skin1/wx/start.png'),
      ui: {
        sign_up:false,
        unstarted:true,
        homeVisible: true, // 初始页面是否可见，游戏时需要隐藏
        gameBoxVisible: false, // 游戏页面
        ruleImgVisible: true, // 锦囊按钮
        loadToastVisible: false,
        wait: false
      },
      loadToast: {
        isLoading: false,
        text: null
      },
      resultBoxVisible: false, //游戏结果页面
      resultBoxParams: {},
      resultBoxCommand: null,
      timeToEnd: 30
    }
  },
  methods: {
    bindSocketEvents: function(){
      var that = this
      that.socket.on('GameOpeningEvent', function(data){
				that.gameState = data.gameState
        that.resultBoxVisible = false
        if(that.gameState==GameState.open&&that.gamePlayer.token==undefined&&that.gameInfo['gameRound'].contact_required==1){
          that.ui.homeVisible = false
          that.ui.unstarted = false
          that.ui.sign_up = true
        }else if (that.gameState==GameState.open&&(that.gamePlayer.token!==undefined||that.gameInfo['gameRound'].contact_required==0)) {
          that.ui.unstarted = false
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
          that.ui.unstarted = false
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
				//console.log( 'GameRunningEvent', data )
			});
			that.socket.on('GameEndEvent', function(data){
				that.gameState = GameState.completed
        that.ui.unstarted = true
        that.ui.homeVisible = false
        that.ui.gameBoxVisible = false
        that.resultBoxVisible = true
				//console.log( 'GameEndEvent', data)
			});
  },
    post_msg: function () {
      //console.log('post_msg');
      var realname = document.getElementById('name').value
      var tel = parseInt(document.getElementById('tel').value)

      const parsed = queryString.parse(location.search);
      var code = 'dppintu';
      var number = parsed.number;
      this.gamePlayer.realname = realname
      this.gamePlayer.tel = tel
      var data = {
        gamePlayer: this.gamePlayer
      }
      postMsg(code,number,data).then((res)=>{
        ////console.log( 100000, res )
        this.gamePlayer = res
        this.ui.sign_up = false
        this.ui.unstarted = false
        this.ui.wait = true
        return res
      })

      this.ui.unstarted = false
      this.ui.wait = true
      this.ui.homeVisible = true
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

      if (_gameScore === 'fail') {
          setTimeout(function () {
        }, 900);
        return;
      }
      if (isNaN(_gameScore) || _gameScore < 0) {
        _gameScore = 0;
      }
      _gameScore = parseFloat(_gameScore).toFixed(2);
      this.showLoadToast('数据加载中');
      var _gameScoreStr = _gameScore + '';

      var info = {
        headImg: this.gamePlayer.avatar
      };

      const parsed = queryString.parse(location.search);
      var params = {
        gameId: 50,
        style: 22,
        achieve: HdGame.encodeBase64('"' + _gameScoreStr + '"') + "0jdk7Deh8T2z5W3k0j44dTZmdTOkZGM",
        score:_gameScore,
        parsed:parsed
      };

      var code = 'dppintu';
      var number = parsed.number;
      params.info = JSON.stringify(info);

      Object.assign(params, option);
      setAchievebycode(code,number,params).then(data => {
        this.hideLoadToast();
        HdGame.tlog('gameOver', data);
        var r = data;
        var isShowPoup = true;
        console.log('this.gamePlayer.avatar----------:',this.gamePlayer.avatar);
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
        } else if (r.rt == 11) {
          alert("已被检测到有作弊行为，再次被检测将永久禁止参与本游戏！");
        } else if (r.rt == 12) {
          alert("由于作弊行为，该微信号已永久禁止参与本游戏！");
        } else if (r.rt == 23) { //活动已经结束
          HdGame.statusMsg(3);
        } else if (r.rt == 44) {
          HdGame.statusMsg(8);
        } else {
          callBack && (isShowPoup = callBack({
            rt: r.rt,
            msg: r.msg
          }, r));
          if (isShowPoup !== false) {
            HdGame.logStd("gameOverErr", 'style=' + g_config.style + ' gameScore=' + _gameScore + ' faiOpenId=tryPlay_12435152 data=' + (data));
            HdGame.resulePoup.show({
              isSuc: false,
              gameScore: '--',
              minScore: 50,
              bestScore: '--',
              gameType: gameType,
              rank: '--',
              beat: '--',
              isEqualDraw: false
            });
          }
          return;
        }
        if (r.rt !== 0) {
          callBack && callBack({
            rt: r.rt,
            msg: r.msg
          }, r);
        }
      }).catch(err => {
        this.hideLoadToast();
        HdGame.otherAjaxComplete();
        var rt = {
          rt: -999,
          msg: "ajax返回错误"
        };
        if (!window.navigator.onLine) {
          rt.msg = "网络连接失败，请检查你的网络设置!";
        }
        if (callBack) {
          if (callBack(rt, rt)) {
            alert(rt.msg);
          }
        } else {
          alert(rt.msg);
        }
        HdGame.tlog('gameOverErr', JSON.stringify(arguments));
      })

      params = info = option = null;

    },
    initBackgroundMusic() {
      //console.log("initBackgroundMusic->sound")
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

.dp-pintu {
  font-size: 14px;
}
</style>
