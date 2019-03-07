<template>
  <div id="app">
     this is kouhong game.

     <div class="home">
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
         <img id="startBtnImg" class="slaveImg abs" :src="startBtnImg" style="width: 6.66rem; height: 2.449333333333334rem;    top: 19.706666666666667rem;  left: 4.67rem;" />
       </div>
     </div>

     <Game :hd="hd"> </Game>
  </div>
</template>

<script>

import Game from './game/Game.vue'
import GameRes from './game/GameRes'
import HgGame from '@/lib/hdgame'

export default {
  name: 'app',
  components: {
    Game
  },
  created(){
    HgGame.initJsHead(this.hd, GameRes)
  },
  data(){
    return {
      hd:{},
      homeBgImg: require('@/assets/kouhong/image/skin1/wx/ACgIABACGAAg5_-r4AUojOO-xgcwgAU4wAw.jpg'),
      titleImg: require('@/assets/kouhong/image/skin1/wx/ACgIABAEGAAg_e-r4AUoi5fylAQwugQ4tAE.png'),
      startBtnImg: require('@/assets/kouhong/image/skin1/wx/ACgIABAEGAAgjPDr4AUo8MCYpgMw9AM4yAE.png')
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
}
.kouhong{
  font-size: 14px;
}
</style>
