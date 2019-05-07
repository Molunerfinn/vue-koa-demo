<template>
<div id="app">
  <div class="unstarted" v-show="ui.unstarted">
    unstarted
  </div>
  <div class="sign_up" v-show="ui.sign_up">
    sign_up</br>
    name:<td><input id="name" ></input></td></br>
    tel:<td><input id="tel" ></input></td></br>
    <button  @click="post_msg()" type="button">commit</button>
  </div>
  <div class="wait" v-show="ui.wait">
    wait</br>
    please wait for start
  </div>
  <div class="home" v-show="ui.homeVisible">
    <div id="homeBgBox">
      <img id="homeBg" :src="homeBgImg" />
    </div>
    <div class="this.gameInfoBox">
      <div class="titleImg imgContainer absCenter">
        <img id="titleImg" class="slaveImg abs" :src="titleImg" style="width:15.232rem;height:5.778666666666667rem;top:2.524rem;left:0.384rem;" />
      </div>
    </div>


    <div id='joinNumLine' class='joinNumLine absCenter'
      style='top:23.424rem;left:3.3706666666666667rem;color:rgb(255,255,255);font-size:0.5546666666666666rem; text-shadow:rgb(255,62,7) -1px -1px 0px, rgb(255,62,7) 0px -1px 0px, rgb(255,62,7) 1px -1px 0px, rgb(255,62,7) 1px 0px 0px, rgb(255,62,7) 1px 1px 0px, rgb(255,62,7) 0px 1px 0px, rgb(255,62,7) -1px 1px 0px, rgb(255,62,7) -1px 0px 0px;'>
      已有 <span id='joinNum' class="specil"
        style="color:rgb(255,255,255);font-size:0.5546666666666666rem;text-shadow:rgb(255,62,7) -1px -1px 0px, rgb(255,62,7) 0px -1px 0px, rgb(255,62,7) 1px -1px 0px, rgb(255,62,7) 1px 0px 0px, rgb(255,62,7) 1px 1px 0px, rgb(255,62,7) 0px 1px 0px, rgb(255,62,7) -1px 1px 0px, rgb(255,62,7) -1px 0px 0px;">4346</span>
      人参加活动</div>


    <div id="playInfo" class="abs editTarget-playInfo hide" style="width:9rem;text-align:center;">
      <div class="dayPlayHint">您今天还有 <span id="count" class="specil todayPlayCount"></span> 次参与机会</div>
      <div class="totalPlayHint">您还有 <span class="totalPlayCount specil"></span> 次参与机会</div>
      <div class="dayPlayHint4Total">今天有 <span class="count specil todayPlayCount"></span> 次</div>
    </div>
    <div id="startBtn" class="startBtn imgContainer absCenter" style="top:0rem;">
      <img @touchend="handleStartGame" id="startBtnImg" class="slaveImg abs" :src="startBtnImg" style="width: 6.66rem; height: 2.449333333333334rem;    top: 19.706666666666667rem;  left: 4.67rem;" />
    </div>

  </div>

  <Game ref="game" :hg="hg" :timeToEnd="timeToEnd" :command="gameState" @game-over="handleGameOver" v-show="ui.gameBoxVisible"> </Game>
  <LoadToast ref="load-toast" is-loading="loadToast.isLoading"> </LoadToast>
  <ResultBox ref="result-box" :home-callback="home" :again-callback="handleGameRestart" v-show="resultBoxVisible" :params="resultBoxParams" :command="resultBoxCommand"> </ResultBox>
</div>
</template>

<script>
import Game from './game/Game.vue'
import GameRes from './game/GameRes'
import GameArg from './game/GameArg'
import HdGame from '@/lib/hdgame'
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
    var that = this
    this.hg.grade = new HdGame.Grade(0)

    this.hg.time = new HdGame.Time(g_config.initTime, { updateFlag: true, isDesc: false })

    GameArg.eventBus.$on(GameBackgroundMusicLoadEvent.name, (event) => {
      this.initBackgroundMusic()
    })
    //simplifyLufylegend( this.hg, window.g_rem )
    HdGame.initJsHead(this.hg, GameRes)

    this.hg.assets.add( GameRes.skinAssets );
    if( this.debug ){
      window.hg = this.hg
      window.gameArg = GameArg
    }

    console.log("created gameState=", this.gameState, this.hg.grade)

    var params = {
      openid: 'oF9hV0SyZ6tI_k2WHtpRXqfedRH4'
    }
    const parsed = queryString.parse(location.search);
    var code = 'dppintu';
    var number = parsed.number;

    that.socketNameSpace = "/channel-dppintu-"+ number
    that.socket = io( that.socketNameSpace )
    console.log( "that.socketNameSpace = ", that.socketNameSpace, that.socket)
    that.socket.on('connect', () => {
      that.loading = false;
      console.log("socket.connect=",that.socket.connected); // true
      that.bindSocketEvents()
    });

    getGameResult(code,number,params).then(data => {
      console.log(data);
      this.gameInfo = data
      this.gameState = this.gameInfo['gameRound'].state
      this.game_player = this.gameInfo['gamePlayer']
      console.log('realname',this.game_player.realname);
      console.log(this.game_player.cellphone);
      console.log('gameResult--:',this.gameInfo['gameResult']!==null&&this.gameInfo['gameResult']!==undefined);

      if(this.gameState==1&&(this.game_player.realname==''||this.game_player.cellphone=='')){
        this.ui.unstarted = false
        this.ui.sign_up = true
      }else if (this.gameState==1&&(this.game_player.realname!==''||this.game_player.cellphone!=='')) {
        this.ui.unstarted = false
        this.ui.wait = true
      }else if(this.gameState==4){
        this.ui.unstarted = false
        this.ui.homeVisible = false
        that.ui.gameBoxVisible = true
      }
      // if(this.gameState==5||(this.gameInfo['gameResult']!==null&&this.gameInfo['gameResult']!==undefined)){
      //   console.log('5555555555555555');
      //   var r = this.gameInfo['ret']
      //   var arg = {
      //     isSuc: r.isSuc,
      //     gameScore: this.gameInfo['gamePlayer'].score,
      //     minScore: 0, //到多少分可以抽奖
      //     bestScore: r.score,
      //     gameType: gameType,
      //     rank: r.rank,
      //     beat: r.beat,
      //     isEqualDraw: false,
      //     bestCostTime: r.bestCostTime
      //   };
      //
      //   this.resultBoxParams = arg
      //   this.resultBoxCommand = "showResult"
      //   this.resultBoxVisible = true
      // }

    })
  },
  data() {
    return {
      debug: true,
      gameInfo:{},
      soundIconClass: "soundIconOff soundIcon",
      first_start: true,
      game_player: {},
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
        homeVisible: false, // 初始页面是否可见，游戏时需要隐藏
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
      console.log('bindSocketEvents...')
      var that = this
      that.socket.on('GameOpeningEvent', function(data){
        console.log('GameOpeningEvent');
				that.gameState = data.gameState
        that.resultBoxVisible = false
        console.log('===========gameState============:',that.gameState)
        if(that.gameState==1&&(that.game_player.realname==''||that.game_player.cellphone=='')){
          that.ui.unstarted = false
          that.ui.sign_up = true
        }else if (that.gameState==1&&(that.game_player.realname!==''||that.game_player.cellphone!=='')) {
          that.ui.unstarted = false
          that.ui.wait = true
        }
				console.log( 'GameOpeningEvent', data)
			});
      that.socket.on('GameStartingEvent', function(data){
        console.log('===========gameState============:',that.gameState)
				that.gameState = data.gameState
				that.timeToStart = data.timeToStart
				console.log( 'GameStartingEvent', data)
			});
			//绑定 游戏倒计时事件，游戏时间倒计时
			that.socket.on('GameRunningEvent', function(data){
        that.timeToEnd = data.timeToEnd

        console.log('first_start--:',that.first_start);
        if(that.first_start){
          that.first_start = false
          that.ui.wait = false
          that.gameState = 4
          that.ui.unstarted = false
          this.ui.homeVisible = false
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
				console.log( 'GameRunningEvent', data )
			});
			that.socket.on('GameEndEvent', function(data){
				that.gameState = 5
        that.ui.unstarted = true
        that.ui.homeVisible = false
        that.ui.gameBoxVisible = false
        that.resultBoxVisible = true
				console.log( 'GameEndEvent', data)
			});
  },
    post_msg: function () {
      console.log('post_msg');
      var realname = document.getElementById('name').value
      var tel = parseInt(document.getElementById('tel').value)

      const parsed = queryString.parse(location.search);
      var code = 'dppintu';
      var number = parsed.number;
      var data = {
        openid: this.game_player.openid,
        realname:realname,
        tel:tel
      }
      postMsg(code,number,data).then((res)=>{
        //console.log( 100000, res )
        this.ui.sign_up = false
        this.ui.unstarted = false
        this.ui.wait = true
        return res
      })
    },
    handleStartGame(event) {
      event.preventDefault()

      let that = this
      //点击开始按钮，开始游戏
      console.log(`handleStartGame=${this.gameState}`)

      // HdGame.tlog("startBtnAjax：", "调用了");
      this.activateSound();
      //HdGame.ajaxLoad.show();

      // $.Deferred('resolve')
      //   .then(checkAreaLimit)
      //   .then(checkGameState)
      //   .then(checkJoinNum)
      //   .then(checkLuckDrawAndBlack)
      //   .then(checkForcedAttention)
      //   .then(checkAccessKeyOnce)
      //   .then(beforeStartGame)
      //   .then(handleResult)
      //   .fail(handleFail);
      function showGame() {

        //$('.homeBtnBox,.bottomSkill').hide();
        //$('.footerBox').hide();
        that.ui.homeVisible = false
        that.ui.gameBoxVisible = true
        //$('.home, #ruleImg').hide();
        //$('.gameBox').show();
        let hg = that.hg
        if (typeof hg.sound.cache[0] !== 'undefined' && typeof hg.sound.cache[0].playing !== 'undefined' && !hg.sound.cache[0].playing) {
          hg.sound.readyPlay(0, 0, 'loop');
        }
      }


      // 无论是否显示游戏界面都需要调用的功能
      function complete(result) {
        //this.hideLoadToast();
        //HdGame.otherAjaxComplete();

        // if (callback) {
        //   callback.call(self, result, event, data, showGame);
        // }
      }
      // 不满足显示界面的条件
      function handleFail() {
        complete(false);
      }

      function handleResult() {
        function logs() {
          // HdGame.logDog(1000002, 22);
          // HdGame.LogFaiOpenId(1000230, 0);
          // HdGame.logObjDog(1000092, 1, 50);
        }

        function cookies() {
          // var cookOpt = {
          //   domain: 'hd.getstore.cn',
          //   expires: 1,
          //   path: '/'
          // };
          //$.cookie('gps_province', HdGame.encodeUrl(g_config.ipInfo.provice), cookOpt);
          //$.cookie('gps_city', HdGame.encodeUrl(g_config.ipInfo.city), cookOpt);
        }

        showGame();

        console.log('showGameBox: ' + that.hg.showGameBox);

        logs();

        //HdGame.addJoinGameBehavior();

        cookies();

        complete(true);

        //hg.fireWith('startGame', self, [false, event, data, showGame]);
      }

      Promise.resolve().then(() => {
        console.log(" then->handleResult")
        handleResult()
        this.gameState = 'start'
      }).catch((error) => {
        console.log(" catch->handleFail", error)
        handleFail()
      })

    },
    handleGameOver(event) {
      console.log('this.hg---:',this.hg);
      this.gameState = "over"
      this.gameOver(this.time)
    },
    handleGameRestart() {
      this.gameState = 'restart'
      this.resultBoxVisible = false
    },
    home() {
      //$('#ruleImg').show();
      //$('.homeBtnBox').show();
      //$('.footerBox').show();
      //$('.gameBox').hide();
      this.ui.gameBoxVisible = false
      this.startBtnDelay();
      this.ui.homeVisible = true

      this.resultBoxVisible = false
      //$('.home').show();
      //$('#poupInfoBox').hide();
      //$('.resuleBox').hide();
      this.gameState = 'initial'
      this.hg.fire('home');
    },
    startBtnDelay() {
      //$('.titleImg').removeClass('titleDown').addClass('titleDown');
      //$('#startBtnImg').removeClass('startTada');

      this.hg.sound.pauseAll();

      //setTimeout(function() {
      //  $('#startBtnImg').addClass('startTada');
      //}, 1000);
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
          // HdGame.resulePoup.show({
          //   isSuc: false,
          //   gameScore: "fail", //闯关失败
          //   minScore: 50,
          //   bestScore: '20',
          //   gameType: gameType,
          //   rank: 0,
          //   count: drawTimesLimit - count < 0 ? 0 : (drawTimesLimit - count),
          //   isLimitDrawTotal: isLimitDraw,
          //   totalCount: drawTotalLimit - totalCount < 0 ? 0 : (drawTotalLimit - totalCount)
          // });
        }, 900);
        return;
      }
      if (isNaN(_gameScore) || _gameScore < 0) {
        _gameScore = 0;
      }
      _gameScore = parseFloat(_gameScore).toFixed(2);

      //  if (gameType != 1 && HdGame.shouldRegInfo(infoType, arguments, this)) {

      //$('.ajaxLoadBg').show();
      //$('.ajaxLoadBar').addClass('ajaxLoad');
      this.showLoadToast('数据加载中');
      var _gameScoreStr = _gameScore + '';

      var info = {
        headImg: this.game_player.avatar
      };
      //g_config.awardUsername && (info.ausername = g_config.awardUsername);
      //g_config.awardPhone && (info.aphone = g_config.awardPhone);
      //g_config.awardAddress && (info.aadress = g_config.awardAddress);
      //info.ip = '60.20.175.68';
      var params = {
        gameId: 50,
        style: 22,
        achieve: HdGame.encodeBase64('"' + _gameScoreStr + '"') + "0jdk7Deh8T2z5W3k0j44dTZmdTOkZGM",
        openid: 'oF9hV0SyZ6tI_k2WHtpRXqfedRH4',
        // openId: this.game_player.openid,
        score:_gameScore
        //name: g_config.userName,
        //city_gps: typeof g_config.ipInfo.city != 'undefined' ? g_config.ipInfo.city : '',
        //province_gps: typeof g_config.ipInfo.provice != 'undefined' ? g_config.ipInfo.provice : ''
      };

      const parsed = queryString.parse(location.search);
      var code = 'dppintu';
      var number = parsed.number;

      console.log('code--:',code,'  number--:',number);

      params.info = JSON.stringify(info);

      Object.assign(params, option);

      console.log('params--:',params);

      setAchievebycode(code,number,params).then(data => {
        this.hideLoadToast();
        HdGame.tlog('gameOver', data);
        var r = data;
        var isShowPoup = true;

        if (r.rt == 0) {
          var arg = {
            isSuc: r.isSuc,
            gameScore: r.score,
            minScore: 0, //到多少分可以抽奖
            bestScore: r.bestScore,
            gameType: gameType,
            rank: r.rank,
            beat: r.beat,
            //count: drawTimesLimit - count < 0 ? 0 : (drawTimesLimit - count),
            //isLimitDrawTotal: isLimitDraw,
            //totalCount: drawTotalLimit - totalCount < 0 ? 0 : (drawTotalLimit - totalCount),
            isEqualDraw: false,
            //gameCostTime: consumption,
            bestCostTime: r.bestCostTime
          };

          g_config.playerId = r.playerId;

          //callBack && (isShowPoup = callBack(callBackArg, r));
          //$('#timeUpImg,.timeUpImg').removeClass('tada');
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
              //count: drawTimesLimit - count < 0 ? 0 : (drawTimesLimit - count),
              //isLimitDrawTotal: isLimitDraw,
              //totalCount: drawTotalLimit - totalCount < 0 ? 0 : (drawTotalLimit - totalCount),
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
      console.log("initBackgroundMusic->sound")
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

.dp-pintu {
  font-size: 14px;
}
</style>
