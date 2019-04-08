<style>

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
.bargain{
  font-size: 14px;
}
</style>

<template>

<div id="app">

  <!-- logo-->
  <div class="logoWrap">
      <img src="/static/bargain/images/skin1/wx/tu_05.png" class="logo">
  </div>
  <!-- 音乐播放 -->
  <div class="soundIcon soundIconOff" id="music"><div class="circle_hide">
    <audio  id="audiobg" loop="true" src="/static/bargain/audio/happynewyear.mp3"  type="audio/mpeg" > </audio>
  </div></div>
  <!-- 锦囊 -->
  <div id="jinnangWrap" >
    <a class="jinnang-open-btn" href="#"> 活动规则 </a>
    <div class="jinnang-container poupInfoBox" style="display:none;">
        <div class="jinnang-close-btn poupClose"></div>
        <div class="poupMain">
          <div class="poupHead" style="">
            <a class="weui-bar__item_on poupTitle" href="#descTab"><span class="innerText">活动规则 </span></a>
            <a class="poupTitle" href="#rankingTab" ><span class="innerText">排行榜	</span></a>
          </div>
          <div class="popuBody weui-tab__panel">
            <div id="descTab" class="poupTab weui-tab__bd-item weui-tab__bd-item_on">
              <div class="poupSection">
                <p class="title"> <span>活动规则 </span></p>
                <div class="desc" v-html="game_round.desc">

                </div>
              </div>
            </div>
            <div id="rankingTab" class="poupTab weui-tab__bd-item"  >
              <div class="ranking-wrap">
                <div class="m_clear player" style="border-bottom: 6px solid #cccccc;">
                  <div class="rank" style="">  </div>
                  <div class="avatar"  style=""> <img :src="game_player.avatar" style='float:left;'>
                    <div class="m_fl" style="line-height:20px;">
                      <span class="ellipsis" style="line-height:20px;"> ${game_player.nickname} </span><br/>
                      <span class="" style="line-height:20px;color:#f39700;"> 第 ${game_player.rank} 名 </span>
                    </div>
                   </div>
                  <div class="score" style="font-weight:bold;font-size:120%;color:#f39700;">  ${game_player.score} 元 </div>
                </div>

                <div class="ranking">
                  <div class="players">
                    <div class="m_clear player" v-for="(player,i) in game_player_rank">
                      <div class=" rank" style=""> ${i+1} </div>
                      <div class=" avatar" style="float:left;width:60%;text-align:left;"> <img :src="player.avatar"  >  <span class="ellipsis">  ${player.nickname} </span></div>
                      <div class="score" >  ${player.score} 分</div>
                    </div>
                  </div>
                </div>
                <div class="poupSection isFirstTimeLoading" style="text-align:center;">
                  <p class="title hide"> <span> 排行榜 <img src='/static/bargain/images/spinner.gif' /></span></p>
                </div>

              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
  <div class="page page-0" v-show="pageIndex==0">
    <div class="startwrap"> <button class="startbtn" @click="handleStartGame"> &nbsp;&nbsp;</button> </div>
    <div class="titlebg">
      <img src="/static/bargain/images/kj_05.png" class="gamelogo">
    </div>
    <div class="banner">
      <img src="/static/bargain/images/skin1/wx/banner.png" class="gamebanner">
    </div>

  </div>

  <div class="page page-1 main" v-show="pageIndex==1">
    <div id="scroller">
      <!-- 顶部图片 -->
       <div class="titlebg">
         <img src="/static/bargain/images/kj_05.png" class="gamelogo">
       </div>
       <div class="daojishi" v-if="t_time >= 0">
          <h3 class="jinse">距离活动结束还有</h3>
          <div class="shijian clear">
            <div class="shijian1">
              <div class="parttime"> <p class="bg"><span>${time.d[0]} </span> </p>  </div>
              <div class="parttime parttime-right"> <p class="bg"><span>${time.d[1]}</span> </p></div>
            </div>
            <div class="unit"><span>天</span></div>
            <div class="shijian1">
              <div class="parttime"> <p class="bg"><span>${time.h[0]} </span> </p>  </div>
              <div class="parttime parttime-right"> <p class="bg"><span>${time.h[1]}</span> </p></div>
            </div>
            <div class="unit">时</div>
            <div class="shijian2">
              <p class="bg"><span> </span> </p><p class="bg"><span ></span> </p>
              <p class="bg"><span> </span></p><p class="bg"><span ></span> </p>
              <p class="parttime">${time.m[0]}</p><p class="parttime parttime-right">${time.m[1] }</p>
            </div>
            <div class="unit">分</div>
            <div class="shijian2">
              <p class="bg"><span> </span> </p><p class="bg"><span ></span> </p>
              <p class="bg"><span> </span></p><p class="bg"><span ></span> </p>
              <p class="parttime">${time.s[0] }</p><p class="parttime parttime-right">${time.s[1] }</p>

            </div>
            <div class="unit">秒</div>
          </div>
        </div>
         <p class="futitle">
           <img src="/static/bargain/images/skin1/wx/game.jpg" alt="砍多少，送多少！">
         </p>
         <div class="progresswrap">
           <div class="c-weui-progress">
              <div class="c-weui-progress__bar">
                  <div class="c-weui-progress__inner-bar js_progress" :style="{width:js_progress_percent}">
                  </div>
                  <div class="yuan" :style="{ left:js_progress_percent}">
                    <div class="yuan1"></div>
                  </div>
                  <div class="text">
                    <p class="left ">￥${game_round.initial_score}</p>
                    <p class="right ">￥${game_round.final_score}</p>
                    <span class="score"> 已砍 ${to_game_player.score}元 </span>
                  </div>

              </div>
            </div>
          </div>
           <!-- 砍价按钮 -->
           <div class="anniu index_main">
             <template v-if="t_time > 0">
                 <template v-if="to_game_player.score == game_round.final_score">
                   <div class="index_main_two" v-if="!is_to_self && !is_raised">
                       <!--<button  @click = "updateContact()" >我要参加</button>-->
                       <button class="anniu2" @click="handleJoinGame">我要参加</button>
                   </div>
                 </template>
                 <template v-if="to_game_player.score != game_round.final_score">
                     <div class="index_main_two" v-if="!is_to_self && is_raised">
                         <button class="anniu1">您已为他砍过价</button>
                     </div>
                     <div class="index_main_two" v-if="!is_to_self && !is_raised">
                         <button class="anniu1" @click="handleRaiseUp">帮砍一刀</button>
                     </div>
                     <div class="index_main_two" v-if="is_to_self && is_raised">
                         <button @click="creatQRCodeImg">邀请好友帮砍</button>
                     </div>
                     <div class="index_main_two" v-if="is_to_self && !is_raised">
                         <button class="anniu2" @click="handleRaiseUp">为自己砍价</button>
                     </div>
                 </template>
                 <div class="index_main_two" v-if=" !is_to_self && is_raised && !has_contact">
                     <button class="anniu2" @click="handleJoinGame">我要参加</button>
                 </div>
                 <div class="index_main_two" v-if=" !is_to_self && is_raised && has_contact  ">
                   <button    @click="returnmodal()">返回我的活动</button>
                 </div>
             </template>
             <template v-else>
                   <div class="index_main_two" v-if=" !is_to_self && is_raised">
                       <button @click="returnmodal()">返回我的活动</button>
                   </div>
             </template>

           </div>
           <!-- 价格 -->
           <div class="index_price">
              <div class="index_price_two time" v-if="t_time <= 0">
               活动时间于 <span>${bargain.display_end_at}</span> 结束！
             </div>
             <div class="index_price_three" v-if="to_game_player.score == game_round.final_score">
               <span class="nickname">${to_game_player.nickname}</span><span>于</span> <span>${to_game_player.display_updated_at}</span><span>成功砍到底</span>
             </div>
           </div>
           <div class="prize_desc desc-wrap">
             <div class="desc-head"><div class="shuoming1"> <p>奖品描述</p> </div> </div>
             <div class="smk1" v-html="game_round.award_desc">
             </div>
          </div>
          <div class="prize_desc desc-wrap">
            <div class="desc-head"><div class="shuoming1"> <p>砍价规则</p> </div> </div>
            <div class="smk1" v-html="game_round.desc">

            </div>
          </div>
           <!-- 好友助力榜 -->
            <div class="biao">
             <ul class="biao1">
               <li class="lli1">
                 <P>好友助力榜单</P>
               </li>
               <li class="lli2" v-for="result in game_result_rank">
                 <div class="left nei_left">
                   <div class="txbg"><img :src="result.game_player.avatar" class="tx"></div>
                 </div>
                 <div class="nei_right">
                   <p class="nei_top">
                     <span class="name">${result.game_player.nickname}</span>
                   </p>
                   <p class="nei_down">
                   <span> 砍了</span>
                   <span class="huang">￥${result.score}</span>
                   </p>
                 </div>
               </li>
               <li class="empty" v-if="game_result_rank.length == 0">
                 暂无数据
               </li>

             </ul>
           </div>
      <!-- 当前排名 -->

      <div class="buttom_login"><img src="/static/bargain/images/loading.gif" alt=""></div>
      <div class="buttom_text">没有更多数据....</div>
    </div>

  </div>
  <!-- 分享二维码 -->
  <div class=" share-qrcode" style="display:none;" v-show="showQRCode">
    <div class="shade"> </div>
    <div class="shade_content">
      <p  > 长按保存图片，分享给好友！</p>
     <img id="share-qrcode-img"/>
     <div class="share-close-btn" @click="closeQRCodeDialog"> </div>
    </div>
  </div>

  <!-- 砍价 -->
  <div class="remove_price" @click="closeshade()">
    <div class="white_bg scaleDiv"><img src="/static/bargain/images/white_bg.png" alt=""></div>
    <div class="red_bg scaleDiv">
      <dd>运气不错哦！<br>此次砍下</dd>
      <dt>${dele_price}元!</dt>
    </div>
  </div>

  <!-- 我要参与 -->
  <div class="index_enter part_me" style="display:none;" v-show="showContact">
    <div class="index_enter_box">
      <div class="index_enter_main scaleDiv2">
        <div class="index_enter_head clearfix"><img src="/static/bargain/images/close.png" alt="" @click="closeContactDialog"></div>
        <div class="index_enter_text">所填信息不会公开，仅用于活动兑奖</div>
        <div class="index_enter_input">
          <div class="enter_input_one">
            <dd>姓名：</dd>
            <input type="text" placeholder="请输入您的真实姓名" v-model="form.realname">
          </div>
          <div class="enter_input_one">
            <dd>手机：</dd>
            <input type="text" placeholder="请输入您的手机号码" v-model="form.cellphone" maxlength="11">
          </div>
        </div>
        <div class="index_enter_btn">
          <button @click="updateContact">提 交</button>
        </div>
      </div>
    </div>
  </div>

  <!--login-->
  <div class="loading" v-show="loading">
  </div>

  <!-- 提示语 -->
  <div class="top_text" >
    <div class="top_text_box">${top.text}</div>
  </div>

</div>

</template>

<script>
import { getGameInfo, poll, updateGameDay, updateGamePlayerContact } from '@/api/games/bargain'

export default {
    name: 'app',
    data() {
      return {
        loading: false,
        t_time: 0,
        pageIndex: 0,
        game_player_rank: [],
        game_result_rank: [],
        to_game_player: { id: 0 },
        game_player: {},
        game_round: { start_at: null, end_at: null },
        game_result: {},
        form:{
           realname: null,
           cellphone: null
        },
        msg: 'this is world',
        showQRCode: false,
        showContact: false
      }
    },
    created(){
      let data=  {game_round_id:14,game_player_id:110}
      getGameInfo( data ).then((res)=>{
        console.log( 100000, res )
      })
    },
    computed:{
      // 当前玩家助力状态   已经助力 true. 没有助力 false
      is_raised: function() {
        return this.game_result != null;
      },
      is_to_self: function() { // 被助力人是否为自己
        return this.game_player.id == this.to_game_player.id;
      },
      js_progress_percent: function(){ // 进度条百分比
        var percent = 0
        if( this.to_game_player && this.game_round ){
          percent = parseInt(this.to_game_player.score/(this.game_round.final_score - this.game_round.initial_score)*100)
        }
        return percent+'%'
      },
      is_game_started: function(){
        var now = this.getServerTime();
        var startAt = new Date( this.game_round.start_at);
        return startAt <= now ;
      },
      is_game_end: function(){
        var now = this.getServerTime();
        var endAt = new Date( this.game_round.end_at);
        return endAt <= now ;
      },
      is_game_running: function(){
        return this.is_game_started && !this.is_game_end
      }
    },
    methods:{
      getServerTime: function() {
        var time = +new Date();
        if (typeof this.timeDeviation != "undefined") {
          time += this.timeDeviation
        }
        return time
      },
      handleStartGame: function(){
        // 开始游戏前，检查游戏是否开始或结束
        var now = this.getServerTime();
        var startAt = new Date( this.game_round.start_at);
        var endAt = new Date( this.game_round.end_at);
        if( startAt>= now ){
          this.$weui.alert('谢谢参与，游戏还未开始');
          return
        }
        if( endAt<= now ){
          this.$weui.alert('谢谢参与，游戏已经结束');
          return
        }
        // 开始游戏前，如果没有联系方式，让用户输入联系方式
        if( this.has_to_contact ){
          this.pageIndex = 1
        }else{
          this.showContact = true
        }
      },
      closeupdata: function() {
        //$("#closeupdata").hide();
      },
      GetRTime: function() {

        if (this.game_round.end_at) {
          /*var lastTime = this.game_round.end_at.replace('T', ' ');
          var arr = lastTime.split('-');
          lastTime = arr[0] + '/' + arr[1] + '/' + arr[2];
          lastTime += ':00'
          var EndTime = new Date(lastTime);*/
          var EndTime = new Date(this.game_round.end_at);
          var NowTime = new Date();
          this.t_time = EndTime.getTime() - NowTime.getTime();
          var d = Math.floor(this.t_time / 1000 / 60 / 60 / 24);
          this.time.d = d>9 ? ''+d : '0'+d
          var h = Math.floor(this.t_time / 1000 / 60 / 60 % 24);
          this.time.h = h>9 ? ''+h : '0'+h
          var m = Math.floor(this.t_time / 1000 / 60 % 60);
          this.time.m = m>9 ? ''+m : '0'+m
          var s = Math.floor(this.t_time / 1000 % 60);
          this.time.s = s>9 ? ''+s : '0'+s
        }
      },
      showtime: function() {
        setInterval(this.GetRTime, 1000)
      },
      closeshade: function() {
        //$(".remove_price").hide();
      },
      handleJoinGame: function() {
        // 加入游戏前请输入联系方式
        if (!this.has_contact) {
          this.showContact = true;
        }
      },
      closeContactDialog: function() {
        this.showContact = false;
      },
      updateContact: function() {
        var demo = /.{2,}/;
        var demotel = /^1[34578]\d{9}$/;
        if (!demo.test(this.form.realname)) {
          return this.shoeTopTex('请输入正确姓名', false);
        }
        if (!demotel.test(this.form.cellphone)) {
          return this.shoeTopTex('手机号码格式不正确', false);
        }
        var game_player_id = this.game_player.id;
        let data = {
          game_player_id: game_player_id,
          game_player: {
            cellphone: this.form.cellphone,
            realname: this.form.realname
          }
        }
        updateGamePlayerContact(data).then((res)=>{
          if (res) {
            console.log(123456, data);
            this.shoeTopTex('报名成功！快给自己砍一刀吧', true);

            this.initializeGame(game_player_id, null, function(){
              this.pageIndex = 1; // 进入游戏页面
              this.showContact = false; // 关闭联系方式对话框
              this.$nextTick(function(){
                console.log( "mainScroll.refresh() success ");
                //mainScroll.refresh();
              })
            })
          }
        })

      },
      shoeTopTex: function(text, bool) {
      },
      // 处理助力事件
      handleRaiseUp: function() {
        /* if( this.mar.new_price < this.mar.floor_price ){
             this.shoeTopTex("已经是最低价了，不能再砍了！");
         }
         if( this.mar.bargain_times == 0 ){
             this.shoeTopTex("已经是最低价了，不能再砍了！");
         }*/
         let data = {
           to_game_player_id: this.to_game_player.id,
           game_player_id: this.game_player.id
         }
         poll(data).then((res)=>{
           if (res) {
             let data = res.data
             if (data && data.game_result) {
               this.game_result = data.game_result
               this.dele_price = data.game_result.score;
               this.to_game_player = data.to_game_player;
               this.game_result_rank = data.game_result_rank;
               //setTimeout(function() {
               // $(".remove_price").hide();
               //}, 5000);
               console.log(0, data);
             }
           }
         })

      },
      gotoGameOfPlayer: function( player ) {
        //用户点击 我要参加，输入联系方式后，进入用户自己的游戏

      },
      returnmodal: function() {
        var game_player_id = this.game_player.id;
        var to_game_player_id = game_player_id;
        this.initializeGame(game_player_id, to_game_player_id, function(){} )
      },
      configWeixin: function() {
        var wxConfig = this.wx_config;
        wxConfig.debug = false;
        wxConfig.jsApiList = ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard', 'updateAppMessageShareData','updateTimelineShareData'];
        this.wx.config(wxConfig);
        this.wx.error(function(res){ console.log( "wx error", res) });
        this.wx.ready(()=> {
          let sharedata = {
            title: this.game_round.name,
            link: this.wx_share.link,
            desc: this.to_game_player.nickname + "邀请您来帮他（她）砍价！",
            imgUrl: this.wx_share.img_url,
            success: function(d) {
              console.log( "shared success", d, "is there a d?", this.wx_share.link, "is there a link");
              let data = {
                game_player_id: this.game_player.id,
                share: 1
              }
              updateGameDay(data).then((res)=>{
                console.log(111444, res)

              })
            }
          };

          this.wx.onMenuShareAppMessage(sharedata);
          this.wx.onMenuShareTimeline(sharedata);
          //wx.updateAppMessageShareData(sharedata);
          //wx.updateTimelineShareData(sharedata);
          //wx.onMenuShareQQ(sharedata);
          //wx.onMenuShareWeibo(sharedata);
          console.log( " sharedata = ", sharedata)
        });
      },
      creatQRCodeImg: function() { //生成砍价二维码
        var html = document.getElementsByTagName('html')[0];
        var pageWidth = html.getBoundingClientRect().width;
        //var pageHeight = html.getBoundingClientRect().height;
        var c = document.createElement('canvas'), //document.getElementById('j-wedding-canvas');
          ctx = c.getContext('2d');
        c.width = pageWidth * 0.72;
        c.height = pageWidth * 0.72;
        var my_gradient=ctx.createRadialGradient(c.width/2,c.height/2,0,c.width/2,c.height/2, c.width);
        my_gradient.addColorStop(0,"#2EA3DC");
        my_gradient.addColorStop(1,"#036EB4");
        ctx.fillStyle=my_gradient;
        ctx.fillRect(0,0,c.width,c.height);
        ctx.textAlign = "center";
        ctx.fillStyle= '#ffffff';
        ctx.font="0.35rem/0.4rem '微软雅黑'";
        ctx.fillText("长按识别二维码，帮"+this.truncateName(this.to_game_player.nickname, 3)+"补刀", c.width * 0.5, c.height * 0.1);
        ctx.fillText(" 帮TA补一刀呗", c.width * 0.5, c.width * 0.94);
        console.log("c.width=", c.width, c.height, this.wx_share.link);
        this.$QRCode.toCanvas(this.wx_share.link, {
          width: c.width * 0.74
        }, function(error, canvas) {
          if (error) {
            console.error(error);
          }
          console.log('success!');
          ctx.drawImage(canvas, c.width * 0.13, c.width * 0.13);
          //var imageData = c.toDataURL('image/png');
          //$('#share-qrcode-img').attr('src', imageData);
          this.showQRCode = true;
        })
      },
      closeQRCodeDialog:function(){
        this.showQRCode = false;
      },
      truncateName: function(vals, limit) {
        var val = vals;
        if (vals && vals.length>limit) {
          val = vals.substr(0,limit) +'*' ;
        }
        return val;
      }

    }
}

</script>
