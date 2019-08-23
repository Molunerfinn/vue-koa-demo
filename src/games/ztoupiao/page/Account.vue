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
     <ul class="myWorks_list pd6" >
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
import $ from "jquery"
import {
  getRanking
} from '@/api/games/zxg'
import moment from 'moment';
import ModifyBox from './account/ModifyBox.vue'
import queryString from 'query-string'
import { getMyWorkInfo,getMyCardInfo } from '@/api/games/ztoupiao'
import { getPoster } from '@/api/albums.js'
import Swiper from 'swiper'
import SlideBox from './slide.vue'

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
    window.$ = $

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
    getMyCardInfo(number, params).then(data => {
      console.log('getMyCardInfo---:',data);
      // this.myCards = data;
    });
    getPoster(number, params).then((data) => {
      this.postersData = data
      console.log('this.postersData----:', this.postersData)
      this.$nextTick(()=> {
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
  })

    })

  },
  mounted(){

  },
  computed:{
    hasRank(){
      return this.gamePlayerRank.length > 0
    },
    currentPlayerRank(){
      return (this.currentPlayer.rank!=undefined&&this.currentPlayer.rank!=null) && this.currentPlayer.rank>=0 ? this.currentPlayer.rank : '无'
    },
    displayStartAt(){
      return moment(this.gameRound.start_at).format('YYYY年MM月DD日 HH时mm分')
    },
    displayEndAt(){
      return moment(this.gameRound.end_at).format('YYYY年MM月DD日 HH时mm分')
    }
  },
  methods: {
    gotoMyAccountBox: function(){
      const parsed = queryString.parse(location.search)
      var number = parsed.number

      var params = {
        parsed: parsed,
        code:'ztoupiao'
      }
      getMyWorkInfo(number, params).then(data => {
        console.log('getMyWorkInfo---:',data);
        this.myWorks = data.gameAlbums;
        this.gamePlayer = data.gamePlayer
        console.log('gamePlayer in account',this.gamePlayer);
      });

      this.ui.modifyBoxVisible = false;
      this.ui.workVisible = true;
      this.ui.cardVisible = false;
    },
    showWork(){
      var that = this
      console.log('showWork');
      that.ui.workVisible = true
      that.ui.cardVisible = false
      this.ui.modifyBoxVisible = false
    },
    showCard(){
      var that = this
      console.log('showCard');
      that.ui.workVisible = false
      that.ui.cardVisible = true
      this.ui.modifyBoxVisible = false
    },
    modifyAlbum(album){
      this.album = album;
      this.ui.workVisible = false,
      this.ui.cardVisible = false,
      this.ui.modifyBoxVisible = true

    },

    //
    handleShowPopup( flag ){
      var silkBag = $("#ruleImg");
      var popupX = silkBag.offset().left + silkBag.width() / 2 + "px ";
      var popupY = silkBag.offset().top + silkBag.height() / 2 + "px";
      $("#poupInfoBox").css({
        "transform-origin": popupX + popupY,
        "-webkit-transform-origin": popupX + popupY
      });

      this.setSlideBar(true)
      this.showTab( flag  )
    },
    handleHidePopup(){
      var poupInfoBox = $("#poupInfoBox");
      poupInfoBox.removeClass("enlarge").removeClass("retrans");
      poupInfoBox.hide()
    },
    // 点击查看成绩
    setSlideBar(isAnimation){

        var anFlag = isAnimation;
        if (anFlag) {
          if (!$("#poupInfoBox").hasClass("enlarge")) {
            $("#poupInfoBox").addClass("enlarge")
          }
        } else {
          $("#poupInfoBox").addClass("retrans")
        }
        //$(".gameBox,.home,.body").addClass("overflow-y-hidden");
    },
    showTab( flag ){
      console.log('showTab',flag);
      $("#poupInfoBox").show();
      $(".poupTitleMune").removeClass("checked");

      $(".poupTitleBox .poupTitleMune").each(function(i, value) {
        if ($.trim($(this).attr("_flag")) == flag) {
          $(this).addClass("checked")
        }
      })

      $(".poupSlideBar .slideBarTip").css("left", (13.25 / this.menuLen) * flag + "rem")

      if (flag === 0) {
        this.poupRule()
      } else
      if (flag === 1) {
        this.poupRank()
      }
    },
    poupRank(){

      var params = {
        openid: this.gamePlayer.openid
      }
      getRanking(this.gameRound.number, params).then(data => {
        var rankInfo = data
        console.log('rankInfo====:',rankInfo);
        this.gamePlayerRank = rankInfo['allPlayer']
        this.currentPlayer = rankInfo['thisPlayer']
      })
      $('.poupMain').not("#rankBox").hide()
      $("#rankBox").show()
    },
    poupRule(){
      $('.poupMain').not("#ruleBox").hide()
      $("#ruleBox").show()
    }
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
