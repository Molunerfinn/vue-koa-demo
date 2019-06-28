<template>
  <!-- 锦囊 -->
 <div class="WorksBox" v-show="ui.worksVisible">
   <div class="works_list">
     <div class="weui-navbar works">
       <div class="weui-navbar__item" @touchend="showNew()">
         最新
       </div>
       <div class="weui-navbar__item" @touchend="showHot()">
         最热
       </div>
     </div>
     <div class="works_list new" v-show="ui.newAlbumsVisible">
       最新
       <li v-for="album in newGameAlbums">
         <img  :src="album.image_file_name"/>
         <a>{{album.name}}</a>
         <a>{{album.score}}</a>
         <div class="userImgBox" style="border-color:"><img :src="album.GamePlayers.avatar" class="userImg" /></div>
       </li>
     </div>
     <div class="works_list hot" v-show="ui.hotAlbumsVisible">
       最热
       <li v-for="album in hotGameAlbums">
         <img  :src="album.image_file_name"/>
         <a>{{album.name}}</a>
         <a>{{album.score}}</a>
         <div class="userImgBox" style="border-color:"><img :src="album.GamePlayers.avatar" class="userImg" /></div>
       </li>
     </div>
   </div>

 </div>
</template>

<script>
import $ from "jquery"
import {
  getRanking
} from '@/api/games/zxg'
import moment from 'moment';
// import { getRoundState } from '@/api/games/ztoupiao'
// import queryString from 'query-string'

import queryString from 'query-string'
import { getNewAlbumInfo,getHotAlbumInfo } from '@/api/games/ztoupiao'

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
    gamePlayer:{
      type: Object
    },
    gameResult:{
      type: Array
    }
  },
  data() {
    return {
      getRoundState:{},
      ui:{
        worksVisible:false,
        newAlbumsVisible:true,
        hotAlbumsVisible:false,
      },
      timeToEnd:{
        d1:0,
        d2:0,
        h1:0,
        h2:0,
        m1:0,
        m2:0,
        s1:0,
        s2:0,
      },
      style:{
        statusUserImg: {}
      },
      gamePlayerRank: [],
      menuLen: 2,
      currentPlayer:{},
      newGameAlbums:[],
      hotGameAlbums:[]
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

    getNewAlbumInfo(number, params).then(data => {
      console.log('getNewAlbumInfo---:',data);
      this.newGameAlbums = data;
    });
    getHotAlbumInfo(number, params).then(data => {
      console.log('getHotAlbumInfo---:',data);
      this.hotGameAlbums = data;
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
    countTime: function () {

      var that = this
      // 获取当前时间

      // 设置截止时间
      var endDate = new Date(this.getRoundState.end_at)
      var end = endDate.getTime()
      // 时间差
      // 定义变量 d,h,m,s保存倒计时的时间
      setInterval(function(){
        var date = new Date()
        var now = date.getTime()
        var leftTime = end - now
        if (leftTime >= 0) {
          var d = Math.floor(leftTime / 1000 / 60 / 60 / 24)
          that.timeToEnd.d1 = parseInt(d/10);
          that.timeToEnd.d2 = parseInt(d%10);
          var h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
          that.timeToEnd.h1 = parseInt(h/10);
          that.timeToEnd.h2 = parseInt(h%10);
          var m = Math.floor(leftTime / 1000 / 60 % 60)
          that.timeToEnd.m1 = parseInt(m/10);
          that.timeToEnd.m2 = parseInt(m%10);
          var s = Math.floor(leftTime / 1000 % 60)
          that.timeToEnd.s1 = parseInt(s/10);
          that.timeToEnd.s2 = parseInt(s%10);
        }
      },1000);
    },
    showNew(){
      var that = this
      console.log('showNew');
      that.ui.newAlbumsVisible = true
      that.ui.hotAlbumsVisible = false
    },
    showHot(){
      var that = this
      console.log('showHot');
      that.ui.newAlbumsVisible = false
      that.ui.hotAlbumsVisible = true
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
        this.ui.worksVisible = true
      }
      if( val == false){
        this.ui.worksVisible = false
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
