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

import LGlobal from '@/lib/lufylegend/utils/LGlobal';
//import { LInit } from '@/lib/lufylegend/utils/Function';
//import LStageScaleMode from '@/lib/lufylegend/display/LStageScaleMode';
//import LStageAlign from '@/lib/lufylegend/display/LStageAlign';

LGlobal.width = 640;
LGlobal.height = LGlobal.width * window.innerHeight / window.innerWidth;

//LInit(50, 'legend', LGlobal.width, LGlobal.height, main);

export default {
  name: 'game',
  data () {
    return {
      game_player:{},
      msg: 'Welcome to Your Vue.js App'
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
