<template>
  <div id="app" :class="skinName">
    <div class="home" v-show="ui.homeVisible">

      <div id="homeBgBox">
        <img id="homeBg" :src="skinAssets.homeBgImg" />
      </div>
      <div class="gameInfoBox">
        <div class="titleImg imgContainer absCenter">
          <img id="titleImg" class="slaveImg abs" :src="skinAssets.titleImg" style="width:auto;height:9rem;top:11vh;left:15vw;"
          />
        </div>
      </div>

      <div id='joinNumLine'
           class='joinNumLine absCenter hide'
           style='top:23.424rem;left:3.3706666666666667rem;color:rgb(255,255,255);font-size:0.5546666666666666rem; text-shadow:rgb(255,62,7) -1px -1px 0px, rgb(255,62,7) 0px -1px 0px, rgb(255,62,7) 1px -1px 0px, rgb(255,62,7) 1px 0px 0px, rgb(255,62,7) 1px 1px 0px, rgb(255,62,7) 0px 1px 0px, rgb(255,62,7) -1px 1px 0px, rgb(255,62,7) -1px 0px 0px;'>
        已有 <span id='joinNum'
              class="specil"
              style="color:rgb(255,255,255);font-size:0.5546666666666666rem;text-shadow:rgb(255,62,7) -1px -1px 0px, rgb(255,62,7) 0px -1px 0px, rgb(255,62,7) 1px -1px 0px, rgb(255,62,7) 1px 0px 0px, rgb(255,62,7) 1px 1px 0px, rgb(255,62,7) 0px 1px 0px, rgb(255,62,7) -1px 1px 0px, rgb(255,62,7) -1px 0px 0px;">4346</span>      人参加活动
      </div>

      <div id="playInfo" class="abs editTarget-playInfo hide" style="width:9rem;text-align:center;">
        <div class="dayPlayHint">您今天还有 <span id="count" class="specil todayPlayCount"></span> 次参与机会</div>
        <div class="totalPlayHint">您还有 <span class="totalPlayCount specil"></span> 次参与机会</div>
        <div class="dayPlayHint4Total">今天有 <span class="count specil todayPlayCount"></span> 次</div>
      </div>
      <div id="startBtn" class="startBtn imgContainer absCenter" style="">
        <img  @touchend="handleStartGame"
             id="startBtnImg"
             class="slaveImg abs"
             :src="skinAssets.startBtnImg"
             style="width:7.35rem;height:2.25rem;top:75vh;left:4.6rem;" />
      </div>

      <div id="logoImgBox" class="logoImgBox imgContainer absCenter" style="">
        <img id="logoImg" class="slaveImg abs" :src="skinAssets.logoImgPath" style="width:auto;height:2.5rem;top:0.4rem;left:0.4rem;"
        />
      </div>
    </div>

    <Game ref="game"
          :hg="hg"
          :command="gameState"
          :dataList="dataList"
          :gamePlayer="gamePlayer"
          @game-over="handleGameOver"
          v-show="ui.gameBoxVisible"> </Game>
    <LoadToast ref="load-toast" is-loading="loadToast.isLoading"> </LoadToast>
    <ResultBox ref="result-box"
               @homeBtnClicked="home"
               @rankBtnClicked="getRank"
               @Restart="handleGameRestart"
               v-show="resultBoxVisible"
               :params="resultBoxParams"
               :command="resultBoxCommand"
               @commandDone="handleResetCommand"> </ResultBox>
    <RuleBox :ruleIconUrl="skinAssets.ruleIconPath"
             :game-round="gameRound"
             :game-player="gamePlayer"
             :params="resultBoxParams"
             :command="ruleBoxCommand"
             @commandDone="handleResetCommand"> </RuleBox>
    <MessageBox :msg="msg" :command="messageBoxCommand" @commandDone="handleResetCommand"> </MessageBox>
      <SignUp :game-player="gamePlayer" :gameRound="gameRound":command="signUpCommand" @signUpOver="signUpOver"> </SignUp>
  </div>

</template>

<script>
  import { gameSkinName } from '@/config/env'

  import Game from './game/Game.vue'
  import GameRes from './game/GameRes'
  import HdGame from '@/lib/hdgame'
  import weui from 'weui.js'
  import { setAchievebycode, postMsg, getGameResult, getRoundState } from '@/api/games/zhaobaba'
  import LoadToast from '@/components/LoadToast.vue'
  import MessageBox from '@/components/MessageBox.vue'
  import ResultBox from './ResultBox.vue'
  import RuleBox from './RuleBox.vue'
  import SignUp from '@/components/SignUp.vue'
  import { GameBackgroundMusicLoadEvent } from '@/lib/GameEvent'
  import { EventBus } from '@/lib/EventBus'
  import queryString from 'query-string'

  import  '@/assets/game/zhaobaba/skin.css'

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
  const gameType = 1 // 0抽奖， 1刷记录

  export default {
    name: 'app',
    components: {
      Game,
      LoadToast,
      ResultBox,
      RuleBox,
      MessageBox,
      SignUp
    },
    created() {
      this.hg.grade = new HdGame.Grade(0)

      this.hg.time = new HdGame.Time(g_config.initTime)

      EventBus.$on(GameBackgroundMusicLoadEvent.name, event => {
        this.initBackgroundMusic()
      })
      //simplifyLufylegend( this.hg, window.g_rem )
      HdGame.initJsHead(this.hg, GameRes)

      window.hg = this.hg

      const parsed = queryString.parse(location.search)
      var number = parsed.number

      var params = {
        parsed: parsed
      }

      getGameResult(number, params).then(data => {
        this.gameInfo = data
        console.log('getGameResult------:', data)
        this.gameRound = this.gameInfo['gameRound']
        this.gameState = this.gameRound.state
        this.gamePlayer = this.gameInfo['gamePlayer']
        this.dataList = this.gameRound.dataList

        if (this.gamePlayer.token == undefined) {
          this.ruleBoxCommand = 'hideIcon'
          this.ui.homeVisible = false
          this.ui.unstarted = false
          this.signUpCommand = 'show'
        } else if (this.gamePlayer.token !== undefined) {
          this.ruleBoxCommand = 'showIcon'
          this.ui.homeVisible = true
        }

        let wxConfig = this.gameInfo['wxConfig']
        console.log('App wxConfig=======:', wxConfig)
        if (wxConfig) {
          HdGame.initWxConfig(wxConfig)

          let wxShareArg = {
            title: this.gameRound.name,
            desc: '请点击查看详情...',
            link: wxConfig.shareUrl,
            imgUrl: process.env.GAME_HOST + this.skinAssets.shareImgPath
          }
          HdGame.setWxShare(wxShareArg)
        }

        document.title = this.gameRound.name
      })
    },
    data() {
      return {
        skinName: 'skin-' + gameSkinName,
        soundIconClass: 'soundIconOff soundIcon',
        dataList: [],
        msg: '',
        canPlay: true,
        gamePlayerRank: [],
        gamePlayer: {},
        gameRound: {},
        hg: {
          showGameBox: true
        },
        gameState: 'initial', // start, restart, over
        ui: {
          homeVisible: true, // 初始页面是否可见，游戏时需要隐藏
          gameBoxVisible: false, // 游戏页面
          loadToastVisible: false,
          MessageBoxVisible: false
        },
        skinAssets: {
          logoImgPath: GameRes.skinAssets.logoImgPath,
          shareImgPath: GameRes.skinAssets.shareImgPath, // weixin share image
          ruleIconPath: GameRes.skinAssets.ruleIconPath,
          homeBgImg: GameRes.skinAssets.homeBgPath,
          titleImg: GameRes.skinAssets.titleImgPath,
          startBtnImg: GameRes.skinAssets.startImgPath
        },
        loadToast: {
          isLoading: false,
          text: null
        },
        signUpCommand: null,
        ruleBoxCommand: null,
        resultBoxVisible: false, //游戏结果页面
        resultBoxParams: {},
        resultBoxCommand: null,
        messageBoxCommand: null
      }
    },
    methods: {
      post_msg: function() {
        console.log('========post_msg========')
        var msg_is_ok = true
        var realname = document.getElementById('name').value
        var tel = parseInt(document.getElementById('tel').value)

        if (realname == '') {
          weui.form.showErrorTips({
            ele: document.getElementById('name'),
            msg: '姓名不能为空'
          })
          msg_is_ok = false
        }

        var tel0 = /^1\d{10}$/
        var ema = document.getElementById('tel').value
        if (tel0.test(ema) == false) {
          weui.form.showErrorTips({
            ele: document.getElementById('tel'),
            msg: '电话格式错误'
          })
          msg_is_ok = false
        }
        if (msg_is_ok) {
          const parsed = queryString.parse(location.search)
          var number = parsed.number
          var data = {
            gamePlayer: this.gamePlayer,
            realname: realname,
            tel: tel
          }
          postMsg(number, data).then(res => {
            this.gamePlayer = res
            this.signUpCommand = 'hide'
            this.ui.homeVisible = true
            return res
          })
          let that = this
          that.ruleBoxCommand = 'showIcon'
        }
      },
      async handleStartGame(event) {
        event.preventDefault()
        const parsed = queryString.parse(location.search)
        var number = parsed.number

        var data = {
          number: number
        }
        let that = this
        await getRoundState(number, data).then(res => {
          this.gameRound = res
          console.log('gameRound.state---:', this.gameRound.state)
          if (this.gameRound.state == 'created') {
            this.messageBoxCommand = 'show'
            this.msg = '游戏尚未开始，请耐心等待'
            that.canPlay = false
          } else if (this.gameRound.state == 'completed') {
            this.messageBoxCommand = 'show'
            this.msg = '游戏已经结束，谢谢您的关注'
            that.canPlay = false
          } else if (this.gameRound.state == 'started') {
            that.canPlay = true
          }
          console.log('this.canPlay', this.canPlay)
        })

        //点击开始按钮，开始游戏
        console.log(`handleStartGame=${this.gameState}`)
        this.activateSound()
        function showGame() {
          that.ruleBoxCommand = 'hideIcon'
          that.ui.homeVisible = false
          that.ui.gameBoxVisible = true
          let hg = that.hg
          if (
            typeof hg.sound.cache[0] !== 'undefined' &&
            typeof hg.sound.cache[0].playing !== 'undefined' &&
            !hg.sound.cache[0].playing
          ) {
            hg.sound.readyPlay(0, 0, 'loop')
          }
        }

        // 无论是否显示游戏界面都需要调用的功能
        function complete(result) {}
        // 不满足显示界面的条件
        function handleFail() {
          complete(false)
        }

        function handleResult() {
          function logs() {}
          function cookies() {}
          if (that.canPlay == true) {
            showGame()
          }
          console.log('showGameBox: ' + that.hg.showGameBox)
          logs()
          cookies()

          complete(true)
          console.log('fire startGame')
          that.hg.fire('startGame')
        }

        Promise.resolve()
          .then(() => {
            console.log(' then->handleResult')
            handleResult()
            this.gameState = 'start'
          })
          .catch(error => {
            console.log(' catch->handleFail', error)
            handleFail()
          })
      },
      handleGameOver(event) {
        this.gameState = 'over'
        this.gameOver(this.hg.grade.val)
      },
      handleGameRestart() {
        this.gameState = 'restart'
        this.resultBoxVisible = false
      },
      // rulebox 处理完命令以后，需要重置，以便下次使用同样命令时也可以触发
      handleResetCommand() {
        this.ruleBoxCommand = null
        this.messageBoxCommand = null
        this.resultBoxCommand = null
      },
      //
      getRank(event) {
        console.log('App - getRank ')
        this.ruleBoxCommand = 'showRank'
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
      home() {
        //$('#ruleImg').show();
        //$('.homeBtnBox').show();
        //$('.footerBox').show();
        //$('.gameBox').hide();
        this.ui.gameBoxVisible = false
        this.startBtnDelay()
        this.ui.homeVisible = true

        this.resultBoxVisible = false
        //$('.home').show();
        //$('#poupInfoBox').hide();
        //$('.resuleBox').hide();
        this.gameState = 'initial'
        this.ruleBoxCommand = 'showIcon'
        this.hg.fire('home')
      },
      startBtnDelay() {
        //$('.titleImg').removeClass('titleDown').addClass('titleDown');
        //$('#startBtnImg').removeClass('startTada');

        this.hg.sound.pauseAll()

        //setTimeout(function() {
        //  $('#startBtnImg').addClass('startTada');
        //}, 1000);
      },
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
      // 游戏结束，设置游戏成绩
      gameOver(_gameScore, callBack, option, showAjaxBar) {
        console.log('_gameScore-----:', _gameScore)
        if (_gameScore === 'fail') {
          setTimeout(function() {}, 900)
          return
        }
        if (isNaN(_gameScore) || _gameScore < 0) {
          _gameScore = 0
        }
        this.showLoadToast('数据加载中')
        var _gameScoreStr = _gameScore + ''

        var info = {
          headImg: this.gamePlayer.avatar
        }
        const parsed = queryString.parse(location.search)

        var params = {
          openId: this.gamePlayer.openid,
          score: _gameScoreStr,
          parsed: parsed
        }

        params.info = JSON.stringify(info)

        Object.assign(params, option)
        var number = parsed.number

        console.log('params----:', params)
        setAchievebycode(number, params)
          .then(data => {
            this.hideLoadToast()
            HdGame.tlog('gameOver', data)
            var r = data
            var isShowPoup = true
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
              }
              console.log('arg=========:',arg);

              g_config.playerId = r.playerId
              this.resultBoxParams = arg
              this.resultBoxCommand = 'showResult'
              this.resultBoxVisible = true
              g_config.achieveToken = r.achieveToken
            } else if (r.rt == 11) {
              alert('已被检测到有作弊行为，再次被检测将永久禁止参与本游戏！')
            } else if (r.rt == 12) {
              alert('由于作弊行为，该微信号已永久禁止参与本游戏！')
            } else if (r.rt == 23) {
              //活动已经结束
              HdGame.statusMsg(3)
            } else if (r.rt == 44) {
              HdGame.statusMsg(8)
            } else {
              callBack &&
                (isShowPoup = callBack(
                  {
                    rt: r.rt,
                    msg: r.msg
                  },
                  r
                ))
              if (isShowPoup !== false) {
                HdGame.logStd(
                  'gameOverErr',
                  'style=' + g_config.style + ' gameScore=' + _gameScore + ' faiOpenId=tryPlay_12435152 data=' + data
                )
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
                })
              }
              return
            }
            if (r.rt !== 0) {
              callBack &&
                callBack(
                  {
                    rt: r.rt,
                    msg: r.msg
                  },
                  r
                )
            }
          })
          .catch(err => {
            this.hideLoadToast()
            HdGame.otherAjaxComplete()
            var rt = {
              rt: -999,
              msg: 'ajax返回错误'
            }
            if (!window.navigator.onLine) {
              rt.msg = '网络连接失败，请检查你的网络设置!'
            }
            if (callBack) {
              if (callBack(rt, rt)) {
                alert(rt.msg)
              }
            } else {
              alert(rt.msg)
            }
            HdGame.tlog('gameOverErr', JSON.stringify(arguments))
          })

        params = info = option = null
      },
      initBackgroundMusic() {
        console.log('initBackgroundMusic->sound')
      },

      showLoadToast(text) {
        this.loadToast.isLoading = true
        this.loadToast.text = text
      },
      hideLoadToast() {
        this.loadToast.isLoading = false
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
  #headImg{
        border-radius: 100%;
        width: 20%;
        height: auto;
  }


  .kouhong {
    font-size: 14px;
  }

</style>
