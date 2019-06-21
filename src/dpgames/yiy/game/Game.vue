<template>
  <div class="gameBox gameBgBox" >
    <div id="gameBgBox">
      <img id="gameBg" :src="gameBg" style="width:100%;height:auto;" />
    </div>

    <div id="gameTopBar" class="gameTopBar" style="color:;background-color:">
      <div class="userInfoBox">
        <div class="userImgBox" style="border-color:"><img :src="gamePlayer.avatar" class="userImg" /></div>
      </div>
      <div class="timeBox">
        时间<br><span class="time">{{timeToEnd}}</span>
      </div>
    </div>
    <div id="gameImgBox">
      <div id="gameImg" v-show="ui.gameImgVisible"></div>
        <Puzzle ref="puzzle" :width="puzzleWidth" :height="puzzleHeight" :img-url="skinAssets.gameImg" v-show="ui.gameImgWrapVisible"></Puzzle>
    </div>
    <div class="imgContainer absCenter" style="top:0;">
      <div id="gameStartBtns" class="slaveImg abs" @click="handleStartGame" style="width:7rem;height:2rem;top:21rem;left:4.5rem;" >
        <img id="gameStartImg" :src="skinAssets.gameStartImg" v-show="ui.gameStartImgVisible"/>
        <img id="tipsImg" style="display:none;" :src="skinAssets.tipsImg" v-show="ui.tipsImgVisible"/>
      </div>
    </div>
    <div class="timeUpImg hide"></div>
    <div :class="[{ soundIconOff: soundoff }, 'soundIcon']" style="z-index:700" @touchstart="handlePlaySound"></div>

  </div>

</template>

<script>

import $ from "jquery";
import HdGame from '@/lib/hdgame'
import GameRes from './GameRes'
import GameArg from './GameArg'
import Puzzle from './Puzzle.vue'

//LGlobal.setDebug(true);
//LGlobal.displayState = LGlobal.FULL_SCREEN
//LGlobal.width = 640;
//LGlobal.height = LGlobal.width * window.innerHeight / window.innerWidth;

//LInit(50, 'legend', LGlobal.width, LGlobal.height, main);

// eventBus
import { GameEndEvent,  GameScoreChangedEvent } from '@/lib/GameEvent'



export default {
  name: 'game',
  props:{
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
    },
    timeToEnd: Number // 游戏时间计时
  },
  components:{
    Puzzle
  },
  data () {
    return {
      gameBg: require('@/assets/dp-pintu/image/skin2/gamebg.jpg'),
      ui:{
        gameBoxVisible: false,
        gameStartImgVisible: false,
        gameImgWrapVisible: false,
        gameImgVisible: false,
        tipsImgVisible: false
      },
      isgameOver: false,
      rem: 20,
      skinAssets: {
        gameStartImg : '/static/dp-pintu/skin2/startbtn2.png',
        tipsImg : '/static/dp-pintu/skin2/tipsbtn.png',
        gameImg : '/static/dp-pintu/skin2/gameimg.jpg',
      },
      puzzleWidth: 0,
      puzzleHeight: 0,
      soundoff: true
      //time: 0
    }
  },
  created(){
    this.rem = window.g_rem
    Object.assign( this.skinAssets, GameRes.skinAssets)

  },
  mounted(){
    console.log( "mounted props=", this.hg, this.command)
    this.handleInitGameData()

    GameArg.eventBus.$on(GameEndEvent.ename, (event)=>{
      this.hg.time.end();
      this.gameOver = true;
      this.$emit('game-over')
      console.log( "GameEndEvent1")
    })


    GameArg.eventBus.$on(GameScoreChangedEvent.ename, (event)=>{
      this.hg.grade.inc(10);
      console.log( "GameScoreChangedEvent0")
      this.hg.sound.play(1);
      console.log( "GameScoreChangedEvent1")
    })

    this.handleStartGame()
    // this.hg.time.on( 'setTime', (e)=>{
    //   this.time = e
    //   console.log( "setTime", e)
    // })
    // this.hg.time.on('end', this.endGame)

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

    HdGame.imgReady(this.skinAssets.gameImg, (img)=>{
        let selector = "#gameImg";
        let ele = $(selector)
        console.log("img=",img)
        //let originSize = query(selector).get([ 'offsetWidth', 'offsetHeight' ])
        let nowSize = HdGame.Img.calcSize( img.width, img.height, ele.outerWidth(), ele.outerHeight(),HdGame.Img.MODE_SCALE_DEFLATE_FILL);
        //console.log( " this.skinAssets.gameImg = ", this.skinAssets.gameImg, ele.outerWidth(), ele.outerHeight(),  nowSize )
        $(selector).css({
            "background-image":'url("'+this.skinAssets.gameImg+'")',
            "background-repeat":"no-repeat",
            "background-position":"center center",
            "background-size":nowSize.width+"px "+nowSize.height+"px"
        })
        this.puzzleWidth =  ele.outerWidth(true)
        this.puzzleHeight =  ele.outerHeight(true)
        this.$nextTick( ()=>{
          //gameImgWrapVisible 显示之后才能取得 width，height
          this.$refs['puzzle'].initGame()
        })
    })
    this.hg.assets.onload( ()=>{
      console.log( "hg.assets.onload")
      let bgHeight = HdGame.getBgHeight();
      $(".gameBgBox").css("height", bgHeight / this.rem + "rem")
    })

  },
  methods:{
    handleStartGame(){

      if(GameArg.firstFlag){
          GameArg.firstFlag = false;
          this.ui.gameStartImgVisible=false
          this.ui.gameImgVisible = false
          this.ui.tipsImgVisible = true
          this.ui.gameImgWrapVisible = true
          // this.hg.time.start()
          console.log('handleStartGame');
          this.$nextTick( ()=>{
            console.log('Tick');
            //gameImgWrapVisible 显示之后才能取得 width，height
          })
      }else if(GameArg.toggleFlag){
          this.ui.gameImgWrapVisible = false
          this.ui.gameImgVisible = true
          this.ui.gameStartImgVisible = true
          this.ui.tipsImgVisible = false
          GameArg.toggleFlag = false;
      }else{
          this.ui.gameImgWrapVisible = true
          this.ui.gameImgVisible = false
          this.ui.gameStartImgVisible=false
          this.ui.tipsImgVisible = true
          GameArg.toggleFlag = true;
      }

    },

    handleRestartGame(){

      this.handleInitGameData();
      this.startGame();
      this.hg.fire('again');

    },

    handleInitGameData() {
      this.hg.time.init();
      console.log( "handleInitGameData hg.time", this.hg.time )
      this.hg.grade.set(0);
      //$('.timeUpImg').hide();
    },

    initGame() {
         this.hg.time.init();
         //初始化游戏头部 头像，计时，分数
         this.ui.gameStartImgVisible = true
         this.ui.tipsImgVisible = false
         this.ui.gameImgWrapVisible = true
         this.ui.gameImgVisible = false
         GameArg.firstFlag = true;
         GameArg.toggleFlag = true;
         this.isgameOver = false;
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
    }


  },
  watch: {
    command: function (val, oldVal) {
      //外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if( val == 'start'){
        this.initGame()
      }
      if( val == 'restart'){
        this.handleRestartGame()
      }
      if( val== 'initial'){
        //this.handleInitGameData()
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
