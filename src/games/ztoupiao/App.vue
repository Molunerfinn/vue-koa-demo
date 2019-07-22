<template>

  <div id="app">
    <div class="weui-tab">

      <div class="weui-tab__panel">

        <router-view class="view"></router-view>
        <WorksBox :gameRound="gameRound" :gameAlbums="gameAlbums" :gameResult="gameResult" :command="ui.worksBoxVisible"> </WorksBox>
        <PhotographsBox :gameRound="gameRound" :command="ui.photographsBoxVisible" @gotoWorksBox="gotoWorksBox"> </PhotographsBox>
        <ReviewBox :gameRound="gameRound" :command="ui.reviewBoxVisible"> </ReviewBox>
        <MyAccountBox :gameRound="gameRound" :command="ui.my_accountBoxVisible"> </MyAccountBox>
      </div>
      <div class="weui-tabbar footer">

        <router-link to="/" class="weui-tabbar__item">
          <span>
            <img src="~@/assets/game/ztoupiao/image/icons/home.jpg" alt="" class="weui-tabbar__icon">
          </span>
          <p class="weui-tabbar__label">首页</p>
        </router-link>
        <router-link to="/works" class="weui-tabbar__item">
          <span>
            <img src="~@/assets/game/ztoupiao/image/icons/work.jpg" alt="" class="weui-tabbar__icon">
          </span>
          <p class="weui-tabbar__label">作品</p>
        </router-link>
        <router-link to="/apply" class="weui-tabbar__item">
          <span>
            <img src="~@/assets/game/ztoupiao/image/icons/upload.jpg" alt="" class="weui-tabbar__icon">
          </span>
          <p class="weui-tabbar__label">上传</p>
        </router-link>
        <a class="weui-tabbar__item " @touchend="handleTouchWorks">
          <span>
            <img src="~@/assets/game/ztoupiao/image/icons/work.jpg" alt="" class="weui-tabbar__icon">
          </span>
          <p class="weui-tabbar__label">作品</p>
        </a>
        <a class="weui-tabbar__item " @touchend="handleTouchPhotographs">
          <span>
            <img src="~@/assets/game/ztoupiao/image/icons/upload.jpg" alt="" class="weui-tabbar__icon">
          </span>
          <p class="weui-tabbar__label">上传</p>
        </a>
        <a class="weui-tabbar__item " @touchend="handleTouchReview">
          <span>
            <img src="~@/assets/game/ztoupiao/image/icons/review.jpg" alt="" class="weui-tabbar__icon">
          </span>
          <p class="weui-tabbar__label">追溯</p>
        </a>
        <a class="weui-tabbar__item " @touchend="handleTouchMyAccount">
          <span>
            <img src="~@/assets/game/ztoupiao/image/icons/account.jpg" alt="" class="weui-tabbar__icon">
          </span>
          <p class="weui-tabbar__label">我的</p>
        </a>
      </div>
    </div>
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
  import { getGameResult } from '@/api/games/ztoupiao'
  import storeMixin from './store_mixin'

  export default {
    name: 'app',
    mixins: [storeMixin],
    components: {
      IndexBox,
      WorksBox,
      PhotographsBox,
      ReviewBox,
      MyAccountBox
    },
    data() {
      return {
        gameResult: [],
        ui: {
          indexBoxVisible: true, // 初始页面是否可见
          worksBoxVisible: false,
          photographsBoxVisible: false,
          reviewBoxVisible: false,
          my_accountBoxVisible: false
        }
      }
    },
    created() {
      const parsed = queryString.parse(location.search)
      var number = parsed.number

      var params = {
        parsed: parsed,
        code: 'ztoupiao'
      }
      getGameResult(number, params).then(data => {
        console.log('getGameResult data-----:', data)
        //this.gameRound = data.gameRound
        this.setGameRound( data.gameRound )
        this.setGameResults( data.gameResult )
        this.setGameResults( data.gameResult )
        console.log( "this.gameRound=", this.gameRound)

        this.gameResult = data.gameResult

        let wxConfig = data.wxConfig
        if (wxConfig) {
          HdGame.initWxConfig(wxConfig)
          let wxShareArg = {
            title: this.gameRound.name,
            desc: '请点击查看详情...',
            link: wxConfig.shareUrl
            // imgUrl: process.env.GAME_HOST + this.skinAssets.shareImgPath
          }
          HdGame.setWxShare(wxShareArg)
        }
        document.title = this.gameRound.name
      })
    },

    methods: {
      handleTouchIndex(event) {
        console.log('handleTouchIndex')
        this.ui.indexBoxVisible = true
        this.ui.worksBoxVisible = false
        this.ui.photographsBoxVisible = false
        this.ui.reviewBoxVisible = false
        this.ui.my_accountBoxVisible = false
      },
      handleTouchWorks(event) {
        console.log('handleTouchWorks')
        this.ui.indexBoxVisible = false
        this.ui.worksBoxVisible = true
        this.ui.photographsBoxVisible = false
        this.ui.reviewBoxVisible = false
        this.ui.my_accountBoxVisible = false
      },
      handleTouchPhotographs(event) {
        console.log('handleTouchPhotographs')
        this.ui.indexBoxVisible = false
        this.ui.worksBoxVisible = false
        this.ui.photographsBoxVisible = true
        this.ui.reviewBoxVisible = false
        this.ui.my_accountBoxVisible = false
      },
      handleTouchReview(event) {
        console.log('handleTouchReview')
        this.ui.indexBoxVisible = false
        this.ui.worksBoxVisible = false
        this.ui.photographsBoxVisible = false
        this.ui.reviewBoxVisible = true
        this.ui.my_accountBoxVisible = false
      },
      handleTouchMyAccount(event) {
        console.log('handleTouchMyAccount')
        this.ui.indexBoxVisible = false
        this.ui.worksBoxVisible = false
        this.ui.photographsBoxVisible = false
        this.ui.reviewBoxVisible = false
        this.ui.my_accountBoxVisible = true
      },
      gotoWorksBox: function() {
        console.log('gotoWorksBox')
        this.ui.indexBoxVisible = false
        this.ui.worksBoxVisible = true
        this.ui.photographsBoxVisible = false
        this.ui.reviewBoxVisible = false
        this.ui.my_accountBoxVisible = false
      }
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

  .footer .weui-tabbar__item span{
    display: inline-block;
    position: relative;
  }

</style>
