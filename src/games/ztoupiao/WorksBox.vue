<template>
  <!-- 锦囊 -->
  <div class="WorksBox" v-show="ui.worksVisible">
    <div class="home" v-show="ui.showHome">
      <div class="weui-grids" style="background-color:#F8B62D;">
       <table style="width:100%;color:#40220F;">
         <tr><td colspan=3>&nbsp;</td></tr>
         <tr>
           <td align="center" style="border-right:solid 1px #40220F;">
             <table>
               <tr><td align="center">参与选手</td></tr>
               <tr><td align="center">{{gameRound.playerCount}}</td></tr>
             </table>
           </td>
           <td align="center" style="border-right:solid 1px #40220F;">
             <table>
               <tr><td align="center">累计投票</td></tr>
               <tr><td align="center">{{gameResult.length}}</td></tr>
             </table>
           </td>
           <td align="center">
             <table>
               <tr><td align="center">累计浏览</td></tr>
               <tr><td align="center">0</td></tr>
             </table>
           </td>
         </tr>
         <tr><td colspan=3>&nbsp;</td></tr>
       </table>
     </div>
      <div width="100%" align="center">
       <table style="width:100%;" cellpadding="0" cellspacing="0">
      <tbody><tr>
        <td align="center" colspan="2">&nbsp;</td>
        <td align="center" colspan="2" rowspan="2">距离活动结束还有</td>
        <td align="center" colspan="2">&nbsp;</td>
      </tr>
      <tr>
        <td align="center" colspan="2" style="border-top:solid 1px gray;border-left:solid 1px gray;">&nbsp;</td>
        <td align="center" colspan="2" style="border-top:solid 1px gray;border-right:solid 1px gray;">&nbsp;</td>
      </tr>
      <tr>
        <td align="center" style="border-bottom:solid 1px gray;border-left:solid 1px gray;">&nbsp;</td>
        <td align="center" rowspan="2">
          <table>
            <tbody><tr>
              <td><a id="d1" class="weui-btn weui-btn_primary countdown" href="javascript:;">{{timeToEnd.d1}}</a></td>
              <td><a id="d2" class="weui-btn weui-btn_primary countdown" href="javascript:;">{{timeToEnd.d2}}</a></td>
              <td>天</td>
            </tr>
          </tbody></table>
        </td>
        <td align="center" rowspan="2">
          <table>
            <tbody><tr>
              <td><a id="h1" class="weui-btn weui-btn_primary countdown" href="javascript:;">{{timeToEnd.h1}}</a></td>
              <td><a id="h2" class="weui-btn weui-btn_primary countdown" href="javascript:;">{{timeToEnd.h2}}</a></td>
              <td>时</td>
            </tr>
          </tbody></table>
        </td>
        <td align="center" rowspan="2">
          <table>
            <tbody><tr>
              <td><a id="m1" class="weui-btn weui-btn_primary countdown" href="javascript:;">{{timeToEnd.m1}}</a></td>
              <td><a id="m2" class="weui-btn weui-btn_primary countdown" href="javascript:;">{{timeToEnd.m2}}</a></td>
              <td>分</td>
            </tr>
          </tbody></table>
        </td>
        <td align="center" rowspan="2">
          <table>
            <tbody><tr>
              <td><a id="s1" class="weui-btn weui-btn_primary countdown" href="javascript:;">{{timeToEnd.s1}}</a></td>
              <td><a id="s2" class="weui-btn weui-btn_primary countdown" href="javascript:;">{{timeToEnd.s2}}</a></td>
              <td>秒</td>
            </tr>
          </tbody></table>
        </td>
        <td align="center" style="border-bottom:solid 1px gray;border-right:solid 1px gray;">&nbsp;</td>
      </tr>
      <tr>
        <td align="center">&nbsp;</td>
        <td align="center">&nbsp;</td>
      </tr>
      </tbody>
      </table>
      </div>
      <table class="activity_info" width="100%">
       <tr>{{gameRound.start_at}}至{{gameRound.end_at}}</tr>
       <tr>
         <td>
           <div id="actionExpBtn" class="poupTitleMune checked" _flag="0" @touchstart="showTab( 0 )">
             <div class="item">活动介绍</div>
           </div>
         </td>
       </tr>
       <tr>
         <td>
           <div id="ranBtn" class="poupTitleMune " _flag="1"  @touchstart="showTab( 1 )">
             <div class="item">投票排名</div>
           </div>
         </td>
       </tr>
     </table>
      <div id="ruleBox" class="poupMain" _flag="2" style="-webkit-overflow-scrolling:touch;">
       <div class="poupMainInfo">
         <div id="explainBox" class="poupLine" data-sortKey="a">
           <div class="mainTitle">游戏规则</div>
           <p id="explaiDrawInfoBox" class="" v-html="gameRound.desc">
           </p>
         </div>
       </div>
     </div>
      <div id="rankBox" class="poupMain hide" _flag="1" style="-webkit-overflow-scrolling:touch;">
       <div class="poupMainInfo">
         <div id="noRank" class='' v-show="!hasRank">暂无排名</div>
         <div id="rankMain" class="getRankHeight" v-show="hasRank">
           <div style="margin-top:0.7rem;margin-left: 0.25rem;">当前排名：<span id="rank"> {{currentPlayerRank}}</span> （只显示前<span id="showRankNum">100</span>名）</div>
           <div style="padding:0rem 0.5rem">
             <table class="rankTable" cellspacing="0" cellpadding="0">
               <thead>
                 <tr style="line-height: 1rem;">
                   <th>排行</th>
                   <th>头像</th>
                   <th>昵称</th>
                   <th>成绩</th>
                 </tr>
               </thead>
               <tr class="rankInfo" v-for="(player,i) in gamePlayerRank">
                 <td>{{i+1}}</td>
                 <td><div><img class="userImg" :src="player.avatar"   /> </div></td>
                 <td class="userName" > {{player.nickname}}</td>
                 <td> {{player.max_score}} 个</td>
               </tr>

             </table>
           </div>
         </div>
         <div id="rankHeight">
           <table id="rankInfoBox" class="rankTable" cellspacing="0" cellpadding="0" style="margin-top: 0;"></table>
         </div>
       </div>

     </div>
    </div>
    <WorksListBox :gameAlbums="gameAlbums" :command="ui.worksVisible" @showPhotosList="showPhotosList"> </WorksListBox>
  </div>
</template>

<script>
import $ from "jquery"
import {
  getRanking
} from '@/api/games/zxg'
import moment from 'moment';
import { getRoundState } from '@/api/games/ztoupiao'
import queryString from 'query-string'
import HdGame from '@/lib/hdgame'
import WorksListBox from './WorksListBox.vue'
export default {
  components: {
    WorksListBox
  },
  props: {
    gameAlbums:{
      type: Array
    },
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
        showHome: true
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
      currentPlayer:{}
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

    getRoundState(number, params).then(data =>{
      console.log('data===:',data);
      this.getRoundState = data
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
    showPhotosList: function(){
      this.ui.showHome = false
    },
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
      const parsed = queryString.parse(location.search);
      var params = {
        openid: parsed.openid
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
        this.ui.showHome = true
      }
      if( val == false){
        this.ui.worksVisible = false
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
</style>
