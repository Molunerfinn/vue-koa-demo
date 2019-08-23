<template>
  <!-- 锦囊 -->
 <div class="PhotosListBox">
   <span v-on:click="back">返回</span>
   <div>
     <p> {{album.position}} 号 {{ album.name}}</p>
     <p>{{album.desc}} </p>
   </div>

   <div class="c_bg flex statis">
     <div class="flex-item">
       <p>1</p>
       <p>排名</p>
     </div>
     <div class="flex-item">
       <p>2</p>
       <p>票数</p>
     </div>
     <div class="flex-item">
       <p> 2 票</p>
       <p >距前一名</p>
     </div>
   </div>
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
import {thumbUp, getAlbumInfo } from '@/api/games/ztoupiao'

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
      getRoundState:{}

    }
  },
  created() {


    var params = {
        id: this.albumId,
        code:'ztoupiao'
      }
    getAlbumInfo(this.number, params).then(data => {
      console.log('getAlbumInfo---:',data);
      this.album = data
    });

  },
  computed: {
    albumId() {
      return this.$route.params.id
    }
  },
  watch: {
    '$route': 'initData'
  },
  methods: {
    back(){
        this.$router.go(-1);//返回上一层
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
        console.log(data);
      });
    },
  },

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
  .statis{
    text-align: center;
    padding: 16px 0;
  }
  .statis .item:first-child{
    border-right: 1px solid #fff;
  }
  .statis .item:last-child{
    border-left: 1px solid #fff;
  }
</style>
