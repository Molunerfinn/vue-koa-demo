<template>
<div class="gameBox gameBgBox" @touchmove.stop.prevent="handleTouchMove">
  <div id="gameBgBox">
    <img id="gameBg" :src="gameBg" style="width:100%;height:auto;" />
  </div>

  <div id="gameTopBar" class="gameTopBar" style="color:;background-color:">
    <div class="userInfoBox">
      <div class="userImgBox" style="border-color:"><img :src="gamePlayer.avatar" class="userImg" /></div>

      <div id="grade" class="grade">{{grade}}</div>

    </div>
    <div class="timeBox">
      时间<br><span class="time">{{time}}</span>
    </div>
  </div>
  <div id="gameLayerBox" style="top: 4rem;">
    <canvas  @touchstart.prevent="handleTouchStart" id="canvas" width="640" height="974" style="width: 320px; height: 487px;">你的浏览器不支持canvas，请换个牛逼点的浏览器，谢谢</canvas>
  </div>
  <div class="timeUpImg hide"></div>
  <div :class="[{ soundIconOff: soundoff }, 'soundIcon']" style="z-index:700" @touchstart="handlePlaySound"></div>

</div>
</template>

<script>
import $ from 'jquery'

var _gameOver = false
var _ruleInfo = {}
var touchLock = false

import GameRes from './GameRes'
import HdGame from '@/lib/hdgame'
import HdUtil from '@/lib/hdutil'
import {
  GameArg
} from './GameArg'

const requestAnimFrame = HdUtil.requestAnimFrame
//LGlobal.setDebug(true);
//LGlobal.displayState = LGlobal.FULL_SCREEN
//LGlobal.width = 640;
//LGlobal.height = LGlobal.width * window.innerHeight / window.innerWidth;

//LInit(50, 'legend', LGlobal.width, LGlobal.height, main);

function ImageObject(){
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.type = 1;
    this.opacity = 1;
    this.fadeOut = 0.16;
    this.flag = false;
    this.time = 0;
    this.image = new Image();
}

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
      canvas: null,
      steps: 0, // 玩家玩了几下，前几次是指导
      xgDataList: null,
      showTime: 0, // 小鬼显示了多长时间
      stayTime: 0.8, // 图片显示时长秒
      combol: 0, // 游戏连击次数
      bossTime: false, // 是否出现大鬼
      xgTime: 0,
      xgList: [],  // 小鬼列表
      scoreList: [],
      createTime: 0.6, // 创建小鬼的时间间隔秒
      curTouchTime: 0,
      touchTime: 0,
      gameBg: null,
      imgData: null,
      game_player: {
        avatar: '/static/shared/image/avatar.jpg'
      },
      ui: {
        gameBoxVisible: false
      },
      skinAssets: {
        score: GameRes.skinAssets.score
      },
      soundoff: true,
      rem: 20,
      time: 5, // 时间
      grade: 0 // 分数
    }
  },
  created() {
    this.rem = window.g_rem
  },
  mounted() {
    console.log("mounted props=", this.hg, this.command)

    this.hg.assets.onReady(() => {
      console.log(" hg.assets.onReady 1")
      this.gameBg = GameRes.skinAssets.gameBgPath
    });

    this.hg.grade.on('setGrade',( val)=>{
      this.grade = val
    });

    this.hg.time.on('setTime', (val) => {
      this.time = val
      console.log("setTime", val)
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
    this.clientWidth = $(window).width(),
    this.clientHeight = $(window).height();
  },
  methods: {

    handleStartGame() {
      if (GameArg.firstTouch) {
        this.initCanvas();
        GameArg.firstTouch = false;
      }

      if(!HdGame.isplaySucess){
          this.steps = 0;
      }
      this.startGame();
    },

    handleRestartGame() {

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

    handleTouchStart( e ){
      console.log("handleTouchStart", e)
        if(_gameOver){
            return;
        }
        if(touchLock){
            return;
        }
        let xgList = this.xgList
        let scoreList = this.scoreList
        let hg = this.hg
        let ratio = this.ratio
        let rem = this.rem
        this.touchLock = true
        //e.preventDefault()
        //e = e.originalEvent;

        let touchX = e.clientX || e.changedTouches[0].clientX;
        let touchY = (e.clientY || e.changedTouches[0].clientY) - 80;

        for(var i = 0; i < xgList.length; i++){
            var xg = xgList[i];
            var xgX = xg.x/ratio;
            var xgY = xg.y/ratio;

            if(touchX > xgX && touchX < (xgX + xg.w/ratio) && touchY > xgY && touchY < (xgY + xg.h/ratio)){
                hg.sound.play(1);//音效
                if(xg.type == 1 || xg.type == 2){
                    xg.image = hg.assets[hg.edit.getImgInfo("xg"+xg.type).path[1]];
                    if(!xg.flag){
                        this.combol ++;
                        _ruleInfo.list += (_ruleInfo.list?',':'') + xg.uid + ',' + this.zxgToFixed(touchX/rem);
                    }
                }else if(xg.type == 3){
                    var xg3 = hg.edit.getImgInfo("xg3");
                    if(xg.image == hg.assets[xg3.path[0]]){
                        xg.image = hg.assets[xg3.path[1]];
                    }else{
                        xg.image = hg.assets[xg3.path[0]];
                    }
                    xg.index++;
                }
                if(!xg.flag || xg.type == 3){
                    var score = new ImageObject();
                    score.image = hg.assets[this.skinAssets.score];
                    score.w = 80;
                    score.h = 50;
                    score.x = xg.x + xg.w;
                    score.y = xg.y ;
                    scoreList.push(score);
                    this.hg.grade.inc(10);
                }
                xg.flag = true;
                break;
            }
        }
        setTimeout(function(){
            touchLock = false;
        },50);
    },
    handleTouchMove( event ){

    },
    initGame() {
      let hg = this.hg
      let canvas = this.canvas
      let ctx = this.ctx

      console.log('this.hg----:',this.hg);

      hg.time.init( );
      hg.grade.set(0);
      this.combol = 0;
      _gameOver = false;
      this.stayTime = 0.8;
      this.showTime = 0;
      this.createTime = 0.6;
      this.xgList = [];
      this.scoreList = [];
      HdGame.Guide.stop($('#gameLayerBox'));
      $('.timeUpImg').hide();
      this.bossTime = false;

          ctx.clearRect(0,0,canvas.width,canvas.height);
          ctx.globalAlpha = 1
          this.addXg()
          this.xgTime = (new Date).getTime()
          this.gamePlay()

    },

    endGame() {
       _gameOver = true
      this.$emit("game-over")
    },

    initCanvas() {

      this.canvas = document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");
      let xgList = this.xgList
      let hg = this.hg
      let canvas = this.canvas
      let ctx = this.ctx

      hg.time.setAcceList(4);
      hg.time.on('acce',(index)=>{
           this.createTime = 0.5 - 0.1*index;
       }).on('end',()=>{
         console.log( "time end", this )
           _gameOver = true;
           if(xgList.length == 1 && xgList[0] && xgList[0].type == 3){
               _ruleInfo.list += (_ruleInfo.list?',':'') + (-2) + ',' + xgList[0].index;
           }
           var that = this;
           setTimeout(()=>{
            that.$emit("game-over")
           },1000);
       });
       var gamePlayPanel_t = parseInt($('#gameLayerBox').css('top')) + 1;
       var gamePlayPanel_h = this.clientHeight - gamePlayPanel_t;

       $('#gameLayerBox').height(gamePlayPanel_h);
       var backingStore = ctx.backingStorePixelRatio ||
                       ctx.webkitBackingStorePixelRatio ||
                       ctx.mozBackingStorePixelRatio ||
                       ctx.msBackingStorePixelRatio ||
                       ctx.oBackingStorePixelRatio ||
                       ctx.backingStorePixelRatio || 1;
       this.ratio = (window.devicePixelRatio || 1) / backingStore;
       canvas.width = this.clientWidth* this.ratio;
       canvas.height = gamePlayPanel_h* this.ratio;
       canvas.style.width = this.clientWidth+"px";
       canvas.style.height = gamePlayPanel_h+"px";

       console.log( "ratio, canvas.width, canvas.height", this.ratio, canvas.width, canvas.height)
    },
    startGame(){
      // 0 ~ 14 之间随机数， 屏幕宽度为 16rem, rem把屏幕分为15个格
      // 100 个随机数，示例：游戏时间为30秒，每个小鬼显示 0.6秒，至少需要 50 个点
            this.xgDataList = this.dataList;
            this.xgDataList.uid = 0;
            _ruleInfo.list = '';

            window.scrollTo(0,0)
            this.initGame()
            this.hg.time.start();
      //},{"xg1":"4.15","xg2":"4.5","sign":"86a5cb409a60228c861a6600f9c00b49"});
    },
    zxgToFixed(num,bit){
        num = parseFloat(num.toFixed(bit||2));
        return (num === num ? num : 0)+'';
    },
    addXg(flag){
      let xgDataList = this.xgDataList
      let ratio = this.ratio
      let canvas = this.canvas
      let hg = this.hg
      let rem = this.rem
        if(flag !== 3 && this.bossTime){
            xgDataList.uid++;
            return;
        }
        var x,y;
        if(!flag){
            flag = (xgDataList.uid % 2) + 1;
            x = xgDataList[xgDataList.uid%xgDataList.length]* rem*ratio;

            var xgH = hg.edit.getImgInfo("xg"+flag).height*ratio;
            y = Math.floor(Math.random() * (canvas.height - xgH));
        }
        var xg = this.createXg(flag,x,y);
        if(flag == 1 || flag == 2){
            xg.uid = xgDataList.uid++;
        }
        this.xgList.push(xg);
    },
    createXg(flag,x,y){
      let hg = this.hg
      let canvas = this.canvas
      let ratio = this.ratio
        if(this.steps < 4){
            this.steps ++;
        }

        var xg = new ImageObject();
        if(flag == 1){
            var xg1 = hg.edit.getImgInfo("xg1");
            xg.image = hg.assets[xg1.path[0]];
            xg.w = xg1.width*ratio;
            xg.h = xg1.height*ratio;
            xg.x = x;
            xg.y = y;
            xg.type = 1;
        }else if(flag == 2){
            var xg2 = hg.edit.getImgInfo("xg2");
            xg.image = hg.assets[xg2.path[0]];
            xg.w = xg2.width*ratio;
            xg.h = xg2.height*ratio;
            xg.x = x;
            xg.y = y;
            xg.type = 2;
        }else if(flag == 3){
            var xg3 = hg.edit.getImgInfo("xg3");
            xg.image = hg.assets[xg3.path[0]];
            xg.w = xg3.width*ratio;
            xg.h = xg3.height*ratio;
            xg.x = (canvas.width - xg.w)/2;
            xg.y = (canvas.height - xg.h)/2;
            xg.index = 0;
            xg.type = 3;
        }
        HdGame.Guide.stop();

        if(this.steps < 4){
            var or = {};
            or.w = xg.w/ratio;
            or.h = xg.h/ratio;
            or.x = xg.x/ratio;
            or.y = xg.y/ratio;
            if(!HdGame.isplaySucess){
                HdGame.Guide.play($('#gameLayerBox'),or);
            }

        }
        return xg;
    },

    gamePlay(){
        if(_gameOver){
            return;
        }
        let ctx = this.ctx
        let scoreList = this.scoreList
        let xgList = this.xgList

        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        var currentTime = (new Date).getTime();

        let delta = (currentTime - this.xgTime)/1e3;
        delta > 0.5 && (delta = 0.5);

        this.xgTime = currentTime;
        this.showTime += delta;
        let i = 0
        for(i = 0; i < xgList.length; i++){
            var xg = xgList[i];
            xg.time += delta;

            if(xg.time > this.stayTime || (xg.flag && xg.type != 3 && xg.time > 0.5)){
                if(xg.opacity > 0){
                    xg.fadeOut -= delta;
                    xg.opacity = Math.max(xg.fadeOut / 0.16,0);
                    ctx.globalAlpha = xg.opacity;
                }else{
                    if(!xg.flag){//消失了还没点中说明连击断了。
                        this.combol = 0;
                    }
                    xgList.splice(i,1);
                    i--;
                    if(xg.type == 3){
                        _ruleInfo.list += (_ruleInfo.list?',':'') + (-2) + ',' + xg.index;
                        this.stayTime = 0.8;
                        this.bossTime = false;
                    }
                }
            }else{
                ctx.globalAlpha = 1;
            }
            if(xg.opacity > 0){
                this.drawImg(xg);
            }
        }

        if(this.showTime > this.createTime){
            this.addXg();
            this.showTime = 0;
        }
        if(this.combol == 15){
            this.xgList = [];
            this.addXg(3);
            this.stayTime = 5;
            this.combol = 0;
            this.bossTime = true;//出大鬼
        }

        for(i = 0; i < scoreList.length; i++){
            var score = scoreList[i];
            score.y -= 2;
            score.time += delta;

            if(score.time > 0.3){
                if(score.opacity > 0){
                    score.opacity -= 0.1;
                    ctx.globalAlpha = score.opacity;
                }else{
                    ctx.globalAlpha = 1;
                    scoreList.splice(i,1);
                    i--;
                }
            }else{
                ctx.globalAlpha = 1;
            }
            if(score.opacity > 0){
                this.drawImg(score);
            }
        }

        requestAnimFrame(this.gamePlay);
    },
    drawImg(t){
        this.ctx.drawImage(t.image,t.x,t.y,t.w,t.h);
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
