<template>
  <!-- 锦囊 -->
 <div class="MyAccountBox">
<SlideBox></SlideBox>
   <div class="swiper-container swiper-container-initialized swiper-container-horizontal">
     <div class="swiper-wrapper">
       <div class="swiper-slide" v-for="photo in postersData">
         <img  :src="photo.originalUrl"/>
       </div>
     </div>
     <div class="swiper-pagination"></div>
   </div>



   <div class="works_list">
     <div class="weui-navbar works">
       <div class="weui-navbar__item" @touchend="showWork()">
         我的作品
       </div>
     </div>
     <ul class="myWorks_list pd12" >
       <li v-for="work in myWorks">
         <img :src="work.Photos[0].originalUrl" @touchend="modifyAlbum(work)"/>
         <p> <span>{{work.name}}</span>
           <span>{{work.score}}</span>
         </p>
         <div class="userImgBox" ><img :src="gamePlayer.avatar" class="userImg" /></div>
       </li>
     </ul>
   </div>
     <ModifyBox :gamePlayer="gamePlayer" :album="album" :command="ui.modifyBoxVisible" @gotoMyAccountBox="gotoMyAccountBox"> </ModifyBox>

 </div>
</template>

<script>

import ModifyBox from './account/ModifyBox.vue'
import queryString from 'query-string'
import { getMyWorkInfo } from '@/api/games/ztoupiao'
import SlideBox from './slider.vue'

export default {
  props: {
    ruleIconUrl: String, // 锦囊按钮图片
    gameResult:{
      type: Array
    }
  },
  components: {
    SlideBox,
    ModifyBox
  },
  data() {
    return {
      postersData: [],
      getRoundState:{},
      ui:{
        myAccountVisible:false,
        workVisible:true,
        cardVisible:false,
        modifyBoxVisible:false
      },
      style:{
        statusUserImg: {}
      },
      gamePlayer:{},
      gamePlayerRank: [],
      menuLen: 2,
      currentPlayer:{},
      myWorks:[],
      myCards:[],
      album:{},
      mySwiper: null
    }
  },
  created() {

    const parsed = queryString.parse(location.search)
    var number = parsed.number

    var params = {
      parsed: parsed,
      code:'ztoupiao',
      number:number
    }

    getMyWorkInfo(number, params).then(data => {
      console.log('getMyWorkInfo---:',data);
      this.myWorks = data.gameAlbums;
      this.gamePlayer = data.gamePlayer
      console.log('gamePlayer in account',this.gamePlayer);
    });


  },
  mounted(){

  },
  computed:{

  },
  methods: {


  },
  watch: {
  }
}
</script>

<style>
  .weui-navbar.works{
    position: relative;
  }
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
