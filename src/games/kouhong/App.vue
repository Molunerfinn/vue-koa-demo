<template>
  <div id="app">
     <div class="home" v-show="ui.homeVisible">
       <div id="homeBgBox">
         <img id="homeBg" :src="homeBgImg" />
       </div>
       <div class="gameInfoBox">
         <div class="titleImg imgContainer absCenter">
           <img id="titleImg" class="slaveImg abs" :src="titleImg" style="width:15.232rem;height:5.778666666666667rem;top:2.524rem;left:0.384rem;" />
         </div>
       </div>


       <div id='joinNumLine' class='joinNumLine absCenter' style='top:23.424rem;left:3.3706666666666667rem;color:rgb(255,255,255);font-size:0.5546666666666666rem; text-shadow:rgb(255,62,7) -1px -1px 0px, rgb(255,62,7) 0px -1px 0px, rgb(255,62,7) 1px -1px 0px, rgb(255,62,7) 1px 0px 0px, rgb(255,62,7) 1px 1px 0px, rgb(255,62,7) 0px 1px 0px, rgb(255,62,7) -1px 1px 0px, rgb(255,62,7) -1px 0px 0px;'>
         已有 <span id='joinNum' class="specil" style="color:rgb(255,255,255);font-size:0.5546666666666666rem;text-shadow:rgb(255,62,7) -1px -1px 0px, rgb(255,62,7) 0px -1px 0px, rgb(255,62,7) 1px -1px 0px, rgb(255,62,7) 1px 0px 0px, rgb(255,62,7) 1px 1px 0px, rgb(255,62,7) 0px 1px 0px, rgb(255,62,7) -1px 1px 0px, rgb(255,62,7) -1px 0px 0px;">4346</span>        人参加活动</div>


       <div id="playInfo" class="abs editTarget-playInfo hide" style="width:9rem;text-align:center;">
         <div class="dayPlayHint">您今天还有 <span id="count" class="specil todayPlayCount"></span> 次参与机会</div>
         <div class="totalPlayHint">您还有 <span class="totalPlayCount specil"></span> 次参与机会</div>
         <div class="dayPlayHint4Total">今天有 <span class="count specil todayPlayCount"></span> 次</div>
       </div>
       <div id="startBtn" class="startBtn imgContainer absCenter" style="top:0rem;">
         <img @click="handleStartGame" id="startBtnImg" class="slaveImg abs" :src="startBtnImg" style="width: 6.66rem; height: 2.449333333333334rem;    top: 19.706666666666667rem;  left: 4.67rem;" />
       </div>
     </div>

     <Game ref="game" :hg="hg" :gamestate="gameState" > </Game>
  </div>
</template>

<script>

import Game from './game/Game.vue'
import GameRes from './game/GameRes'
import HdGame from '@/lib/hdgame'

//const hg = {}
// const g_config = {
//   HWRatio: 1.608,
//   ipInfo: {
//     provice: null,
//     city: null
//   }
// }
export default {
  name: 'app',
  components: {
    Game
  },
  created(){
    HdGame.initJsHead(this.hg, GameRes)
  

    console.log( "created gameState=", this.gameState)
  },
  data(){
    return {
      hg:{
        showGameBox: true
      },
      gameState: 'initial',
      homeBgImg: require('@/assets/kouhong/image/skin1/wx/ACgIABACGAAg5_-r4AUojOO-xgcwgAU4wAw.jpg'),
      titleImg: require('@/assets/kouhong/image/skin1/wx/ACgIABAEGAAg_e-r4AUoi5fylAQwugQ4tAE.png'),
      startBtnImg: require('@/assets/kouhong/image/skin1/wx/ACgIABAEGAAgjPDr4AUo8MCYpgMw9AM4yAE.png'),
      ui:{
        homeVisible: true, // 初始页面是否可见，游戏时需要隐藏
        ruleImgVisible: true, // 锦囊按钮
        loadToastVisible: false
      }
    }
  },
  methods:{
    handleStartGame(event){
      let that = this
      //点击开始按钮，开始游戏
      console.log( `handleStartGame=${this.gameState}`)
      //this.$refs.game.initGame()
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
        //$('.home, #ruleImg').hide();
        //$('.gameBox').show();
        // if (typeof hg.sound.cache[0] !== 'undefined' && typeof hg.sound.cache[0].playing !== 'undefined' && !hg.sound.cache[0].playing && g_config.style != 48 && g_config.style != 49 && g_config.style != 69) {
        //   hg.sound.readyPlay(0, 0, 'loop');
        // }
      }

      // 无论是否显示游戏界面都需要调用的功能
      function complete(result) {
        //HdGame.hideLoadToast();
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

        //hg.fireWith('startGame', self, [false, event, data, showGame]);
      }

      Promise.resolve().then(()=>{
        console.log( " then->handleResult")
        handleResult()
        this.gameState = 'start'
      }).catch((error)=>{
        console.log( " catch->handleFail", error)
        handleFail()
      })



    },

    activateSound() { //兼容ios下 WebAudio类型的对象无法自动播放，必须在点击事件中播放过一次，才允许播放
      try {
        if (HdGame.isIPhone() && this.hg.sound.list && this.hg.sound.list.length > 0 && !this.hg.sound._activate) {
          // $.each(hg.sound.list, function(i, val) {
          //   var data = hg.sound.cache[i];
          //   if (i > 0 && data && data.soundType == "LWebAudio") {
          //     data.play();
          //     data.stop();
          //   }
          // });
          this.hg.sound._activate = true;
        }
      } catch (e) {
        //HdGame.logStd("activateSoundErr", e);
      }
    }
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
.kouhong{
  font-size: 14px;
}
</style>
