<template>
  <div class="gameBox gameBgBox" >
    <div id="gameBgBox">
      <img id="gameBg" :src="gameBg" style="width:100%;height:auto;" />
    </div>

    <div id="gameTopBar" class="gameTopBar" style="color:;background-color:">
      <div class="userInfoBox">
        <div class="userImgBox" style="border-color:"><img :src="game_player.avatar" class="userImg" /></div>
      </div>
      <div class="timeBox">
        时间<br><span class="time">0</span>
      </div>
    </div>
    <div id="gameImgBox">
      <div id="gameImg" v-show="ui.gameImgVisible"></div>
      <Puzzle ref="puzzle" :img-url="gameImgUrl" v-show="ui.gameImgWrapVisible"></Puzzle>
    </div>
    <div class="imgContainer absCenter" style="top:0;">
      <div id="gameStartBtns" class="slaveImg abs" style="width:7rem;height:2rem;top:21rem;left:4.5rem;" >
        <img id="gameStartImg" webp_src="http://8171176.h40.faiusr.com/4/29/ACgIABAEGAAgvrijyQUo4NfvyAEwmAI4UQ.png" v-show="ui.gameStartImgVisible"/>
        <img id="tipsImg" style="display:none;" webp_src="http://8171176.h40.faiusr.com/4/29/ACgIABAEGAAgvLijyQUorPrshgYwmAI4UQ.png" v-show="ui.tipsImgVisible"/>
      </div>
    </div>
    <div class="timeUpImg hide"></div>
    <div class="soundIconOff soundIcon" style="z-index:700" ></div>

  </div>

</template>

<script>

//const _resRoot = '/static/kouhong'

//import HdGame from '@/lib/hdgame'
import GameArg from './GameArg'
import Puzzle from './Puzzle.vue'

//LGlobal.setDebug(true);
//LGlobal.displayState = LGlobal.FULL_SCREEN
//LGlobal.width = 640;
//LGlobal.height = LGlobal.width * window.innerHeight / window.innerWidth;

//LInit(50, 'legend', LGlobal.width, LGlobal.height, main);

// eventBus
import { GameEndEvent,  GameScoreChangedEvent } from '@/lib/GameEvent'

const game_assets = {
        gameStartBtn : 'http://8171176.h40.faiusr.com/4/29/ACgIABAEGAAgvrijyQUo4NfvyAEwmAI4UQ.png',
        tipsBtn : 'http://8171176.h40.faiusr.com/4/29/ACgIABAEGAAgvLijyQUorPrshgYwmAI4UQ.png',
        gameImg : '/static/dp-pintu/image/gameimg.jpg',
};

export default {
  name: 'game',
  props:{
    // hg, 保存游戏的所有资源，图片，音乐，时间，分数
    hg: Object,
    // 游戏初始化的状态
    command: {
      type: [String, Number],
      default: 0
    }
  },
  components:{
    Puzzle
  },
  data () {
    return {
      gameBg: require('@/assets/dp-pintu/image/skin1/wx/gameBg.jpg'),
      gameImgUrl: '/static/dp-pintu/image/gameimg.jpg',
      game_player: game_assets.gameImg,
      ui:{
        gameBoxVisible: false,
        gameStartImgVisible: false,
        gameImgWrapVisible: false,
        gameImgVisible: false,
        tipsImgVisible: false
      },
      gameOver: false,
      rem: 20
    }
  },
  created(){
    this.rem = window.g_rem

  },
  mounted(){
    console.log( "mounted props=", this.hg, this.command)
    this.handleInitGameData()

    GameArg.eventBus.$on(GameEndEvent.name, (event)=>{
      this.hg.time.end();
      this.gameOver = true;
      this.gameOver(this.hg.time.val);
      console.log( "GameEndEvent1")
    })


    GameArg.eventBus.$on(GameScoreChangedEvent.name, (event)=>{
      this.hg.grade.inc(10);
      console.log( "GameScoreChangedEvent0")
      this.hg.sound.play(1);
      console.log( "GameScoreChangedEvent1")
    })

    this.hg.time.on( 'setTime', (e)=>{
      console.log( "setTime", e)
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
  methods:{
    handleStartGame(){

      if(GameArg.firstFlag){
          GameArg.firstFlag = false;
          this.ui.gameStartImgVisible=false
          this.ui.gameImgVisible = false
          this.ui.tipsImgVisible = true
          this.ui.gameImgWrapVisible = true
          this.hg.time.start()
          this.$nextTick( ()=>{
            //gameImgWrapVisible 显示之后才能取得 width，height
            this.$refs['puzzle'].initGame()
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

         this.ui.gameImgWrapVisible = true
         this.ui.tipsImgVisible = false
         this.ui.gameImgWrapVisible = false
         this.ui.gameImgVisible = true
         GameArg.firstFlag = true;
         GameArg.toggleFlag = true;
         this.gameOver = false;
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
      if( val== 'initial'){
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
