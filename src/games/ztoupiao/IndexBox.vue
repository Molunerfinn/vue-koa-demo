<template>
<div class="IndexBox"  >
  <article class="weui-article main">
    <div class="swiper-container" >
      <section class="swiper-wrapper">

          <p class="photo_item swiper-slide">
            <%=link_to "/review" do %>
              <%=image_tag "poster1.jpg", id:"poster2" %>
            <%end%>
          </p>
          <p class="photo_item swiper-slide">
            <%=link_to new_activity_photograph_path(@activity), remote:true do %>
              <%=image_tag "poster2.jpg", id:"poster3" %>
            <%end%>
          </p>
      </section>


      <div class="swiper-pagination"></div>
    </div>
  </article>
</div>
</template>

<script>
import $ from "jquery";
import HdGame from '@/lib/hdgame'

export default {
  props: {
    params: { // 游戏成绩相关数据
      type: Object,
      default: {}
    },
    againCallback: {
      type: Function
    },
    gamePlayerAvatar:{
      default: ''
    },
    isVisible: {
      default: false
    },
    command:{
      default: 'none' // 可选值: showResult, showGift
    }
  },
  data() {
    return {
      menuLen: 2,
      ui:{
        statusBox: true,
        statusScrollWrap: true
      },
      style:{
        statusUserImg: {}
      }
    }
  },

  created() {
    // HdGame.resulePoup.init({
    //   drawType: 1,
    //   checkRegUrl: '/ajax/hdgame_h.jsp?cmd=checkRegNum&aid=10168245&gameId=50&openId=tryPlay_12435152',
    //   regUrl: '/ajax/hdgame_h.jsp?cmd=setPlayerReg&aid=10168245&gameId=50&openId=tryPlay_12435152&flag1=true',
    //   home: typeof home !== 'undefined' ? home : null,
    //   again: typeof gameRestart !== 'undefined' ? gameRestart : null,
    //   giftInit: HdGame._luckDrawFunc,
    // });
  },
  methods: {
    // 返回首页
    handleGoHome(event) {
      this.$emit('homeBtnClicked')

    },
    // 再玩一次
    handlePlayAgain( event){
      this.$emit('Restart')
       // this.againCallback();

    },
    // 点击查看成绩
    handleSeeRank( event ){
      console.log( " handleSeeRank ")
      this.$emit('rankBtnClicked')
    },

    showResult(){
      var resuleDef = {
        isSuc: false,
        gameScore: 0,
        minScore: 0,
        bestScore: 10,
        rank: 10,
        count: 3,
        beat: 99,
        notreal: false,
        gameType: 0,
        gameCostTime: 0,
        bestCostTime: 0
      };
      console.log('params=====:',this.params);
      var arg = Object.assign(resuleDef, this.params);
      //this.resuleArg = arg; ! arg.notreal && (HdGame.currentRank = arg.rank); ! arg.notreal && (HdGame.currentScore = arg.bestScore);
      //HdGame.wxConfig.setWxShareByStatus();
      this.ui.statusScrollWrap = true
      //$("#resule-status-lotsBox,#resule-gift-box").hide();
      //$(".resule-one-button").hide();
      //$("#resule-status-playinfo").hide();
      this.ui.statusBox= true

      //HdGame.fadOut(this.resuleBox);
      //$("#resule-status-scrollWrap").css("height", $(window).height() - 1.2 * g_rem);
      if (arg.gameScore === "fail") {
        this.ui.statusBody = false
        this.ui.statusOther = true
      } else {
        this.ui.statusBody = true
        this.ui.statusOther = false
      }
      console.log('arg in result=====:',arg);
      if (arg.isSuc) {
        //游戏成功
        HdGame.isplaySucess = true;
        this.ui.statusBird = false
        $("#resule-status-ribbon").removeClass("resule-status-faiRibbon").removeClass("resule-status-faiRegRibbon").addClass("resule-status-ribbon");
        this.style.statusUserImg = {borderColor: "#70D572"}
        this.ui.statusMinscore = false
        this.ui.statusCount = true

        if (arg.gameType == 1) {
          this.ui.statusCount = false
          //$("#resule-foot-box").css("margin-top", "0.6rem");
          this.ui.statusAgain = true
          this.ui.statusHome = true

          //HdGame.logDog(1000035);
          // if (g_config.createTime > 1520265601000) {
          //   $(".resule-foot-one .resule-status-again").html("刷记录");
          //   $(".resule-foot-one .resule-status-reg").hide();
          //   $(".resule-foot-one .resule-status-again").show();
          //   $("#resule-sucReg").show()
          // } else {
          //   if (!g_config.isReg) {
          //     $(".resule-foot-one .resule-status-reg").show()
          //   } else {
          //     $(".resule-foot-one .resule-status-again").html("继续刷记录");
          //     $(".resule-foot-one .resule-status-reg").hide();
          //     $(".resule-foot-one .resule-status-again").show();
          //     $("#resule-sucReg").show()
          //   }
          // }
        }

        //resulePoup.exposeFlag = true;
        this.ui.statusBgLight = true

        this.ui.statusBeatPercent = true
      } else {
        //游戏失败, 飞乌鸦
        this.ui.statusBird = true
        $("#resule-status-ribbon").removeClass("resule-status-ribbon").addClass("resule-status-faiRibbon")
        this.style.statusUserImg = {borderColor: "#B5B5B5"}

        this.ui.statusMinscore = true
        this.ui.statusCount = false
        this.ui.statusBgLight = false
        //$(".resule-foot-one .resule-status-gift").hide();
        //$(".resule-foot-one .resule-status-reg").hide();
        //$(".resule-foot-one .resule-status-again").show();
        this.ui.statusAgain = true
        this.ui.statusHome = true

        //$("#resule-status-bird").removeClass("resule-status-birdfly").addClass("resule-status-birdfly");
        this.ui.statusBeatPercent = false
        HdGame.isplaySucess = false
      }
    }
  },
  watch: {
    command: function (val, oldVal) {
      //外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if( val == 'showResult'){

        this.showResult()
      }
      this.$emit('commandDone')

    }
  }

}
</script>

<style lang="css" scoped>

</style>
