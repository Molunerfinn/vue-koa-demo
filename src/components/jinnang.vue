<template>
  <!-- 锦囊 -->
  <div id="jinnangWrap" >
    <a class="jinnang-open-btn" @click="handleOpenJinnang"> 活动规则 </a>
    <div class="jinnang-container poupInfoBox" v-show="isContainerVisible">
        <div class="jinnang-close-btn poupClose"></div>
        <div class="poupMain">
          <div class="poupHead" style="">
            <a class="weui-bar__item_on poupTitle" href="#descTab" @click="hanldeTabTitleClick"><span class="innerText">活动规则 </span></a>
            <a class="poupTitle" href="#rankingTab" @click="hanldeTabTitleClick"><span class="innerText">排行榜	</span></a>
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
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      isContainerVisible: false,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created(){
    this.initialTabs()
  },
  methods:{
    // 初始化锦囊Tab
    initialTabs(){
      var ITEM_ON = "weui-bar__item_on";

      //锦囊
      console.log( ".jinnangOpenBtn -> touchstart binding", $('.jinnang-open-btn'))

    },
    handleOpenJinnang(e){
      // reset tab, or rank may be absolete.
      this.isContainerVisible = true
      $('.jinnang-container .poupTitle:first').trigger("touchstart");
      e.stopPropagation();
    },
    handleCloseJinnang(e){
      e.stopPropagation();
      console.log( ".jinnang-close-btn -> touchstart ")
      // reset tab, or rank may be absolete.
      this.isContainerVisible = false
    },
    hanldeTabTitleClick(e){
      var $a = $(e.currentTarget);
      var href = $a.attr("href");
      if($a.hasClass(ITEM_ON)) return;
      if(!/^#/.test(href)) return;
      showTab($a);
      e.preventDefault();
    },
    showTab(){
        var $a = $(a);
        if($a.hasClass(ITEM_ON)) return;
        var href = $a.attr("href");

        if(!/^#/.test(href)) return ;

        $a.parent().find("."+ITEM_ON).removeClass(ITEM_ON);
        $a.addClass(ITEM_ON);

        var bd = $a.parents(".poupMain").find(".popuBody");

        bd.find(".weui-tab__bd-item_on").removeClass("weui-tab__bd-item_on");

        $(href).addClass("weui-tab__bd-item_on");
        //如果tab页面中有 loading image, ajax加载内容, 成功后删除loading

          if(href == '#rankingTab')
          {
            // 对于积攒类游戏，每次点击排行，都要更新排名，每时每刻都有更新
            var first = $(href).find('.isFirstTimeLoading')
            var data = { game_player_id: main.game_player.id }
            $.post( DGAME.routes.game_player_rank_path, data , function( data){
              console.log( "game_player_rank_path data=", data )
              main.game_player = data.game_player
              main.game_player_rank = data.game_player_rank

            })
            if( first.length>0){ first.remove(); }
          }else if (href == '#resultTab')
          {
            $.post( DGAME.routes.result_game_round_path, function(){
              $(href).find('.isLoading').remove();
            })

          }else if (href == '#awardsTab')
          {
            $.post( DGAME.routes.awards_game_round_path, function(){
              $(href).find('.isLoading').remove();
            })
          }

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
