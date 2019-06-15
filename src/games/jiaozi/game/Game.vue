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
import LShape from '@/lib/lufylegend/display/LShape'
import LBitmap from '@/lib/lufylegend/display/LBitmap'
import LBitmapData from '@/lib/lufylegend/display/LBitmapData'
import LEvent from '@/lib/lufylegend/events/LEvent'
import LTweenLite from '@/lib/lufylegend/transitions/LTweenLite'
import LEasing from '@/lib/lufylegend/transitions/LEasing'

//import LStageScaleMode from '@/lib/lufylegend/display/LStageScaleMode';

import {
  setGameTopBar,
  showTopBar
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
    GameArg.gameBoxtop = 0;//~~(5*rem);
    GameArg.hem = ~~($(window).height() - GameArg.gameBoxtop);
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
      let rem = this.rem
      let hg = this.hg
      //初始化游戏头部 头像，计时，分数
      setGameTopBar('#gameTopBar', this.hg)

      var zawInfo = hg.edit.getImgInfo('zaw');
      var platform = hg.edit.getImgInfo('platform');
      GameArg.formBgColor = hg.edit.getRgba(platform.css[0].val,platform.css[0].tra);
      GameArg.formBdColor = hg.edit.getRgba(platform.css[1].val,platform.css[0].tra);
      GameArg.zawInfo = zawInfo;
      GameArg.layer = [
          {
              zaw:[],
              zawRange:[],
              form:[{ w:7*rem,h:4.5*rem,x:-1,y:14*rem}]
          },{
              zaw:[],
              zawRange:[],
              form:[{ w:5.5*rem,h:2*rem,x:10.5*rem,y:13*rem}]
          },{
              zaw:[{ x:4.5*rem,y:12.5*rem,tox:11.5*rem - zawInfo.width}],
              zawRange:[{x:4.5*rem,y:12.5*rem,width:7*rem,height:zawInfo.height}],
              form:[
                  { w:3.5*rem,h:2.5*rem,x:0,y:12*rem},
                  { w:4*rem,h:2.5*rem,x:12*rem,y:12*rem},
              ]
          },{
              zaw:[
                  { x:12*rem,y:6.5*rem,tox:8*rem},
                  { x:3*rem,y:18*rem,tox:8*rem - zawInfo.width}
              ],
              zawRange:[
                  {x:8*rem,y:6.5*rem,width:4*rem + zawInfo.width,height:zawInfo.height},
                  {x:3*rem,y:18*rem,width:5*rem,height:zawInfo.height},
              ],
              form:[]
          },{
              zaw:[
                  { x:5*rem,y:7*rem,toy:11*rem},
                  { x:5*rem,y:17*rem,toy:13*rem - zawInfo.height}
              ],
              zawRange:[{x:5*rem,y:7*rem,width:zawInfo.width,height:10*rem + zawInfo.height}],
              form:[]
          },{
              zaw:[{x:rem,y:11*rem,tox:7*rem - zawInfo.width}],
              zawRange:[{x:rem,y:11*rem,width:6*rem,height:zawInfo.height}],
              form:[{ w:7*rem,h:4.5*rem,x:9*rem,y:9*rem}]
          },{
              zaw:[
                  { x:2.5*rem,y:11.5*rem,tox:8*rem - zawInfo.width},
                  { x:12.5*rem,y:11.5*rem,tox:8*rem}
              ],
              zawRange:[{x:2.5*rem,y:11.5*rem,width:10*rem + zawInfo.width,height:zawInfo.height}],
              form:[]
          }
      ];
      GameArg.stageLayer = new LSprite(true);
      GameArg.explodeList = {};
      GameArg.explodeListLen = 0;

      GameArg.stageLayer.addEventListener(LEvent.ENTER_FRAME,  ()=> {
        if (_gameOver) {
          return;
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
      let hg = this.hg
      _gameOver = false;
      hg.grade.set(0);
      window.scrollTo(0,0);
      hg.time.start();
      LGlobal.setPauseLoop(false);
      GameArg.stageLayer.removeAllChild();
      GameArg.dustLayer = new LSprite();
      GameArg.stageLayer.addChild(GameArg.dustLayer);
      GameArg.first = false;
      GameArg.index = 0;
      GameArg.indexList = [];
      GameArg.wpLen = 0;
      GameArg.wpIndexList = this.GetRandomList(4);
      for(var i = 0; i < GameArg.layer.length; i++){
          GameArg.indexList.push(i);
      }
      this.setLayer(0);
      this.setRobot();
      this.updateWp();

    },

    initCanvas() {
      LGlobal.notMouseEvent = true;
      //console.log( " LGlobal.width, LGlobal.height",  LGlobal.width, LGlobal.height, " window.innerWidth, window.innerHeight", window.innerWidth, window.innerHeight)
      //LInit(50, 'gameLayerBox', LGlobal.width, LGlobal.height, this.initGame);
      LInit(0, "gameLayerBox", window.innerWidth, window.innerHeight, this.initGame, LEvent.INIT);
      console.log(" LGlobal.width, LGlobal.height", LGlobal.width, LGlobal.height, " window.innerWidth, window.innerHeight", window.innerWidth, window.innerHeight)
      //LGlobal.resize(window.innerWidth, window.innerHeight);
    },

    explode(wp){
      var cWp = new LSprite(true);
      var length = 100;
      cWp.len = GameArg.explodeListLen;
      GameArg.explodeList[GameArg.explodeListLen] = cWp;
      GameArg.explodeListLen++
      if( HdGame.UA.isAndroid() || HdGame.UA.isIPhone4()){
          length = 80;
      }
      for(var i = 0;i < length;i++){
          var ExBitmap = new LBitmap(wp.bitmapData,wp.x,wp.y,wp.width/4,wp.height/4);
          ExBitmap.speedX = this.GetRandom(-1*GameArg.speed,GameArg.speed);
          ExBitmap.speedY = this.GetRandom(-1*GameArg.speed,GameArg.speed);
          LTweenLite.to(ExBitmap,1,{alpha:0,scale:0.8,ease:LEasing.Quart.easeOut,onComplete:function(event){
              event.target.remove();
              if(cWp.childList.length === 0){
                  cWp.die();
                  cWp.remove();
                  delete GameArg.explodeList[cWp.len];
                  cWp = null;
              }
          }});
          cWp.addChild(ExBitmap);
      }
  },
  updateWp(){
    let that = this
    let hg = this.hg
    let rem = this.rem
      var layer = GameArg.layer[GameArg.indexList[GameArg.index]],
          wpInfo = hg.edit.getImgInfo('wp0' + (GameArg.wpIndexList[GameArg.wpLen]+1)),
          wpbBitmap = new LBitmap(new LBitmapData(hg.assets[wpInfo.path]),0,0,wpInfo.width,wpInfo.height),
          limitX = LGlobal.width - wpInfo.width,
          limitY = LGlobal.height - wpInfo.height;
      GameArg.stageLayer.addChild(wpbBitmap);
      GameArg.wp = wpbBitmap;
      setWpOff();
      function setWpOff(){
          wpbBitmap.x = that.GetRandom(0,limitX);
          wpbBitmap.y = that.GetRandom(3.5*rem,limitY);
          if(GameArg.robot && that.hitTestObject(GameArg.robot,wpbBitmap)){
                  setWpOff();
                  return
              }
          for(let i = 0; i < GameArg.formList.length; i++){
              if(that.hitTestObject(wpbBitmap,GameArg.formList[i],true)){
                  setWpOff();
                  return
              }
          }
          for(let i = 0; i < layer.zawRange.length; i++){
              if(that.hitTestObject(wpbBitmap,layer.zawRange[i],true)){
                  setWpOff();
                  return
              }
          }
      }
  },
  setRobot(){
    let that = this
    let hg = this.hg
    let rem = this.rem
      var robotLayer = new LSprite();
      GameArg.stageLayer.addChild(robotLayer);
      var robotInfo =  hg.edit.getImgInfo('robot');
      var statusData = new LBitmapData(hg.assets[robotInfo.path]);
      var robot = new LBitmap(statusData,0,13*rem,robotInfo.width,robotInfo.height);
      GameArg.speed = (LGlobal.width - robotInfo.width) / 2000;
      robot.speedX = GameArg.speed;
      robot.speedY = 0;
      robot.aY = 0.0005;
      robot.fps = 5/1000;
      robot.frameInc = 0;
      robotLayer.addChild(robot);
      LGlobal.canvasObj.addEventListener('touchstart',function(){
          if(_gameOver){
              return;
          }
          robot.y--;
          robot.speedY = -0.3;
      },false);
      robotLayer.addEventListener(LEvent.ENTER_FRAME,function(event){
          if(_gameOver){
              return;
          }
          var delta = LGlobal.delta;
          if(!GameArg.transition){
              for(var i = 0; i < GameArg.zawList.length; i++){
                  var zawBitmap = GameArg.zawList[i];
                  if(that.hitTestObject(robot,zawBitmap,false)){
                      //explode(zawBitmap);
                      zawBitmap.remove();
                      GameArg.robot.speedX = GameArg.robot.speedY = GameArg.robot.aY = 0;
                      LTweenLite.to(robot,0.1,{alpha:0})
                          .to(robot,0.1,{alpha:1})
                          .to(robot,0.1,{alpha:0})
                          .to(robot,0.1,{alpha:1})
                          .to(robot,0.1,{alpha:0})
                          .to(robot,0.1,{alpha:1})
                          .to(robot,0.1,{alpha:0})
                          .to(robot,0.1,{alpha:1,onComplete: this.endGame});
                      return;
                  }
              }
          }
          GameArg.formList.forEach((shape, index) => {
              if(that.hitTestObject(robot,shape)){
                  var robotx = robot.x + (robot.scaleX - 1)*robot.width/2,
                      yd1 = Math.abs(robot.y + robot.height - shape.y),
                      yd2 = Math.abs(robot.y - (shape.y + shape.height)),
                      xd1 = Math.abs(robotx + robot.width - shape.x),
                      xd2 = Math.abs(robotx - (shape.x + shape.width)),
                      d = Math.min(yd1,yd2,xd1,xd2);
                  switch(d){
                      case yd1:
                          robot.y = shape.y - robot.height;
                          robot.speedY = 0;
                          break;
                      case yd2:
                          robot.speedY = 0.1;
                          break;
                      case xd1:
                          that.getDust(shape.x,robot.y + robot.height/2);
                          robot.speedX = -GameArg.speed;
                          robot.scaleX = -1;
                          robot.x = shape.x + (robot.scaleX + 1)*robot.width/2;
                          robot.speedY = -0.2;
                          break;
                      case xd2:
                          that.getDust(shape.x + shape.width,robot.y + robot.height/2);
                          robot.speedX = GameArg.speed;
                          robot.scaleX = 1;
                          robot.x = shape.x + shape.width + ( 1 - robot.scaleX)*robot.width/2;
                          robot.speedY = -0.2;
                          break;
                  }
              }
          });
          var wp = GameArg.wp;
          for(var explodeListIndex in GameArg.explodeList){
              var clone = GameArg.explodeList[explodeListIndex];
              if(clone){
                  clone.childList.forEach( function(wpbBitmap, index) {
                      wpbBitmap.x += wpbBitmap.speedX*delta;
                      wpbBitmap.y += wpbBitmap.speedY*delta;
                  });
              }
          }
          if(that.hitTestObject(robot,wp)){
              hg.grade.inc(10);
              hg.sound.play(1);//音效
              that.explode(wp);
              wp.remove();
              GameArg.wpLen++;
              if(GameArg.wpLen === 4){
                  GameArg.wpLen = 0;
                  GameArg.wpIndexList = that.GetRandomList(4);
                  GameArg.index++;
                  if(GameArg.index >= GameArg.layer.length){
                      GameArg.index = 0;
                      GameArg.indexList = that.GetRandomList(GameArg.layer.length);
                  }
                  that.setLayer();
                  if(GameArg.zawList.length > 0){
                      GameArg.transition = true;
                      GameArg.zawList.forEach( function( zawBitmap, index) {
                          zawBitmap.alpha = 0.3;
                      });
                      clearTimeout(GameArg.transitionTimer);
                      GameArg.transitionTimer = setTimeout(function(){
                          GameArg.zawList.forEach( function( zawBitmap, index) {
                              zawBitmap.alpha = 1;
                          });
                          GameArg.transition = false;
                      },1000);
                  }
              }
              that.updateWp();
          }
          //robot.frameInc += robot.fps*delta;
          //var frameInc = Math.floor(robot.frameInc);
          //robot.bitmapData = statusData[frameInc % statusData.length];
          if(robot.x < (1 - robot.scaleX)*robot.width/2){
              that.getDust(0,robot.y + robot.height/2);
              robot.speedX = GameArg.speed;
              robot.scaleX = 1;
              robot.x = (1 - robot.scaleX)*robot.width/2;
              robot.speedY = -0.2;
          }else if(robot.x + (robot.scaleX + 1)*robot.width/2 > LGlobal.width){
              that.getDust(LGlobal.width,robot.y + robot.height/2);
              robot.speedX = -GameArg.speed;
              robot.scaleX = -1;
              robot.x = LGlobal.width - (robot.scaleX + 1)*robot.width/2;
              robot.speedY = -0.2;
          }
          robot.x += robot.speedX*delta;
          if(robot.y < 0){
              robot.speedY = 0.1;
          }else if(robot.y > LGlobal.height){
              that.endGame();
              return;
          }
          robot.speedY += robot.aY*delta;
          robot.y += robot.speedY*delta;
      });
      GameArg.robot = robot;
  },
  hitTestObject(a,b,flag,tolerance){
      tolerance = tolerance || 0;
      var x = flag ? a.x : a.x + (a.scaleX - 1)*a.width/2;
      return x + a.width > b.x + tolerance && x < b.x + b.width - tolerance && a.y + a.height > b.y + tolerance && a.y < b.y + b.height - tolerance;
  },
  getDust(x,y){
    let rem = this.rem
    let hg = this.hg
      var w = 1*rem,h = 2*rem;
      var dustBitmap = new LBitmap(new LBitmapData(hg.assets["//hdg.faisys.com/image/xjtx/dust-sheet0.png"]),x-w/2,y-h/2,w,h);
      GameArg.dustLayer.addChild(dustBitmap);
      LTweenLite.to(dustBitmap,0.5,{alpha:0.3,x:x-w,scaleX:2,y:y-h,scaleY:2,ease:LEasing.Quad.easeOut,onComplete:function(event){
          event.target.remove();
      }});
  },
  setLayer(){
    let hg = this.hg
      var i = GameArg.indexList[GameArg.index];
      var layer = GameArg.layer[i];
      var zaw = layer.zaw;
      if(GameArg.zawList){
          GameArg.zawList.forEach( function(val,index) {
              val.remove();
              LTweenLite.remove(val.tween);
          });
      }
      GameArg.zawList = [];
      var form = layer.form;
      if(GameArg.formList){
          GameArg.formList.forEach( function(val, index) {
              val.die();
              val.remove();
          });
      }
      GameArg.formList = [];
      var zawInfo = GameArg.zawInfo;
      zaw.forEach( function(val, index) {
          var zawBitmap = new LBitmap(new LBitmapData(hg.assets[zawInfo.path]),val.x,val.y,zawInfo.width,zawInfo.height);
          var duration = val.duration || 2;
          if(val.tox){
              val.tween = LTweenLite.to(zawBitmap,duration,{x:val.tox,loop:true,ease:LEasing.Quad.easeInOut})
              .to(zawBitmap,duration,{x:val.x,loop:true,ease:LEasing.Quad.easeInOut});
          }else if(val.toy){
              //var dy = (val.toy - val.y)/4;
              val.tween = LTweenLite.to(zawBitmap,duration,{y:val.toy,loop:true,ease:LEasing.Quad.easeInOut})
              .to(zawBitmap,duration,{y:val.y,loop:true,ease:LEasing.Quad.easeInOut});
          }
          GameArg.stageLayer.addChild(zawBitmap);
          GameArg.zawList.push(zawBitmap);
      });
      form.forEach( (val, index) => {
          var shape = new LShape();
          shape.graphics.drawRect(1,GameArg.formBgColor, [0, 0, val.w, val.h], true, GameArg.formBdColor);
          shape.x = val.x;
          shape.y = val.y;
          shape.width = val.w;
          shape.height = val.h;
          GameArg.stageLayer.addChild(shape);
          GameArg.formList.push(shape);
          if(GameArg.robot &&  this.hitTestObject(GameArg.robot,shape)){
              GameArg.robot.y = shape.y - GameArg.robot.width;
          }
      });

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
    GetRandomList(length){
           length = length || 1;
           var arr = [];
           var array = [];
           for(let i = 0; i < length; i++){
               arr.push(i);
           }
           for(let i = 0; i < length; i++){
               var random = Math.floor( Math.random()*arr.length);
               array.push(arr[random]);
               arr.splice(random,1);
           }
           arr = null;
           return array;
    },
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
