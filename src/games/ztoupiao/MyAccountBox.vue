<template>
  <!-- 锦囊 -->
 <div class="MyAccountBox" v-show="ui.myAccountVisible">
   <div class="works_list">
     <div class="weui-navbar works">
       <div class="weui-navbar__item" @touchend="showWork()">
         我的作品
       </div>
       <div class="weui-navbar__item" @touchend="showCard()">
         我的卡券
       </div>
     </div>
     <div class="myWorks_list" v-show="ui.workVisible">
       我的作品
       <li v-for="work in myWorks">
         <img :src="work.Photos[0].originalUrl" @touchend="modifyAlbum(work)"/>
         <a>{{work.name}}</a>
         <a>{{work.score}}</a>
         <div class="userImgBox" style="border-color:"><img :src="gamePlayer.avatar" class="userImg" /></div>
       </li>
     </div>
     <div class="myCards_list" v-show="ui.cardVisible">
       我的卡券
       <li v-for="card in myCards">
         <img  :src="card.Photos[0].originalUrl"/>
         <a>{{card.name}}</a>
         <a>{{card.score}}</a>
         <div class="userImgBox" style="border-color:"><img :src="card.GamePlayers.avatar" class="userImg" /></div>
       </li>
     </div>
   </div>
     <ModifyBox :gamePlayer="gamePlayer" :album="album" :gameRound="gameRound" :command="ui.modifyBoxVisible" @gotoMyAccountBox="gotoMyAccountBox"> </ModifyBox>

 </div>
</template>

<script>
import $ from "jquery"
import {
  getRanking
} from '@/api/games/zxg'
import moment from 'moment';
import ModifyBox from './ModifyBox.vue'
import queryString from 'query-string'
import { getMyWorkInfo,getMyCardInfo } from '@/api/games/ztoupiao'

import HdGame from '@/lib/hdgame'

export default {
  props: {
    gameRound: { // 游戏成绩相关数据
      type: Object
    },
    ruleIconUrl: String, // 锦囊按钮图片
    command:{
      default: false // 可选值: showResult, showGift
    },
    gameResult:{
      type: Array
    }
  },
  components: {
    ModifyBox
  },
  data() {
    return {
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
      album:{}
    }
  },
  created() {
    window.$ = $

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
    getMyCardInfo(number, params).then(data => {
      console.log('getMyCardInfo---:',data);
      // this.myCards = data;
    });

  },
  mounted(){
    // mounted 之后 document 才有ruleIme，可以设置css
    HdGame.imgReady(this.ruleIconUrl, (img)=>{
      console.log( "imgReady", this.ruleIconUrl)
      $("#ruleImg").css({
        "background-size": "100% 100%",
        "background-image":"url("+this.ruleIconUrl+")",
      })
      //this.ui.iconVisible = true // 如果是用户注册界面，不应显示icon
    })

    $(".poupTitleBox .poupTitleMune,.poupTitleBox .slideBarTip").css("width", 13.25 / this.menuLen + "rem");
    $("#poupInfoBox .poupMain").height($("#poupInfoBox").height() - $(".poupHead").outerHeight()  );


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
    command: function (val, oldVal) {
      //外部触发游戏开始
      console.log('rulebox','watch-command new: %s, old: %s', val, oldVal)
      if( val == true){
        this.ui.myAccountVisible = true
      }
      if( val == false){
        this.ui.myAccountVisible = false
      }
    }
  }
}
</script>

<style lang="css" scoped>
  .weui-navbar.works{
    position: relative;
  }
</style>
