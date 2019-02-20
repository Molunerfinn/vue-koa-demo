<style>

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.bargain{
  font-size: 14px;
}
</style>

<template>

<div id="app">

  <!-- logo-->
  <div class="logoWrap">
      <img src="/game-bargain-assets/app/images/skin1/wx/tu_05.png" class="logo">
  </div>
  <!-- 音乐播放 -->
  <div class="soundIcon soundIconOff" id="music"><div class="circle_hide">
    <audio  id="audiobg" loop="true" src="/game-bargain-assets/app/audio/game/bargain/happynewyear.mp3"  type="audio/mpeg" > </audio>
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
                  <p class="title hide"> <span> 排行榜 <img src='/game-bargain-assets/app/images/spinner.gif' /></span></p>
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
      <img src="/game-bargain-assets/app/images/game/bargain/kj_05.png" class="gamelogo">
    </div>
    <div class="banner">
      <img src="/game-bargain-assets/app/images/skin1/wx/banner.png" class="gamebanner">
    </div>

  </div>

  <div class="page page-1 main" v-show="pageIndex==1">
    <div id="scroller">
      <!-- 顶部图片 -->
       <div class="titlebg">
         <img src="/game-bargain-assets/app/images/game/bargain/kj_05.png" class="gamelogo">
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
           <img src="/game-bargain-assets/app/images/skin1/wx/game.jpg" alt="砍多少，送多少！">
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

      <div class="buttom_login"><img src="/game-bargain-assets/app/images/loading.gif" alt=""></div>
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
    <div class="white_bg scaleDiv"><img src="/game-bargain-assets/app/images/game/bargain/white_bg.png" alt=""></div>
    <div class="red_bg scaleDiv">
      <dd>运气不错哦！<br>此次砍下</dd>
      <dt>${dele_price}元!</dt>
    </div>
  </div>

  <!-- 我要参与 -->
  <div class="index_enter part_me" style="display:none;" v-show="showContact">
    <div class="index_enter_box">
      <div class="index_enter_main scaleDiv2">
        <div class="index_enter_head clearfix"><img src="/game-bargain-assets/app/images/wx/close.png" alt="" @click="closeContactDialog"></div>
        <div class="index_enter_text">所填信息不会公开，仅用于活动兑奖</div>
        <div class="index_enter_input">
          <div class="enter_input_one">
            <dd>姓名：</dd>
            <input type="text" placeholder="请输入您的真实姓名" v-model="bargain.realname">
          </div>
          <div class="enter_input_one">
            <dd>手机：</dd>
            <input type="text" placeholder="请输入您的手机号码" v-model="bargain.cellphone" maxlength="11">
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
  <div class="top_text" :class=" top.onoff ? 'show' : '' ">
    <div class="top_text_box">${top.text}</div>
  </div>

</div>

</template>

<script>

export default {
    name: 'app',
    data() {
      return {
        msg: 'this is world'
      }
    }
}

</script>
