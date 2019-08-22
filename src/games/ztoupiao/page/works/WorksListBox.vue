<template>
  <!-- 锦囊 -->
 <div class="works" >

   <waterfall>
     <waterfallSilde v-for="album in newGameAlbums" :key="album.id" :prefetch="true" :imgs="[album.Photos[0].previewUrl]" >
       <div class="img-info"  >
         <router-link :to="album.link" class="item">
             <img :src="album.Photos[0].previewUrl" alt="">
         </router-link>
         <a>{{album.name}}</a>
         <a>{{album.score}}</a>
         <a class="weui-btn weui-btn_primary userSubmitBtn" @click="thumb_up(album.id)" href="javascript:" id="showTooltips">点赞</a>
         <div class="userImgBox" style="border-color:"><img :src="album.GamePlayer.avatar" class="userImg" /></div>

        </div>

     </waterfallSilde>

   </waterfall>


  </div>
</template>

<script>
import $ from "jquery"
// import { getRoundState } from '@/api/games/ztoupiao'

import queryString from 'query-string'
import { waterfall, waterfallSilde } from '@/lib/vue-waterfall';

import { getNewAlbumInfo,getHotAlbumInfo,thumbUp } from '@/api/games/ztoupiao'

import PhotosListBox from './PhotosListBox.vue'

export default {
  components: {
    PhotosListBox, waterfall, waterfallSilde
  },
  props: {
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
      showAlbum:{
        Photos:[{originalUrl:''}]
      },
      getRoundState:{},
      ui:{
        newAlbumsVisible:true,
        hotAlbumsVisible:false,
        PhotosListBoxVisible:false
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
    this.initData()
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
  },
  methods: {
    initData(){

      const parsed = queryString.parse(location.search)
      var number = parsed.number

      var params = {
        parsed: parsed,
        code:'ztoupiao'
      }
      getNewAlbumInfo(number, params).then(data => {
        console.log('getNewAlbumInfo---:',data);
        let Albums = data
        for(var i=0;i<Albums.length;i++){
          Albums[i].link = '/albums/'+Albums[i].id;
        }
        console.log('Albums----:',Albums);
        this.newGameAlbums = Albums;
      });
    },

    thumb_up: function(id){
      const parsed = queryString.parse(location.search)
      var number = parsed.number

      var params = {
        parsed: parsed,
        code:'ztoupiao',
        album_id:id
      }

      thumbUp(number, params).then(data => {
        getNewAlbumInfo(number, params).then(data => {
          console.log('getNewAlbumInfo---:',data);
          this.newGameAlbums = data;
        });
        getHotAlbumInfo(number, params).then(data => {
          console.log('getHotAlbumInfo---:',data);
          this.hotGameAlbums = data;
        });
      });
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
    }
  },
  watch: {
    command: function (val, oldVal) {
      //外部触发游戏开始
      console.log('rulebox','watch-command new: %s, old: %s', val, oldVal)
      if( val == true){
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
        this.ui.PhotosListBoxVisible = false
      }

    }
  }
}
</script>

<style lang="css" scoped>
  .weui-navbar.works{
    position: relative;
  }
  .works_list li{
    width: 50%;
  }
  .works{
   }
   .waterfall-silde{
     width: 50%;
     padding: 6px;
     box-sizing: border-box;
   }
</style>
