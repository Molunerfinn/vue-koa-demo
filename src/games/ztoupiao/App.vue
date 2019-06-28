<template>
  <div id="app">
    <div class="weui-tabbar footer">
        <div align="center" class="index" @touchend="handleTouchIndex" >
          <div class="footer_text">首页</div>
        </div>
        <div align="center" class="works" @touchend="handleTouchWorks">
          <div class="footer_text">作品</div>
        </div>
        <div align="center" class="photographs" @touchend="handleTouchPhotographs">
          <div class="footer_text">上传</div>
        </div>
        <div align="center" class="review" @touchend="handleTouchReview">
          <div class="footer_text">追溯</div>
        </div>
        <div align="center" class="my_account" @touchend="handleTouchMyAccount">
          <div class="footer_text">我的</div>
        </div>
    </div>
    <!-- <IndexBox :game-player="gamePlayer" :gameRound="gameRound":command="ui.indexBoxVisible" > </IndexBox> -->
    <WorksBox :game-player="gamePlayer" :gameRound="gameRound" :gameAlbums="gameAlbums" :newGameAlbums="newGameAlbums" :hotGameAlbums="hotGameAlbums" :gameResult="gameResult" :command="ui.worksBoxVisible" > </WorksBox>
    <!-- <PhotographsBox :game-player="gamePlayer" :gameRound="gameRound":command="ui.photographsBoxVisible" > </PhotographsBox> -->
    <!-- <ReviewBox :game-player="gamePlayer" :gameRound="gameRound":command="ui.reviewBoxVisible" > </ReviewBox> -->
    <!-- <MyAccountBox :game-player="gamePlayer" :gameRound="gameRound":command="ui.my_accountBoxVisible" > </MyAccountBox> -->
  </div>
</template>

<script>
  // import { gameSkinName } from '@/config/env'
  import HdGame from '@/lib/hdgame'
  // import weui from 'weui.js'
  import IndexBox from './IndexBox.vue'
  import WorksBox from './WorksBox.vue'
  import PhotographsBox from './PhotographsBox.vue'
  import ReviewBox from './ReviewBox.vue'
  import MyAccountBox from './MyAccountBox.vue'
  import queryString from 'query-string'
  import { getGameResult,getNewAlbumInfo,getHotAlbumInfo } from '@/api/games/ztoupiao'

  export default {
    name: 'app',
    components: {
      IndexBox,
      WorksBox,
      PhotographsBox,
      ReviewBox,
      MyAccountBox,
    },
    created() {
      const parsed = queryString.parse(location.search)
      var number = parsed.number

      var params = {
        parsed: parsed,
        code:'ztoupiao'
      }
      getGameResult(number, params).then(data => {
        console.log('getGameResult data-----:',data);
        this.gamePlayer = data.gamePlayer;
        this.gameRound = data.gameRound;
        this.gameAlbums = data.gameAlbums;
        this.gameResult = data.gameResult;

        let wxConfig = data.wxConfig
        if (wxConfig) {
          HdGame.initWxConfig(wxConfig)
          let wxShareArg = {
            title: this.gameRound.name,
            desc: '请点击查看详情...',
            link: wxConfig.shareUrl,
            // imgUrl: process.env.GAME_HOST + this.skinAssets.shareImgPath
          }
          HdGame.setWxShare(wxShareArg)
        }
        document.title = this.gameRound.name

      });

      getNewAlbumInfo(number, params).then(data => {
        console.log('getNewAlbumInfo---:',data);
        this.newGameAlbums = data.gameAlbums;
      });
      getHotAlbumInfo(number, params).then(data => {
        console.log('getHotAlbumInfo---:',data);
        this.hotGameAlbums = data.gameAlbums;
      });
    },
    data() {
      return {
        gamePlayer:{},
        gameRound:{},
        gameAlbums:[],
        newGameAlbums:[],
        hotGameAlbums:[],
        gameResult:[],
        ui: {
          indexBoxVisible: true, // 初始页面是否可见
          worksBoxVisible: false,
          photographsBoxVisible: false,
          reviewBoxVisible: false,
          my_accountBoxVisible: false
        },
      }
    },
    methods: {
      handleTouchIndex(event){
        console.log('handleTouchIndex');
        this.ui.indexBoxVisible = true
        this.ui.worksBoxVisible = false
        this.ui.photographsBoxVisible = false
        this.ui.reviewBoxVisible = false
        this.ui.my_accountBoxVisible = false
      },
      handleTouchWorks(event){
        console.log('handleTouchWorks');
        this.ui.indexBoxVisible = false
        this.ui.worksBoxVisible = true
        this.ui.photographsBoxVisible = false
        this.ui.reviewBoxVisible = false
        this.ui.my_accountBoxVisible = false
      },
      handleTouchPhotographs(event){
        console.log('handleTouchPhotographs');
        this.ui.indexBoxVisible = false
        this.ui.worksBoxVisible = false
        this.ui.photographsBoxVisible = true
        this.ui.reviewBoxVisible = false
        this.ui.my_accountBoxVisible = false
      },
      handleTouchReview(event){
        console.log('handleTouchReview');
        this.ui.indexBoxVisible = false
        this.ui.worksBoxVisible = false
        this.ui.photographsBoxVisible = false
        this.ui.reviewBoxVisible = true
        this.ui.my_accountBoxVisible = false
      },
      handleTouchMyAccount(event){
        console.log('handleTouchMyAccount');
        this.ui.indexBoxVisible = false
        this.ui.worksBoxVisible = false
        this.ui.photographsBoxVisible = false
        this.ui.reviewBoxVisible = false
        this.ui.my_accountBoxVisible = true
      },
    }

  }

</script>

<style>

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
    width: 100%;
  }
  #headImg{
        border-radius: 100%;
        width: 20%;
        height: auto;
  }


  .kouhong {
    font-size: 14px;
  }

</style>
