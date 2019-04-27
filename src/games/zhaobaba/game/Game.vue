<template>
<div class="gameBox gameBgBox">
  <div id="gameBgBox">
    <img id="gameBg" :src="gameBg" style="width:100%;height:auto;" />
  </div>

  <div id="gameTopBar" class="gameTopBar" style="color:;background-color:">
    <div class="userInfoBox">
      <div class="userImgBox" style="border-color:"><img :src="game_player.avatar" class="userImg" /></div>

      <div id="grade" class="grade">0</div>

    </div>
    <div class="timeBox">
      时间<br><span class="time">0</span>
    </div>
  </div>
  <div id="gameLayerBox" class="editTarget-wrap">

  </div>
  <div class="timeUpImg hide"></div>
  <div class="soundIconOff soundIcon" style="z-index:700"></div>

</div>
</template>

<script>
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
const _resRoot = '/static/kouhong'

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
  GameEndEvent,
  GameScoreChangedEvent
} from '@/lib/GameEvent'

var game_assets = [
  "http://7020498.h40.faiusr.com/4/ACgIABAEGAAgjeaCsQUomKbfRTCWATigAQ.png",
  "http://7020498.h40.faiusr.com/4/ACgIABAEGAAgnOaCsQUorbL-_QEwlgE4oAE.png",
  "http://7020498.h40.faiusr.com/4/ACgIABAEGAAgmOaCsQUolfa4wQUwlgE4oAE.png",
  "http://7020498.h40.faiusr.com/4/ACgIABAEGAAgmuaCsQUo_IqD-gMwlgE4oAE.png"
]
const _ruleInfo = {}


export default {
  name: 'game',
  props: {
    // hg, 保存游戏的所有资源，图片，音乐，时间，分数
    hg: Object,
    // 游戏初始化的状态
    command: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      thief: [],
      rowArray: [],
      gameBg: require('@/assets/kouhong/image/skin1/wx/ACgIABACGAAg3fDr4AUojqC25gYwgAU4wAw.jpg'),
      imgData: null,
      game_player: {},
      ui: {
        gameBoxVisible: false
      },
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
      console.log(" this.hg.edit = ", this.hg.edit)
      let clubInfo = this.hg.edit.getImgInfo('club', true);
      console.log(" hg.assets.onReady clubInfo", clubInfo, "this.hg.assets[clubInfo.path]", this.hg.assets[clubInfo.path])
      this.clubImg = new LBitmapData(this.hg.assets[clubInfo.path]);

      GameArg.clubH = GameArg.lollyH = clubInfo.height;
      GameArg.lollyW = clubInfo.width;
      GameArg.lollyY = clubInfo.top;
      GameArg.launchY = 10.625 + GameArg.lollyY;
      GameArg.clubH = GameArg.lollyH = clubInfo.height;
      GameArg.minRotate = Math.atan((GameArg.lollyW / 2) / (GameArg.lollyH + GameArg.lollyY)) * 180 * 2 / Math.PI + 0.5;
      console.log(" hg.assets.onReady 1")

    });

    this.hg.assets.onReady(() => {
      let ySugar = this.hg.edit.getImgInfo('ySugar')
      console.log("this.hg.assets=", this.hg.assets)
      console.log(" hg.assets.onReady ySugar", ySugar, "this.hg.assets[ySugar.path]", this.hg.assets[ySugar.path])

      this.imgData = new LBitmapData(this.hg.assets[ySugar.path]);
      this.sugarYsize = HdGame.getPosAndSize(this.imgData, {
        width: 6 * this.rem,
        height: 6 * this.rem
      });
    });

    GameArg.eventBus.$on(GameEndEvent.name, (event) => {
      console.log("GameEndEvent0")
      this.hg.sound.play(2);
      this.hg.time.end();
      this.endGame(event.target); //lolly
      console.log("GameEndEvent1")
    })


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
      function (lsound) {
        lsound.on("play", () => {
          this.soundIconClass = "soundIcon"

        }).on("pause", () => {
          this.soundIconClass = "soundIconOff soundIcon"
        })
      })
  },
  methods: {
    handleStartGame() {
      if (GameArg.first) {
        this.initCanvas();
        GameArg.first = false;
      } else {
        this.startGame();
      }

      // hg.sound.play("startButton")
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
      console.log("handleInitGameData hg.time", this.hg.time)
      this.hg.grade.set(0);
      //$('.timeUpImg').hide();
    },

    initGame() {
      //初始化游戏头部 头像，计时，分数
      setGameTopBar('#gameTopBar', this.hg)

      GameArg.left = parseInt(0.5 * this.rem);
      GameArg.top = parseInt(4 * this.rem);

      LGlobal.canvasObj.addEventListener('touchstart', this.canvasDown, false);
      LGlobal.canvasObj.addEventListener('touchmove', this.canvasMove, false);
      //LGlobal.canvasObj.addEventListener('touchend', function(){ console.log("LGlobal.canvasObj->touchend")}, false);
      GameArg.stageLayer = new LSprite(true);

      this.startGame();


      GameArg.layer = new LSprite(true);
      GameArg.pLayer = new LSprite();
      GameArg.gLayer = new LSprite();
      GameArg.layer.addChild(GameArg.pLayer);
      GameArg.layer.addChild(GameArg.gLayer);
      var maskObj = new LSprite();
      maskObj.graphics.drawRect(0, "", [0, 5 * this.rem, LGlobal.width, LGlobal.height - 5 * this.rem]);
      GameArg.layer.mask = maskObj
      GameArg.imageArray = [0, 2, 3, 1].map(function (i) {
        return {
          img: new LBitmapData(this.hg.assets[game_assets[i]])
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
      GameArg.isOne = false;
      LGlobal.canvasObj.addEventListener('touchstart', this.touchItems, false);
      GameArg.speed = GameArg.blockSize / 200;
      GameArg.layer.addEventListener(LEvent.ENTER_FRAME, function () {
        if (_gameOver) {
          return;
        }
        var dy = this.hg.grade.val * GameArg.blockSize - GameArg.layer.y;
        if (dy > 0) {
          GameArg.layer.y += GameArg.speed * LGlobal.delta;
        }
      })
      this.startGame()

    },

    endGame(lolly) {
      _gameOver = true;
      LTweenLite.removeAll();
      if (lolly) {
        LTweenLite.to(lolly, 0.1, {
            alpha: 0
          })
          .to(lolly, 0.1, {
            alpha: 1
          })
          .to(lolly, 0.1, {
            alpha: 0
          })
          .to(lolly, 0.1, {
            alpha: 1
          })
          .to(lolly, 0.1, {
            alpha: 0
          })
          .to(lolly, 0.1, {
            alpha: 1
          })
          .to(lolly, 0.1, {
            alpha: 0
          })
          .to(lolly, 0.1, {
            alpha: 1,
            onComplete: () => {
              LGlobal.setPauseLoop(true);
              this.endClear();
              this.$emit("game-over")
              //this.gameOver(this.hg.grade.val);
            }
          });
      } else {
        LGlobal.setPauseLoop(true);
        this.endClear();
        this.$emit("game-over")
      }
    },

    endClear() {
      setTimeout(function () {
        LGlobal.canvas.clearRect(0, 0, LGlobal.width + 1, LGlobal.height + 1);
      }, 400);
    },
    startGame() {
      //HdGame.getGameRule(function (r) {
        //{"rt":0,"success":true,"data":{"info":"{\"startTime\":1556352658970,\"rule\":{\"initTime\":10,\"dataList\":[3,0,3,3,0,3,0,0,3,0,0,2,2,3,3,3,1,0,2,0,3,2,3,2,3,1,2,3,2,3,3,2,1,2,0,1,1,3,0,1,1,1,1,3,2,3,0,1,3,3]}}","sign":"fd13d281aea78ba1294d582205866771"},"msg":"操作成功"}
        GameArg.dataList = [3,0,3,3,0,3,0,0,3,0,0,2,2,3,3,3,1,0,2,0,3,2,3,2,3,1,2,3,2,3,3,2,1,2,0,1,1,3,0,1,1,1,1,3,2,3,0,1,3,3]
        GameArg.dataList.uid = 0;
        _ruleInfo.list = '';

        if (!HdGame.isplaySucess) {
          GameArg.first = 0;
        }
        GameArg.step = 0;
        window.scrollTo(0, 0);
        LGlobal.setPauseLoop(false)

        GameArg.readyLayer.addEventListener(LEvent.ENTER_FRAME,(event)=>{
          this.hg.time.updateInFrame( 60);
          showTopBar()
        });
        
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
            if (i === 1 && GameArg.first === 0) {
              GameArg.guide = new LGuide({
                x: this.thief[0].x + GameArg.imageArray[0].l,
                y: this.thief[0].y + GameArg.imageArray[0].t,
                w: GameArg.imageArray[0].w,
                h: GameArg.imageArray[0].h
              }).play();
              GameArg.gLayer.addChild(GameArg.guide);
            }
          }
        }
      //});

    },
    showTishi() {
      let tishiImg = this.hg.assets[_resRoot + "/image/bbtzw/tishi.png"]
      let jtBitmap = new LBitmap(new LBitmapData(tishiImg, 20, 12, 90, 300), 6.875 * this.rem, LGlobal.height - 7.5 * this.rem, 2.25 * this.rem, 7.5 * this.rem)
      let handBitmap = new LBitmap(new LBitmapData(tishiImg, 220, 30, 84, 95), 7.7 * this.rem, LGlobal.height, 2.1 * this.rem, 2.375 * this.rem)
      GameArg.mask = new LSprite(true);
      var maskObj = new LBitmap(new LBitmapData("#000000", 0, 0, LGlobal.width, LGlobal.height));
      maskObj.alpha = 0.6;
      GameArg.mask.addChild(maskObj);
      GameArg.mask.addChild(jtBitmap);
      GameArg.mask.addChild(handBitmap);
      console.log("showTishi", LGlobal.width, LGlobal.height, "LTweenLite->", handBitmap)
      LTweenLite.to(handBitmap, 1, {
        loop: true,
        y: LGlobal.height - 7.5 * this.rem,
        onStart: function (event) {
          //console.log("onStart ->00 handBitmap.y=", handBitmap.y)
        },
        onUpdate: function (event) {
          //console.log("onUpdate ->01 handBitmap.y=", handBitmap.y)
        },
        onComplete: function (event) {
          //console.log("onComplete ->02 handBitmap.y=", handBitmap.y)
        }
      }).to(handBitmap, 0.2, {
        loop: true,
        alpha: 0,
        onComplete: function (event) {
          handBitmap.alpha = 1;
          handBitmap.y = LGlobal.height;
        }
      });
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
      if (_gameOver) {
        return false;
      }
      var touch = e.targetTouches[0];
      var x = touch.pageX;
      var y = touch.pageY - GameArg.gameBoxtop;
      var t = this.thief[0];
      if (y >= GameArg.layer.y + t.y - GameArg.blockSize * 0.5 && y <= GameArg.layer.y + t.y + GameArg.blockSize * 1.5 && x >= t.x && x <= t.x + GameArg.blockSize) {
        _ruleInfo.list += (_ruleInfo.list ? ',' : '') + t.uid + ',' + this.toFixed2(x / GameArg.blockSize);
        if (GameArg.gameStart) {
          GameArg.gameStart = false;
          this.gameStart();
        }
        if (GameArg.first <= 3) {
          GameArg.first++;
          GameArg.guide.change({
            x: this.thief[1].x + GameArg.imageArray[0].l,
            y: this.thief[1].y + GameArg.imageArray[0].t
          }).play();
        } else if (GameArg.first === 4) {
          GameArg.guide.stop();
          GameArg.guide.die();
          GameArg.guide.remove();
          GameArg.first++;
        }
        this.removeLayer();
        this.hg.sound.play(1);
      } else if (GameArg.first > 4) {
        this.hg.sound.play(2);
        _gameOver = true;
        GameArg.gameStart = true;
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
            onComplete: function () {
              LGlobal.setPauseLoop(true)
              GameArg.eventBus.$emit( GameEndEvent.name )
              //gameOver(this.hg.grade.val);
              return;
            }
          });
      }
    },

    //
    removeLayer() {
      this.hg.grade(1);
      var crrThief = this.thief.shift();
      var bm = new LBitmap(GameArg.imageArray[3].img, crrThief.x + GameArg.imageArray[3].l, crrThief.y + GameArg.imageArray[3].t, GameArg.imageArray[3].w, GameArg.imageArray[3].h);
      GameArg.pLayer.addChild(bm);
      crrThief.parent.push(bm);
      bm = null;
      crrThief = null;
      if (this.rowArray[0] && GameArg.layer.y + this.rowArray[0].y > GameArg.hem) {
        this.rowArray.shift().forEach( function (bm, index) {
          bm && bm.remove();
        });
      }
      this.addRow();
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
