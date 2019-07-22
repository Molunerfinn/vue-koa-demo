<template>
  <!-- 锦囊 -->
 <div class="PhotosListBox">
   <div class="title">
     <div class="headImg">
       <img id="PhotographsTitle" v-bind:src="album.Photos[0].originalUrl">
       <a class="weui-btn weui-btn_primary userSubmitBtn" @click="thumb_up(album.id)" href="javascript:" id="showTooltips">点赞</a>
     </div>
   </div>
   <div class="photo_list">
     <ul>
       <li class="photo" v-for="photo in album.Photos"
       :style="{backgroundImage:'url(\''+photo.originalUrl+'\')'}">
     </li>
     </ul>
   </div>

 </div>
</template>

<script>
// import moment from 'moment';
// import { getRoundState } from '@/api/games/ztoupiao'

import queryString from 'query-string'
import {thumbUp,getAlbumInfo } from '@/api/games/ztoupiao'

export default {
  props: {
    command:{
      default: false // 可选值: showResult, showGift
    }
  },
  data() {
    return {
      album: {
        Photos:[{
          originalUrl:''
        }]
      },
      gamePlayer:{},
      getRoundState:{},
      ui:{
        photosListVisible:false
      },
    }
  },
  created() {
    let parsed =  JSON.parse(JSON.stringify(queryString.parse(location.hash)).replace('/',''));
    var params = {
        parsed: parsed,
        code:'ztoupiao'
      }
    getAlbumInfo(queryString.parse(location.search).number, params).then(data => {
      console.log('getAlbumInfo---:',data);
      this.album = data
    });

  },
  mounted(){
  },
  computed:{
  },
  methods: {
    thumb_up: function(id){
      const parsed = queryString.parse(location.search)

      var number = parsed.number

      var params = {
        parsed: parsed,
        code:'ztoupiao',
        album_id:id
      }

      thumbUp(number, params).then(data => {
        console.log(data);
      });
    },
  },
  watch: {
    command: function (val, oldVal) {
      //外部触发游戏开始
      console.log('rulebox','watch-command new: %s, old: %s', val, oldVal)
      if( val == true){
        this.ui.photosListVisible = true
      }
      if( val == false){
        this.ui.photosListVisible = false
      }
    }
  }
}
</script>

<style lang="css" scoped>
  .weui-navbar.works{
    position: relative;
  }
  .photo_list{
    height: 60vh;
  }
  .photo{
    position: relative;
    height: 10vh;
    background-repeat: no-repeat;
  }
</style>
