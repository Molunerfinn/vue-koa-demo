<template>
  <div class="gameBox hide gameBgBox">
    <div id="gameBgBox">
      <img id="gameBg" src="/game-kouhong-assets/app/images/skin1/wx/ACgIABACGAAg3fDr4AUojqC25gYwgAU4wAw.jpg" style="width:100%;height:auto;" />
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
  </div>

</template>

<script>
import LSprite from '@/lib/lufylegend/display/LSprite'
import LBitmap from '@/lib/lufylegend/display/LBitmap'
import LBitmapData from '@/lib/lufylegend/display/LBitmapData'
import LEvent from '@/lib/lufylegend/events/LEvent'
import LGlobal from '@/lib/lufylegend/utils/LGlobal'
import { LInit } from '@/lib/lufylegend/utils/Function'
import LTweenLite from '@/lib/lufylegend/transitions/LTweenLite'
//import LStageScaleMode from '@/lib/lufylegend/display/LStageScaleMode';
//import LStageAlign from '@/lib/lufylegend/display/LStageAlign';

var _gameOver = false;
import HdGame from '@/lib/hdgame'
import { GameArg, g_rem } from './GameArg'
import Lolly from './Lolly'
import SugarY from './SugarY'

LGlobal.width = 640;
LGlobal.height = LGlobal.width * window.innerHeight / window.innerWidth;

//LInit(50, 'legend', LGlobal.width, LGlobal.height, main);

export default {
  name: 'game',
  props:{
    hg: Object,
    // 游戏初始化的状态
    gamestate: {
      type: [String, Number],
      default: 0
    }
  },
  data () {
    return {
      clubImg: null,
      imgData: null,
      sugarYsize: 0,
      game_player:{},
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted(){
    console.log( "mounted props=", this.hg, this.gamestate)
    //this.initGame()
    // this.hg.assets.onReady(() => {
    //   var clubInfo = this.hg.edit.getImgInfo('club', true);
    //   this.clubImg = new LBitmapData( this.hg.assets[clubInfo.path]);
    //
    //   GameArg.clubH = GameArg.lollyH = clubInfo.height;
    //   GameArg.lollyW = clubInfo.width;
    //   GameArg.lollyY = clubInfo.top;
    //   GameArg.launchY = 10.625 + GameArg.lollyY;
    //   GameArg.clubH = GameArg.lollyH = clubInfo.height;
    //   GameArg.minRotate = Math.atan((GameArg.lollyW / 2) / (GameArg.lollyH + GameArg.lollyY)) * 180 * 2 / Math.PI + 0.5;
    //
    // });
    //
    // this.hg.assets.onReady( () =>{
    //   this.imgData = new LBitmapData(this.hg.assets[this.hg.edit.getImgInfo('ySugar').path]);
    //   this.sugarYsize = HdGame.getPosAndSize( this.imgData, {
    //     width: 6 * g_rem,
    //     height: 6 * g_rem
    //   });
    // });
  },
  methods:{
    handleStartGame(){
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
    initGameData() {
      //hg.time.init();
      //hg.grade.set(0);
      //$('.timeUpImg').hide();
    },

    initGame() {
      GameArg.left = parseInt(0.5 * g_rem);
      GameArg.top = parseInt(4 * g_rem);
      LGlobal.canvasObj.addEventListener('touchstart', this.canvasDown, false);
      LGlobal.canvasObj.addEventListener('touchmove', this.canvasMove, false);
      //LGlobal.canvasObj.addEventListener('touchend', function(){ console.log("LGlobal.canvasObj->touchend")}, false);
      GameArg.stageLayer = new LSprite(true);

      this.startGame();
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
            onComplete: function() {
              LGlobal.setPauseLoop(true);
              this.endClear();
              this.gameOver(this.hg.grade.val);
            }
          });
      } else {
        LGlobal.setPauseLoop(true);
        this.endClear();
        this.gameOver(this.hg.grade.val);
      }
    },
    endClear() {
      setTimeout(function() {
        LGlobal.canvas.clearRect(0, 0, LGlobal.width + 1, LGlobal.height + 1);
      }, 400);
    },
    startGame() {
      _gameOver = false;
      LGlobal.setPauseLoop(false)
      window.scrollTo(0, 0);
      GameArg.stageLayer.removeAllChild();
      GameArg.readyLayer = new LSprite();
      GameArg.stageLayer.addChild(GameArg.readyLayer);
      GameArg.readyList = [];
      GameArg.rotateList = [];
      GameArg.firstTouch = true;
      this.creatSugarY();
      for (var i = 0; i < 1; i++) {
        this.addReadyList(true);
      }
      if (!HdGame.isplaySucess) {
        this.showTishi();
      }
    },

    creatSugarY() {
      var sugarY = new SugarY( this.imgData, this.sugarYsize );
      for (var i = 0; i < 4; i++) {
        sugarY.add(new Lolly(this.clubImg, GameArg.launchY * g_rem, true), this.GetRandomNum(i * 90 + GameArg.minRotate + 7, (i + 1) * 90 - GameArg.minRotate + 3));
      }
      GameArg.sugarY = sugarY;
    },

    showTishi() {
      var tishiImg = this.hg.assets["/game-kouhong-assets/lib/image/bbtzw/tishi.png"],
        jtBitmap = new LBitmap(new LBitmapData(tishiImg, 20, 12, 90, 300), 6.875 * g_rem, LGlobal.height - 7.5 * g_rem, 2.25 * g_rem, 7.5 * g_rem),
        handBitmap = new LBitmap(new LBitmapData(tishiImg, 220, 30, 84, 95), 7.7 * g_rem, LGlobal.height, 2.1 * g_rem, 2.375 * g_rem);
      GameArg.mask = new LSprite(true);
      var maskObj = new LBitmap(new LBitmapData("#000000", 0, 0, LGlobal.width, LGlobal.height));
      maskObj.alpha = 0.6;
      GameArg.mask.addChild(maskObj);
      GameArg.mask.addChild(jtBitmap);
      GameArg.mask.addChild(handBitmap);
      LTweenLite.to(handBitmap, 1, {
        loop: true,
        y: LGlobal.height - 7.5 * g_rem,
      }).to(handBitmap, 0.2, {
        loop: true,
        alpha: 0,
        onComplete: function() {
          handBitmap.alpha = 1;
          handBitmap.y = LGlobal.height;
        }
      });
    },

    initCanvas() {
      LGlobal.notMouseEvent = true;
      LInit(0, "gameLayerBox", 0, 0, this.initGame, LEvent.INIT);
    },

    canvasDown(e) {
      if (_gameOver) {
        return;
      }
      GameArg.lastPageY = e.changedTouches[0].pageY;
      console.log( "trigger canvasDown ... ")
    },

    canvasMove(e) {
      console.log( "trigger canvasMove ... ")
      if (_gameOver) {
        return;
      }
      if (GameArg.lastPageY && GameArg.lastPageY - e.changedTouches[0].pageY > g_rem) {
        if (!HdGame.isplaySucess) {
          HdGame.isplaySucess = true;
          GameArg.mask.removeAllChild();
          GameArg.mask.remove();
          GameArg.mask.die();
          delete GameArg.mask;
        }
        if (GameArg.firstTouch) {
          GameArg.firstTouch = false;
          GameArg.sugarY.rotating();
          this.hg.time.start();
        }
        this.addReadyList();
        GameArg.lastPageY = null;
      }
    },

    addReadyList(isInit) {
      var readyList = GameArg.readyList;
      var interval = (GameArg.lollyH + 0.5) * g_rem;
      var firstY = LGlobal.height - (GameArg.lollyH + 0.5) * g_rem;
      if (isInit) {
        readyList.push(new Lolly(this.clubImg, firstY - readyList.length * interval));
      } else {
        readyList.pop().launch();
        readyList.unshift(new Lolly(this.clubImg, firstY + interval));
        readyList.each( function(index, lolly) {
          LTweenLite.to(lolly, 0.2, {
            y: lolly.y - interval
          })
        })
      }
    },
    GetRandomNum(a, b) {
      return a + Math.floor(Math.random() * (b - a + 1));
    },

    GetRandom(a, b) {
      return a + Math.random() * (b - a);
    }
  },
  watch: {
    gamestate: function (val, oldVal) {
      //外部触发游戏开始
      console.log('watch-gamestate new: %s, old: %s', val, oldVal)
      if( val == 'start'){
        this.handleStartGame()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
