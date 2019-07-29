<template>
 <div class="ReviewBox" v-show="ui.reviewBoxVisible">
   <div class="reviewDesc">
     <p id="explaiDrawInfoBox" class="" v-html="gameRoundState.desc"></p>
   </div>
 </div>
</template>

<script>
import $ from "jquery"
import {
  getRanking
} from '@/api/games/zxg'
import moment from 'moment';

import HdGame from '@/lib/hdgame'
import GameRes from './game/GameRes'

import { getRoundState } from '@/api/games/ztoupiao'
import queryString from 'query-string'

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
    }
  },
  data() {
    return {
      skinAssets: {
        reviewDesc1ImgPath: GameRes.skinAssets.reviewDesc1ImgPath,
        reviewDesc2ImgPath: GameRes.skinAssets.reviewDesc2ImgPath,
        reviewDesc3ImgPath: GameRes.skinAssets.reviewDesc3ImgPath,
        reviewDesc4ImgPath: GameRes.skinAssets.reviewDesc4ImgPath,
      },
      ui:{
        reviewBoxVisible:false
      },
      style:{
        statusUserImg: {}
      },
      gameRoundState: {},
      gamePlayerRank: [],
      menuLen: 2,
      currentPlayer:{}
    }
  },
  created() {
    window.$ = $
    const parsed = queryString.parse(location.search)
    var number = parsed.number

    var params = {
      parsed: parsed,
      code: 'ztoupiao'
    }

    getRoundState(number, params).then(data => {
      console.log('data===:', data)
      this.gameRoundState = data
      this.countTime()
    })
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
        this.ui.reviewBoxVisible = true
      }
      if( val == false){
        this.ui.reviewBoxVisible = false
      }
    }
  }
}
</script>

<style lang="css" scoped>
  .ruleBox{

  }
  .poupMain{
    /*display: none;*/
  }
  .reviewDesc.img{
    width: 100%;
    height: auto;
  }
</style>
