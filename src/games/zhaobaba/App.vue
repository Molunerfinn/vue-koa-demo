<template>
<div id="app">
  <div class="home" v-show="ui.homeVisible">
    <div id="homeBgBox">
      <img id="homeBg" :src="skinAssets.homeBgImg" />
    </div>
    <div class="gameInfoBox">
      <div class="titleImg imgContainer absCenter">
        <img id="titleImg" class="slaveImg abs" :src="skinAssets.titleImg" style="width:8.8rem;height:6.55rem;top:0.75rem;left:3.65rem;" />
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
      <img @touchend="handleStartGame" id="startBtnImg" class="slaveImg abs" :src="skinAssets.startBtnImg" style="width:7.35rem;height:2.25rem;top:16.55rem;left:4.6rem;" />
    </div>

  </div>

  <Game ref="game" :hg="hg" :command="gameState" @game-over="handleGameOver" v-show="ui.gameBoxVisible"> </Game>
  <LoadToast ref="load-toast" is-loading="loadToast.isLoading"> </LoadToast>
  <ResultBox ref="result-box" :home-callback="home" :again-callback="handleGameRestart" v-show="resultBoxVisible" :params="resultBoxParams" :command="resultBoxCommand"> </ResultBox>
  <RuleBox :ruleIconUrl="skinAssets.ruleIconPath" :game-round="gameRound" :command="ruleBoxCommand"> </RuleBox>
</div>
</template>

<script>
import Game from './game/Game.vue'
import GameRes from './game/GameRes'
import HdGame from '@/lib/hdgame'
import {
  setAchieve
} from '@/api/base'
import LoadToast from '@/components/LoadToast.vue'
import ResultBox from '@/components/ResultBox.vue'
import RuleBox from '@/components/RuleBox.vue'
import {
  GameBackgroundMusicLoadEvent
} from '@/lib/GameEvent'
import {
  EventBus
} from '@/lib/EventBus'

//import {simplifyLufylegend } from '@/lib/simplify'
//关于玩家的配置信息
const g_config = {
  scoreType: false,
  initTime: 10,
  ipInfo: {
    provice: null,
    city: null
  }
}

const gameType = 1; // 0抽奖， 1刷记录

export default {
  name: 'app',
  components: {
    Game,
    LoadToast,
    ResultBox,
    RuleBox
  },
  created() {
    this.hg.grade = new HdGame.Grade(0)

    this.hg.time = new HdGame.Time(g_config.initTime)

    EventBus.$on(GameBackgroundMusicLoadEvent.name, (event) => {
      this.initBackgroundMusic()
    })
    //simplifyLufylegend( this.hg, window.g_rem )
    HdGame.initJsHead(this.hg, GameRes)

    window.hg = this.hg

    console.log("created gameState", this.gameState, this.hg.grade, this.skinAssets)
  },
  data() {
    return {
      soundIconClass: "soundIconOff soundIcon",
      gamePlayer: {},
      gameRound: {},
      hg: {
        showGameBox: true
      },
      gameState: 'initial', // start, restart, over
      ui: {
        homeVisible: true, // 初始页面是否可见，游戏时需要隐藏
        gameBoxVisible: false, // 游戏页面
        loadToastVisible: false
      },
      skinAssets:{
        ruleIconPath: GameRes.skinAssets.ruleIconPath,
        homeBgImg: GameRes.skinAssets.homeBgPath,
        titleImg: GameRes.skinAssets.titleImgPath,
        startBtnImg: GameRes.skinAssets.startImgPath
      },
      loadToast: {
        isLoading: false,
        text: null
      },
      ruleBoxCommand: null,
      resultBoxVisible: false, //游戏结果页面
      resultBoxParams: {},
      resultBoxCommand: null
    }
  },
  methods: {
    handleStartGame(event) {
      event.preventDefault()

      let that = this
      that.ruleBoxCommand = 'hideIcon'
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
        console.log( 'fire startGame')
        that.hg.fire('startGame')
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
      this.gameState = "over"
      this.gameOver(this.hg.grade.val)
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

      //  if (gameType != 1 && HdGame.shouldRegInfo(infoType, arguments, this)) {

      //$('.ajaxLoadBg').show();
      //$('.ajaxLoadBar').addClass('ajaxLoad');
      this.showLoadToast('数据加载中');
      var _gameScoreStr = _gameScore + '';

      var info = {
        headImg: this.gamePlayer.avatar
      };
      //g_config.awardUsername && (info.ausername = g_config.awardUsername);
      //g_config.awardPhone && (info.aphone = g_config.awardPhone);
      //g_config.awardAddress && (info.aadress = g_config.awardAddress);
      //info.ip = '60.20.175.68';
      var params = {
        gameId: 50,
        style: 22,
        achieve: HdGame.encodeBase64('"' + _gameScoreStr + '"') + "0jdk7Deh8T2z5W3k0j44dTZmdTOkZGM",
        openId: this.gamePlayer.openid,
        //name: g_config.userName,
        //city_gps: typeof g_config.ipInfo.city != 'undefined' ? g_config.ipInfo.city : '',
        //province_gps: typeof g_config.ipInfo.provice != 'undefined' ? g_config.ipInfo.provice : ''
      };

      params.info = JSON.stringify(info);

      Object.assign(params, option);

      setAchieve(params).then(data => {
        this.hideLoadToast();
        HdGame.tlog('gameOver', data);
        var r = data;
        var isShowPoup = true;
        if (r.rt == 0) {
          var arg = {
            isSuc: r.isSuc,
            gameScore: _gameScoreStr,
            minScore: 0, //到多少分可以抽奖
            bestScore: r.score,
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
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

.kouhong {
  font-size: 14px;
}
</style>
