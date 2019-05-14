<template>
<div class="gameBox gameBgBox">
  <div id="gameBgBox">
    <img id="gameBg" :src="gameBg" style="width:100%;height:auto;" />
  </div>

  <div id="gameTopBar" class="gameTopBar" style="color:;background-color:">
    <div class="userInfoBox">
      <div class="userImgBox" style="border-color:"><img :src="gamePlayer.avatar" class="userImg" /></div>

      <div id="grade" class="grade">0</div>

    </div>
    <div class="timeBox">
      时间<br><span class="time">0</span>
    </div>
  </div>
  <div id="gameLayerBox" class="editTarget-wrap" @touchstart="handleTouchStart">

  </div>
  <div class="timeUpImg hide"></div>
  <div :class="[{ soundIconOff: soundoff }, 'soundIcon']" style="z-index:700" @touchstart="handlePlaySound"></div>

</div>
</template>

<script>
import $ from 'jquery'

import {
  LInit
} from '@/lib/lufylegend/utils/Function'
import LGlobal from '@/lib/lufylegend/utils/LGlobal'
import LSprite from '@/lib/lufylegend/display/LSprite'
import LBitmap from '@/lib/lufylegend/display/LBitmap'
import LBitmapData from '@/lib/lufylegend/display/LBitmapData'
import LEvent from '@/lib/lufylegend/events/LEvent'
import LTweenLite from '@/lib/lufylegend/transitions/LTweenLite'
//import LStageScaleMode from '@/lib/lufylegend/display/LStageScaleMode';

import {
  setGameTopBar,
  showTopBar,
  LGuide
} from '@/lib/simplify'

var _gameOver = false;

import GameRes from './GameRes'
import HdGame from '@/lib/hdgame'
import {
  GameArg
} from './GameArg'


//LGlobal.setDebug(true);
//LGlobal.displayState = LGlobal.FULL_SCREEN
//LGlobal.width = 640;
//LGlobal.height = LGlobal.width * window.innerHeight / window.innerWidth;

//LInit(50, 'legend', LGlobal.width, LGlobal.height, main);

// eventBus
import {
  GameScoreChangedEvent
} from '@/lib/GameEvent'

const _ruleInfo = {}

export default {
  name: 'game',
  props: {
    dataList: {
      type: Array,
      default:[]
    },
    // hg, 保存游戏的所有资源，图片，音乐，时间，分数
    hg: Object,
    // 游戏初始化的状态
    command: {
      type: [String, Number],
      default: 0
    },
    gamePlayer: {
      type: Object,
      default: { avatar: '/static/shared/image/avatar.jpg' }
    }
  },
  data() {

    return {
      thief: [],
      rowArray: [],
      gameBg: null,
      imgData: null,
      game_player: {
        type: Object,
        default: { avatar: '/static/shared/image/avatar.jpg' }
      },
      ui: {
        gameBoxVisible: false
      },
      soundoff: true,
      rem: 20
    }
  },
  created() {
    this.rem = window.g_rem
  },
  mounted() {
    console.log("mounted props=", this.hg, this.command)
    this.handleInitGameData()

    this.hg.assets.onReady(() => {

      console.log(" hg.assets.onReady 1")
      this.gameBg = GameRes.skinAssets.gameBgPath

    });


    GameArg.eventBus.$on(GameScoreChangedEvent.name, (event) => {
      this.hg.grade.inc(10);
      console.log("GameScoreChangedEvent0")
      this.hg.sound.play(1);
      console.log("GameScoreChangedEvent1")
    })

    this.hg.time.on('setTime', (e) => {
      console.log("setTime", e)
    })
    this.hg.time.on('end', this.endGame)


    this.hg.sound.get("0",
       (lsound)=> {
        lsound.on("play", () => {
          console.log( "sound on play")
          this.soundoff = false

        }).on("pause", () => {
          console.log( "sound on pause")
          this.soundoff = true
        })
    })
    // document.ready
    //var bgHeight = $(window).height()<504?504:$(window).height();
    //$('#gameBgBox').css('height',bgHeight);
    GameArg.blockSize = ~~($(window).width() / 4);
    GameArg.gameBoxtop = 0;//~~(5*g_rem);
    GameArg.hem = ~~($(window).height() - GameArg.gameBoxtop);
    GameArg.row = Math.ceil(GameArg.hem/GameArg.blockSize);
    console.log( " GameArg = ", GameArg)
    //$("#gameLayerBox").css('top',GameArg.gameBoxtop).on("touchstart",function(e){e.preventDefault();e.stopPropagation()});

  },
  methods: {

    handleStartGame() {
      if (GameArg.firstTouch) {
        this.initCanvas();
        GameArg.firstTouch = false;
      } else {
        this.startGame();
      }

      //this.hg.sound.play("startButton")
      // hg.sound.get("0",
      // function(sound) {
      //   if (g_config.style != 51 && g_config.style != 49 && g_config.style != 9 && g_config.style != 48 && g_config.style != 57 && g_config.style != 62 && g_config.style != 58 && g_config.style != 65 && g_config.style != 69) {
      //     if (g_config.style == 27 && !HdGame.getLocalStorage(soundPauseCord)) {
      //       hg.sound.allowPlay = true
      //     }
      //     hg.sound.readyPlay(0, 0, "loop")
      //   }
      // })
    },

    handleRestartGame() {

      this.handleInitGameData();
      this.startGame();
      this.hg.fire('again');

    },

    handleInitGameData() {
      this.hg.time.init();
      this.hg.grade.set(0);
      //$('.timeUpImg').hide();
      _gameOver = false;
    },
    handlePlaySound( event ){
      var soundPauseCord = "soundPause|" + this.gamePlayer.game_round_id + "|" + this.gamePlayer.openId;

      console.log( "handlePlaySound", (new Date()).getTime())
      event.stopPropagation();
      event.preventDefault();
      if ( !this.soundoff ) {
        this.hg.sound.allowPlay = false;
        this.hg.sound.pauseAll();
        HdGame.setLocalStorage(soundPauseCord, "-")
      } else {
        this.hg.sound.allowPlay = true;
        this.hg.sound.readyPlay(0, 0, "loop");
        HdGame.removeLocalStorage(soundPauseCord)
      }
    },
    initGame() {
      //初始化游戏头部 头像，计时，分数
      setGameTopBar('#gameTopBar', this.hg)
      let images = [GameRes.skinAssets.baba0, GameRes.skinAssets.baba2,GameRes.skinAssets.baba3, GameRes.skinAssets.baba1 ]

      GameArg.layer = new LSprite(true);
      GameArg.pLayer = new LSprite();
      GameArg.gLayer = new LSprite();
      GameArg.layer.addChild(GameArg.pLayer);
      GameArg.layer.addChild(GameArg.gLayer);
      var maskObj = new LSprite();
      maskObj.graphics.drawRect(0, "", [0, 5 * this.rem, LGlobal.width, LGlobal.height - 5 * this.rem]);
      GameArg.layer.mask = maskObj
      GameArg.imageArray = images.map( (imgPath) => {
        return {
          img: new LBitmapData(this.hg.assets[imgPath])
        }
      })
      GameArg.imageArray.map(function (tem, index) {
        var w = tem.img.width;
        var h = tem.img.height;
        var theSize = HdGame.Img.calcSize(w, h, GameArg.blockSize, GameArg.blockSize, HdGame.Img.MODE_SCALE_DEFLATE_FILL);
        w = theSize.width;
        h = theSize.height;
        tem.w = w;
        tem.h = h;
        tem.l = (GameArg.blockSize - w) / 2;
        tem.t = (GameArg.blockSize - h) / 2;
      })
      LGlobal.canvasObj.addEventListener('touchstart', this.touchItems, false);
      GameArg.speed = GameArg.blockSize / 200;
      GameArg.layer.addEventListener(LEvent.ENTER_FRAME,  ()=> {
        if (_gameOver) {
          return;
        }
        var dy = this.hg.grade.val * GameArg.blockSize - GameArg.layer.y;
        if (dy > 0) {
          console.log( "LGlobal.delta= ", LGlobal.delta)
          GameArg.layer.y += GameArg.speed * LGlobal.delta;
        }
        this.hg.time.updateInFrame( 60);
        showTopBar()
      })
      this.startGame()

    },

    endGame() {
       _gameOver = true
      GameArg.gameFirstTouch = true
      LGlobal.setPauseLoop(true)
      this.$emit("game-over")
    },

    startGame() {
      //HdGame.getGameRule(function (r) {
        //{"rt":0,"success":true,"data":{"info":"{\"startTime\":1556352658970,\"rule\":{\"initTime\":10,\"dataList\":[3,0,3,3,0,3,0,0,3,0,0,2,2,3,3,3,1,0,2,0,3,2,3,2,3,1,2,3,2,3,3,2,1,2,0,1,1,3,0,1,1,1,1,3,2,3,0,1,3,3]}}","sign":"fd13d281aea78ba1294d582205866771"},"msg":"操作成功"}
        GameArg.dataList = this.dataList
        console.log('dataList------:',this.dataList);
        GameArg.dataList.uid = 0;
        _ruleInfo.list = '';

        if (!HdGame.isplaySucess) {
          GameArg.guideRows = 0;
        }
        GameArg.step = 0;
        window.scrollTo(0, 0);
        LGlobal.setPauseLoop(false)

        GameArg.pLayer.removeAllChild();
        GameArg.gLayer.removeAllChild();
        LTweenLite.removeAll();
        GameArg.layer.y = 0;
        this.thief = [];
        this.rowArray = [];
        for (var i = 0; i < GameArg.row; i++) {
          if (i === 0) {
            this.addRow(true);
          } else {
            this.addRow();
            if (i === 1 && GameArg.guideRows === 0) {
              GameArg.guide = new LGuide({
                x: this.thief[0].x + GameArg.imageArray[0].l,
                y: this.thief[0].y + GameArg.imageArray[0].t,
                w: GameArg.imageArray[0].w,
                h: GameArg.imageArray[0].h
              }).play();
              console.log( " GameArg.guide =", GameArg.guide)
              GameArg.gLayer.addChild(GameArg.guide);
            }
          }
        }
      //});

    },

    initCanvas() {
      LGlobal.notMouseEvent = true;
      //console.log( " LGlobal.width, LGlobal.height",  LGlobal.width, LGlobal.height, " window.innerWidth, window.innerHeight", window.innerWidth, window.innerHeight)
      //LInit(50, 'gameLayerBox', LGlobal.width, LGlobal.height, this.initGame);
      LInit(0, "gameLayerBox", window.innerWidth, window.innerHeight, this.initGame, LEvent.INIT);
      console.log(" LGlobal.width, LGlobal.height", LGlobal.width, LGlobal.height, " window.innerWidth, window.innerHeight", window.innerWidth, window.innerHeight)
      LGlobal.resize(window.innerWidth, window.innerHeight);
    },

    addRow(flag) {
      var index;
      var dataList = GameArg.dataList;
      // n 第n个为爸爸， -1表示没有
      var n = flag ? -1 : dataList[dataList.uid % dataList.length];
      var arr = [];
      GameArg.step++;
      var y = GameArg.hem - GameArg.blockSize * GameArg.step;
      for (var j = 0; j < 4; j++) {
        if (n === j) {
          index = 0;
        } else {
          index = this.GetRandomNum(1, 4);
        }
        if (index < 3) {
          var info = GameArg.imageArray[index];
          var bmd = info.img;
          var x = GameArg.blockSize * j;
          var bm = new LBitmap(bmd, x + info.l, y + info.t, info.w, info.h);
          if (index === 0) {
            this.thief.push({
              uid: dataList.uid++,
              x: x,
              y: y,
              parent: arr,
              bottom: y + GameArg.blockSize,
            });
          }
          GameArg.pLayer.addChild(bm);
          arr.push(bm);
        }
      }
      arr.y = y;
      this.rowArray.push(arr);
    },
    // 显示游戏开始前提示动画

    touchItems(e) {
      console.log( "touchItems", 1)
      if (_gameOver) {
        return false;
      }
      var touch = e.targetTouches[0];
      var x = touch.pageX;
      var y = touch.pageY - GameArg.gameBoxtop;
      var t = this.thief[0];
      if ( (y >= GameArg.layer.y + t.y - GameArg.blockSize * 0.5) &&
           (y <= GameArg.layer.y + t.y + GameArg.blockSize * 1.5) &&
           (x >= t.x ) &&
           (x <= t.x + GameArg.blockSize)) {
        console.log( "touchItems", 3)
        // 如果选择正确
        _ruleInfo.list += (_ruleInfo.list ? ',' : '') + t.uid + ',' + this.toFixed2(x / GameArg.blockSize);
        if (GameArg.gameFirstTouch) {
          GameArg.gameFirstTouch = false;
          this.hg.time.start();
        }
        if (GameArg.guideRows <= 3) {
          GameArg.guideRows++;
          GameArg.guide.change({
            x: this.thief[1].x + GameArg.imageArray[0].l,
            y: this.thief[1].y + GameArg.imageArray[0].t
          }).play();
        } else if (GameArg.guideRows === 4) {
          GameArg.guide.stop();
          GameArg.guide.die();
          GameArg.guide.remove();
          GameArg.guideRows++;
        }
        this.removeLayer();
        this.hg.sound.play(1);
      } else if (GameArg.guideRows > 4) {
        this.hg.sound.play(2);
        this.hg.time.end();
        var bmd = new LBitmapData("#f00000");
        var dy = y - GameArg.layer.y;
        var bm = new LBitmap(bmd, x - x % GameArg.blockSize, dy + (GameArg.hem - dy) % GameArg.blockSize - GameArg.blockSize, GameArg.blockSize, GameArg.blockSize);
        GameArg.pLayer.addChild(bm);
        LTweenLite.to(bm, 0.2, {
            alpha: 0
          })
          .to(bm, 0.1, {
            alpha: 1
          })
          .to(bm, 0.1, {
            alpha: 0
          })
          .to(bm, 0.1, {
            alpha: 1
          })
          .to(bm, 0.1, {
            alpha: 0
          })
          .to(bm, 0.1, {
            alpha: 1
          })
          .to(bm, 0.1, {
            alpha: 0
          })
          .to(bm, 0.1, {
            alpha: 1,
            onComplete:  () =>{
              this.endGame()
              //gameOver(this.hg.grade.val);
              return;
            }
          });
      }
    },

    //
    removeLayer() {
      this.hg.grade.inc(1);
      var crrThief = this.thief.shift(); // 找到当前行的爸爸
      // 取得爱心图片
      var bm = new LBitmap(GameArg.imageArray[3].img, crrThief.x + GameArg.imageArray[3].l, crrThief.y + GameArg.imageArray[3].t, GameArg.imageArray[3].w, GameArg.imageArray[3].h);
      GameArg.pLayer.addChild(bm);
      crrThief.parent.push(bm);
      bm = null;
      crrThief = null;
      console.log( "removeLayer", " this.rowArray[0] ", this.rowArray[0], GameArg.layer.y + this.rowArray[0].y)
      if (this.rowArray[0] && GameArg.layer.y + this.rowArray[0].y > GameArg.hem) {
        this.rowArray.shift().forEach((bm, i)=>{
            bm && bm.remove()
        })
      }
      this.addRow();
    },
    // 禁止对屏幕的touch
    handleTouchStart( e ){
      //e.preventDefault()
      //e.stopPropagation()
    },

    GetRandomNum(a, b) {
      return a + Math.floor(Math.random() * (b - a + 1));
    },

    GetRandom(a, b) {
      return a + Math.random() * (b - a);
    },

    toFixed2(num) {
      num = parseFloat(num.toFixed(2));
      return (num === num ? num : 0) + '';
    },
    scale(x, y) {
      return x / y;
    }



  },
  watch: {
    command: function (val, oldVal) {
      //外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if (val == 'start') {
        this.handleStartGame()
      }
      if (val == 'restart') {
        this.handleRestartGame()
      }
      if (val == 'initial') {
        this.handleInitGameData()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
