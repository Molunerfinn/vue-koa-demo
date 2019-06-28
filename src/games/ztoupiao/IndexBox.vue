<template>
<div class="swiper-container swiper-container-initialized swiper-container-horizontal" v-show="ui.indexVisible">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img  @touchend="gotoReview"
           id="gotoReview"

           :src="skinAssets.reviewImgPath"/>
    </div>
    <div class="swiper-slide" id="gotoPhotographsImg">
      <img  @touchend="gotoPhotographs"
           id="gotoReview"
           :src="skinAssets.photographsImgPath"/>
    </div>
  </div>
  <div class="swiper-pagination"></div>
</div>
</template>

<script>
import GameRes from './game/GameRes'
import Swiper from 'swiper'
export default {
  props: {
    // params: { // 游戏成绩相关数据
    //   type: Object,
    //   default: {}
    // },
    // againCallback: {
    //   type: Function
    // },
    // gamePlayerAvatar:{
    //   default: ''
    // },
    // isVisible: {
    //   default: false
    // },
    command:{
      default: true // 可选值: showResult, showGift
    }
  },
  data() {
    return {
      skinAssets: {
        reviewImgPath: GameRes.skinAssets.reviewImgPath,
        photographsImgPath: GameRes.skinAssets.photographsImgPath
      },
      menuLen: 2,
      ui:{
        indexVisible : true
      },
      style:{
        statusUserImg: {}
      },
      mySwiper: null
    }
  },
  mounted(){
    this.mySwiper = new Swiper('.swiper-container',
      {
        direction: 'horizontal',
        loop : true,
        autoplay:true,
        noSwiping: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })
    this.mySwiper.on('click', (e) => {
      console.log(e)
    })
  },

  created() {
  },
  methods: {
    gotoReview(event){
      console.log('gotoReview');
    },
    gotoPhotographs(event){
      console.log('gotoPhotographs');
    },

  },
  watch: {
    command: function (val, oldVal) {
      var that = this
      //外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if( val == true){
        that.ui.indexVisible = true
      }
      if( val == false){
        that.ui.indexVisible = false
      }
    }

  }

}
</script>

<style>
.swiper-container {
  width: 100%;
  height: 100%;
}
.swiper-slide {
  text-align: center;
  font-size: 18px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
</style>
