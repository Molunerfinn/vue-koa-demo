<template>
  <div class="gameBox gameBgBox" >
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
  </div>

</template>

<script>
import { LInit } from '@/lib/lufylegend/utils/Function'
import LGlobal from '@/lib/lufylegend/utils/LGlobal'
import LSprite from '@/lib/lufylegend/display/LSprite'
import LBitmap from '@/lib/lufylegend/display/LBitmap'
import LBitmapData from '@/lib/lufylegend/display/LBitmapData'
import LEvent from '@/lib/lufylegend/events/LEvent'
import LTweenLite from '@/lib/lufylegend/transitions/LTweenLite'
//import LStageScaleMode from '@/lib/lufylegend/display/LStageScaleMode';
//import LStageAlign from '@/lib/lufylegend/display/LStageAlign';

var _gameOver = false;
const _resRoot = '/static/kouhong'

import HdGame from '@/lib/hdgame'
import { GameArg } from './GameArg'
import Lolly from './Lolly'
import SugarY from './SugarY'

//LGlobal.setDebug(true);
//LGlobal.displayState = LGlobal.FULL_SCREEN
//LGlobal.width = 640;
//LGlobal.height = LGlobal.width * window.innerHeight / window.innerWidth;

//LInit(50, 'legend', LGlobal.width, LGlobal.height, main);

// eventBus
import { GameEndEvent, GameBackgroundMusicLoadEvent } from '@/lib/GameEvent'

export default {
  name: 'game',
  props:{
    hg: Object,
    // 游戏初始化的状态
    command: {
      type: [String, Number],
      default: 0
    }
  },
  data () {
    return {
      gameBg: require('@/assets/kouhong/image/skin1/wx/ACgIABACGAAg3fDr4AUojqC25gYwgAU4wAw.jpg'),
      clubImg: null,
      imgData: null,
      sugarYsize: 0,
      game_player:{},
      ui:{
        gameBoxVisible: false
      },
      msg: 'Welcome to Your Vue.js App',
      rem: 20
    }
  },
  created(){
    this.rem = window.g_rem
  },
  mounted(){
    console.log( "mounted props=", this.hg, this.command)
    //this.initGame()
    this.hg.assets.onReady(() => {
      console.log( " this.hg.edit = ", this.hg.edit )
      let clubInfo = this.hg.edit.getImgInfo('club', true);
      console.log( " hg.assets.onReady clubInfo", clubInfo, "this.hg.assets[clubInfo.path]", this.hg.assets[clubInfo.path])
      this.clubImg = new LBitmapData( this.hg.assets[clubInfo.path]);

      GameArg.clubH = GameArg.lollyH = clubInfo.height;
      GameArg.lollyW = clubInfo.width;
      GameArg.lollyY = clubInfo.top;
      GameArg.launchY = 10.625 + GameArg.lollyY;
      GameArg.clubH = GameArg.lollyH = clubInfo.height;
      GameArg.minRotate = Math.atan((GameArg.lollyW / 2) / (GameArg.lollyH + GameArg.lollyY)) * 180 * 2 / Math.PI + 0.5;
      console.log( " hg.assets.onReady 1")

    });

    this.hg.assets.onReady( () =>{
      let ySugar = this.hg.edit.getImgInfo('ySugar')
      console.log( "this.hg.assets=", this.hg.assets)
      console.log( " hg.assets.onReady ySugar", ySugar, "this.hg.assets[ySugar.path]",this.hg.assets[ySugar.path])

      this.imgData = new LBitmapData(this.hg.assets[ySugar.path]);
      this.sugarYsize = HdGame.getPosAndSize( this.imgData, {
        width: 6 * this.rem,
        height: 6 * this.rem
      });
    });
    GameArg.eventBus.$on(GameEndEvent.name, (event)=>{
      this.hg.sound.play(2);
      this.hg.time.end();
      this.endGame(event.target);//lolly
      GameArg.state = 4;
    })
    GameArg.eventBus.$on(GameBackgroundMusicLoadEvent.name, (event)=>{

      this.initBackgroundMusic()
    })

    this.hg.time.on( 'setTime', (e)=>{
      console.log( "setTime", e)
    })
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

    handleRestartGame(){

      this.handleInitGameData();
      this.startGame();
      this.hg.fire('again');

    },

    handleInitGameData() {
      this.hg.time.init();
      this.hg.grade.set(0);
      //$('.timeUpImg').hide();
    },

    initGame() {
      GameArg.left = parseInt(0.5 * this.rem);
      GameArg.top = parseInt(4 * this.rem);

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
            onComplete: ()=> {
              LGlobal.setPauseLoop(true);
              this.endClear();
              this.$emit( "game-over" )
              //this.gameOver(this.hg.grade.val);
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
      console.log( "creatSugarY ", this.sugarYsize, sugarY )
      for (var i = 0; i < 4; i++) {
        sugarY.add(new Lolly(this.clubImg, GameArg.launchY * this.rem, true), this.GetRandomNum(i * 90 + GameArg.minRotate + 7, (i + 1) * 90 - GameArg.minRotate + 3));
      }
      GameArg.sugarY = sugarY;
    },

    showTishi() {
      let tishiImg = this.hg.assets[_resRoot+"/image/bbtzw/tishi.png"]
      let jtBitmap = new LBitmap(new LBitmapData(tishiImg, 20, 12, 90, 300), 6.875 * this.rem, LGlobal.height - 7.5 * this.rem, 2.25 * this.rem, 7.5 * this.rem)
      let handBitmap = new LBitmap(new LBitmapData(tishiImg, 220, 30, 84, 95), 7.7 * this.rem, LGlobal.height, 2.1 * this.rem, 2.375 * this.rem)
      GameArg.mask = new LSprite(true);
      var maskObj = new LBitmap(new LBitmapData("#000000", 0, 0, LGlobal.width, LGlobal.height));
      maskObj.alpha = 0.6;
      GameArg.mask.addChild(maskObj);
      GameArg.mask.addChild(jtBitmap);
      GameArg.mask.addChild(handBitmap);
      console.log( "showTishi",LGlobal.width, LGlobal.height,  "LTweenLite->", handBitmap)
      LTweenLite.to(handBitmap, 1, {
        loop: true,
        y: LGlobal.height - 7.5 * this.rem,
        onStart: function( event){
          //console.log("onStart ->00 handBitmap.y=", handBitmap.y)
        },
        onUpdate: function( event ){
          //console.log("onUpdate ->01 handBitmap.y=", handBitmap.y)
        },
        onComplete: function(event) {
          //console.log("onComplete ->02 handBitmap.y=", handBitmap.y)
        }
      }).to(handBitmap, 0.2, {
        loop: true,
        alpha: 0,
        onComplete: function(event) {
          handBitmap.alpha = 1;
          handBitmap.y = LGlobal.height;
        }
      });
    },

    initCanvas() {
      LGlobal.notMouseEvent = true;
      //console.log( " LGlobal.width, LGlobal.height",  LGlobal.width, LGlobal.height, " window.innerWidth, window.innerHeight", window.innerWidth, window.innerHeight)
      //LInit(50, 'gameLayerBox', LGlobal.width, LGlobal.height, this.initGame);
      LInit(0, "gameLayerBox",  window.innerWidth, window.innerHeight, this.initGame, LEvent.INIT);
      console.log( " LGlobal.width, LGlobal.height",  LGlobal.width, LGlobal.height, " window.innerWidth, window.innerHeight", window.innerWidth, window.innerHeight)
      LGlobal.resize(window.innerWidth, window.innerHeight);
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
      if (GameArg.lastPageY && GameArg.lastPageY - e.changedTouches[0].pageY > this.rem) {
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
    //
    addReadyList(isInit) {
      console.log( " addReadyList ", isInit)
      var readyList = GameArg.readyList;
      var interval = (GameArg.lollyH + 0.5) * this.rem;
      var firstY = LGlobal.height - (GameArg.lollyH + 0.5) * this.rem;
      if (isInit) {
        readyList.push(new Lolly(this.clubImg, firstY - readyList.length * interval));
      } else {
        readyList.pop().launch();
        readyList.unshift(new Lolly(this.clubImg, firstY + interval));
        readyList.forEach( function(lolly, index) {
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
    },

    initBackgroundMusic() {

      this.hg.sound.get("0",
      function(lsound) {
        // lsound.on("play",
        // function() {
        //   $(function() {
        //     if ($(".soundIcon").length <= 0) {
        //       HdGame.appendMusicIcon()
        //     }
        //     $(".soundIcon").removeClass("soundIconOff")
        //   })
        // }).on("pause",
        // function() {
        //   $(function() {
        //     $(".soundIcon").addClass("soundIconOff")
        //   })
        // });
        if (Audio && lsound.data instanceof Audio) {
          document.getElementById("pageMusic").appendChild(lsound.data)
        }
      })
    }


  },
  watch: {
    command: function (val, oldVal) {
      //外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if( val == 'start'){
        this.handleStartGame()
      }
      if( val == 'restart'){
        this.handleRestartGame()
      }
      if( val == 'initial'){
        this.handleInitGameData()
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
