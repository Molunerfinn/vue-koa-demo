<template>
<div class="resuleBox "  >
  <div id="resule-status-box" style="display:none" v-show="ui.statusBox">

    <div id="resule-status-scrollWrap" v-show="ui.statusScrollWrap">
      <div class="resule-bgLight" v-show="ui.statusBgLight"></div>
      <div id="resule-status-bird" v-show="ui.statusBird"></div>
      <div class="optContainer" style="height: 18.6rem; overflow-y:auto;">
        <div id="resule-status-head">
          <div class="resule-status-userImg" :style="style.statusUserImg">
            <img v-bind:src="params.headImg">
          </div>
          <div id="resule-status-ribbon" class="resule-status-ribbon"></div>
        </div>
        <div id="resule-status-body">
          <p class="youraward" style="font-size:0.8rem; line-height:1.2rem">您的成绩为：<span class="resuleArg" style="font-size:0.8rem;">{{params.gameScore}}</span><span class="result-scoreUnit" style="font-size:0.8rem;"><span class="gameScoreUnit"></span></span>
          </p>
          <p class="youraward costTime hide" style="font-size:0.8rem; line-height:1.2rem">达到该成绩用时：<span class="resuleArg" style="font-size:0.8rem;">{{params.gameCostTime}}</span><span class="result-scoreUnit" style="font-size:0.8rem;">个</span></p>
          <p class="youraward special hide" style="font-size:0.8rem; line-height:1.2rem">通关并且</p>
          <p class="beat-Percent hide" v-show="ui.statusBeatPercent">成功击败全国<span>{{params.beat}}</span>%的玩家</p>
          <p class="resule-status-minscorex" style="display:none;">成绩必须达到 <span class="resuleArg resulescoreLimit">{{params.minScore}}</span> <span class="gameScoreUnit">个</span>才能<span id="minscoreDrawFont">抽奖</span></p>

          <p id="bestArg" style="margin-top:0.5rem">最佳成绩为：<span class="resuleArg">{{params.bestScore}}</span><span class="result-scoreUnit"><span class="gameScoreUnit">个</span></span>
          </p>
          <p id="bestCostTime" style="display: none">达到最佳成绩用时：<span class="resuleArg">{{params.bestCostTime}}</span><span class="result-scoreUnit">个</span></p>
          <p id="bestRank">当前排名为：<span class="result-scoreUnit2">NO.</span><span class="resuleArg">{{params.rank}}</span></p>
          <p>成功击败<span class="resuleArg">{{params.beat}}</span>%的玩家</p>
          <div id="rank_showRule" style="text-decoration:underline;margin:0.7rem 0rem;" class="hide" onclick="showRule();">活动规则</div>

          <!-- <div id="resule-status-count" style="margin-top:0.6rem" v-show="ui.statusCount">
            <p class="totalDraw">您还有 <span id="totalDrawCount" class="resuleArg">{{params.totalCount}}</span> 次抽奖机会</p>
            <p class="dayDraw">今天还有 <span class="resuleArg dayDrawCount">{{params.count}}</span> 次机会抽奖</p>
            <p class="dayDraw4Total hide">今天可抽 <span class="resuleArg dayDrawCount"></span> 次</p>
          </div> -->

          <!-- <div id="resule-status-playinfo" style="margin-top:0.6rem">
            <p class="dayPlayHint">今天还有 <span class="resuleArg todayPlayCount"></span> 次参与机会</p>
            <p class="totalPlayHint">您还有 <span class="resuleArg totalPlayCount"></span> 次参与机会</p>
            <p class="dayPlayHint4Total">今天可参与 <span class="resuleArg todayPlayCount"></span> 次</p>
          </div> -->
        </div>
        <div id="resule-status-other" class="hide">
          <p style="font-size:0.8rem;font-weight:bold;">通关并且</p>
          <p class="resule-status-minscorex hide" style="margin: 10px 0px 50px;">成绩必须达到 <span class="resuleArg resuleArg-fail resulescoreLimit">{{params.minScore}}</span> <span class="gameScoreUnit">个</span>才能抽奖</p>
        </div>
        <div id="resule-sucReg" class="hide" style="margin-top:0.6rem"> </div>
        <div class="resule-foot-box">
          <div class="resule-foot-one">
            <div class="resule-button resule-one-button resule-status-gift hide">赶紧去抽奖</div>
            <div class="resule-button resule-one-button resule-status-reg hide">我要报名</div>
            <div class="resule-button resule-one-button resule-status-again hide">再玩一次</div>
            <div class="resule-button resule-one-button resule-status-send hide">领取礼品</div>
            <div class="resule-button resule-one-button resule-status-rightNow hide">马上PK</div>
          </div>
          <div class="resule-foot-two">
            <div  @touchstart="handlePlayAgain" class="resule-button resule-status-again restart-again ">再玩一次</div>
          </div>
        </div>
      </div>
      <div class="attentionBox">
        <div class=" resule-foot-box">
          <div id="drawMenuBtnBox" class="menuBtnBox resule-foot-two">
            <div  @touchend="handleSeeRank" id="resule_seeRank_show" class="resule-button resule-status-seeRank">排行榜</div>

          </div>
        </div>
        <div class="hdskillInfo skillInfo theRunningAdClass"><a class="theSpecialTarget" href="http://mp.weixin.qq.com/s?__biz=MjM5MTk5MjI3OA==&#x26;mid=209854000&#x26;idx=1&#x26;sn=82241d924839270d3ea820ad2d56c01b#rd">我也要创建活动</a>
          <span class="gotoFlag"><i></i></span>
        </div>
        <div class="holdBox"></div>
      </div>
    </div>

    <div id="resule-status-lotsBox" style="display:none">
      <img id="resule-status-lots" class="editTarget-lotsPot">
      <div id="resule-status-lotsHand" class="editTarget-lotsShakeHand">
        <div class="shakeHand"></div>
        <div class="shakeTxt"></div>
        <div class="waitDrawBtn" style="display:none">点击抽奖</div>
      </div>
    </div>
  </div>
  <div id="resule-gift-box" style="display:none">
    <div id="resule-gift-scrollWrap" class="resule-gift-overflowScrolling" style="padding-top:1.2rem;position:relative;z-index:300;">

      <div class="resule-bgLight"></div>

      <div id="luckContainer" style="position:absolute; width: 100%;z-index:250;">
        <p id="resule-gift-luck" style="text-align:center;">恭喜你获得了</p>

        <div class="imgContentLimit hide" style="width: 14rem; height: 30rem; position: absolute;"></div>
        <div class="imgContainer xydzp_GiftPos" style="position:relative;">
          <img id="resule-gift-sucImg" class="slaveImg">

        </div>

        <div id="resule-gift-foot">
          <p id="resule-gift-rank"> <span class="rank gifArg awardStyle"></span> </p>
          <p id="resule-gift-goods"> <span class="goods gifArg awardName"></span> </p>
        </div>

        <div id="resule-gift-buttonMenu">

          <div class="giftBtnBox lookDetail orangeBtn">
            <a class="seeAwardDetail buttonContent">查看奖品详情</a>
          </div>

          <div class="resule-gift-draw repeatDraw greenBtn flowBtn " data-awarded="true">继续抽奖</div>
          <div class="resule-gift-home menuBack menuBack2 greenBtn flowBtn">返回首页</div>

        </div>

      </div>
    </div>

    <div id="faiImgBox">
      <div class="cannotGetThePriceBox"></div>

      <img class="abs editTarget-theGetPricePic theUnPriceImg imgPreventDefault" id="theGetPricePic" />

      <div class="resule-gift-draw repeatDraw ">继续抽奖</div>
      <div class="resule-gift-home menuBack menuBack2">返回首页</div>

    </div>

    <div id="resule-gift-buttonMenu-bottom">

      <div class="giftBtnBox lookDetail orangeBtn">
        <a class="seeAwardDetail buttonContent">查看奖品详情</a>
      </div>

      <div class="bottom-line">
        <div class="resule-gift-draw repeatDraw greenBtn flowBtn " data-awarded="true">继续抽奖</div>
        <div class="resule-gift-home menuBack menuBack2 greenBtn flowBtn">返回首页</div>
      </div>

    </div>

    <div class="attentionBox">

      <div class="menuBtnBox btnB" style="margin-bottom:4rem;">

        <a class="menuName">关注我们</a>
      </div>
      <div class="holdBox"></div>
    </div>
  </div>
</div>
</template>

<script>

import HdGame from '@/lib/hdgame'
export default {
  props: {
    params: { // 游戏成绩相关数据
      type: Object,
      default: {}
    },
    homeCallback: {
      type: Function
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
      //this.giftBox = $("#resule-gift-box");
      //this.resuleBox = $(".resuleBox");
      //this.statusBox = $("#resule-status-box");

      //$(document).on("touchend", ".resule-status-home , .resule-gift-home, .resule-gift-home2",

      event.preventDefault();
      event.stopPropagation();
      // HdGame.logDog(1000015);
      // HdGame.fadIn(that.resuleBox,
      //   function () {
      //     that.giftBox.hide();
      //     that.statusBox.hide();
      //     $(".gameBox,.home,.body").removeClass("overflow-y-hidden");
      //   });
      this.homeCallback();

    },
    // 再玩一次
    handlePlayAgain( event){
       //HdGame.ajaxLoad.show();

       //HdGame.ajaxLoad.hide();
       //$(".gameBox,.home,.body").removeClass("overflow-y-hidden");
       // HdGame.fadIn(that.resuleBox,
       // function() {
       //   that.giftBox.hide();
       //   that.statusBox.hide()
       // })

       this.againCallback();

    },
    // 点击查看成绩
    handleSeeRank( event ){
        event.preventDefault();
        event.stopPropagation();
        // if (g_config.createTime > 1520265601000 && gameType == 1) {
        //   window.showRule()
        // } else {
        //   window.showRank()
        // }
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
      if (arg.isSuc) {
        //游戏成功
        HdGame.isplaySucess = true;
        this.ui.statusBird = false
        //$("#resule-status-ribbon").removeClass("resule-status-faiRibbon").removeClass("resule-status-faiRegRibbon").addClass("resule-status-ribbon");
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
        //$("#resule-status-ribbon").removeClass("resule-status-ribbon").addClass("resule-status-faiRegRibbon")
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

    }
  }
}
</script>

<style lang="css" scoped>

</style>
