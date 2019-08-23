<template>
  <!-- 锦囊 -->
 <div class="works" >
   <div class="weui-dialog" v-show="showDialog">
       <div class="weui-dialog__bd">{{warnStr}}</div>
       <div class="weui-dialog__ft">
           <a @click="closeDialog()" class="weui-dialog__btn weui-dialog__btn_primary">知道了</a>
       </div>
   </div>
    <form action="" v-on:submit.prevent="">
      <mt-search
      v-model="searchStr"
      cancel-text="取消"
      placeholder="请输入收件人的姓名"
      @keyup.enter.native="search"
      class="font-size-8"
      style="width:100%;height:auto;"
      >
      </mt-search>
    </form>
   <waterfall ref="waterfall" @load="initData" :searchStr="searchStr" >
     <waterfallSilde v-for="album in newGameAlbums" :key="album.id" :prefetch="true" :imgs="[album.Photos[0].previewUrl]" >
       <div class="img-info"  >
         <router-link :to="{ name: 'album', params:{id: album.id}}" class="item">
             <img :src="album.Photos[0].previewUrl" alt="">
         </router-link>
         <a>{{album.name}}</a>
         <p> 票数<span>{{album.score}}</span></p>
         <a class="weui-btn weui-btn_mini weui-btn_primary userSubmitBtn" @click="thumb_up(album.id)" href="javascript:" id="showTooltips">点赞</a>
         <div class="userImgBox" style="border-color:"><img :src="album.GamePlayer.avatar" class="userImg" /></div>

        </div>

     </waterfallSilde>

   </waterfall>


  </div>
</template>

<script>
// import { getRoundState } from '@/api/games/ztoupiao'
import queryString from 'query-string'
import { waterfall, waterfallSilde } from '@/lib/vue-waterfall';
import { Search } from 'mint-ui';

import { getNewAlbumInfo,thumbUp,searchAlbums } from '@/api/games/ztoupiao'

import PhotosListBox from './PhotosListBox.vue'

export default {
  components: {
    PhotosListBox, waterfall, waterfallSilde,[Search.name]: Search, Search
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
      style:{
        statusUserImg: {}
      },
      gamePlayerRank: [],
      currentPlayer:{},
      newGameAlbums:[],
      pageSize: 0,
      isDataLoaded: false,
      warnStr:'',
      showDialog:false,
      userList:[],
      searchStr:''

    }
  },
  created() {
    this.initData()
  },
  mounted() {},
  watch:{
    searchStr: function(val,oldVal){
      this.newGameAlbums = []
      this.searchName()
    }
  },
  computed:{
    hasRank(){
      return this.gamePlayerRank.length > 0
    },
    currentPlayerRank(){
      return (this.currentPlayer.rank!=undefined&&this.currentPlayer.rank!=null) && this.currentPlayer.rank>=0 ? this.currentPlayer.rank : '无'
    }
  },
  methods: {
    async initData(){
      this.isDataLoaded = false
      this.pageSize += 6
      var params = {
        pageSize: this.pageSize,
        code:'ztoupiao'
      }
      // 考虑作品排序时，使用其他排序方式, 如：报名时间倒序，票数从高到低
      // 这里每次翻页实际是取得到当前页的所有作品信息
      let albums = await getNewAlbumInfo(this.number, params)

      this.newGameAlbums = albums
      this.isDataLoaded = true
    },
    closeDialog(){
      this.showDialog = false
    },
    searchName() {
      console.log('searchStr----:',this.searchStr);
      const parsed = queryString.parse(location.search)
      var number = parsed.number
      var param = {
        code:'ztoupiao',
        searchStr:this.searchStr
      }
      searchAlbums(number,param).then((res)=>{
        let Albums = res
        for(var i=0;i<Albums.length;i++){
          Albums[i].link = '/albums/'+Albums[i].id;
        }
        console.log('Albums----:',Albums);
        this.newGameAlbums = Albums;

        this.$refs.waterfall.allChildren=[]
        this.$refs.waterfall._initWaterfall()
      })

    },

    thumb_up: function(id){
      const parsed = queryString.parse(location.search)
      var number = this.number

      var params = {
        parsed: parsed,
        code:'ztoupiao',
        album_id:id
      }

      thumbUp(number, params).then(data => {
        if(data.isSuccess){
          this.warnStr = '投票成功'
          this.showDialog = true
        }else{
          this.warnStr = '投票失败!没有投票次数!'
          this.showDialog = true
        }
        getNewAlbumInfo(number, params).then(data => {
          let Albums = data
          for(var i=0;i<Albums.length;i++){
            Albums[i].link = '/albums/'+Albums[i].id;
          }
          console.log('Albums----:',Albums);
          this.newGameAlbums = Albums;
        });
      });
    },

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
   .waterfall{
      padding-bottom: 50px;
   }
   .waterfall-silde{
     width: 50%;
     padding: 6px;
     box-sizing: border-box;
   }
</style>
