<template>
    <div :class="[{ soundIconOff: soundoff }, 'soundIcon']" style="z-index:700" @touchstart="handlePlaySound"></div>
</template>

<script>
import HdGame from '@/lib/hdgame'

export default {
  props:{
    // hg, 保存游戏的所有资源，图片，音乐，时间，分数
    hg: Object,
    gamePlayer:{
      type: Object,
    },
  },
  data () {
    return {
      soundoff: true,
    }
  },
  mounted(){
    let hg = this.hg
    hg.sound.get("0",
       (lsound)=> {
        lsound.on("play", () => {
          console.log( "sound on play")
          this.soundoff = false

        }).on("pause", () => {
          console.log( "sound on pause")
          this.soundoff = true
        })
    })

    let soundPauseCord = this.getSoundPauseCord()
    if (HdGame.getLocalStorage(soundPauseCord)) {
      hg.sound.allowPlay = false;
      hg.sound.pauseAll()
    }
  },
  methods: {
    handlePlaySound( event ){
      event.stopPropagation();
      event.preventDefault();
      var soundPauseCord = this.getSoundPauseCord()

      console.log( "handlePlaySound", (new Date()).getTime())
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
    getSoundPauseCord(){
      return "soundPause|" + this.gamePlayer.game_round_id + "|" + this.gamePlayer.openid
    }
  }
}
</script>

<style lang="css" >

</style>
