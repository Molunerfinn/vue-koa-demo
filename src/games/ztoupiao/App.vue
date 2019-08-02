<template>
  <div id="app">
    <div class="weui-tab">
      <div class="weui-tab__panel">
        <router-view class="view"></router-view>
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
        <router-link to="/review" class="weui-tabbar__item">
          <span>
            <img src="~@/assets/game/ztoupiao/image/icons/review.jpg" alt="" class="weui-tabbar__icon">
          </span>
          <p class="weui-tabbar__label">追溯</p>
        </router-link>
        <router-link to="/myaccount" class="weui-tabbar__item">
          <span>
            <img src="~@/assets/game/ztoupiao/image/icons/account.jpg" alt="" class="weui-tabbar__icon">
          </span>
          <p class="weui-tabbar__label">我的</p>
        </router-link>
      </div>
    </div>
  </div>

</template>

<script>

  // import { gameSkinName } from '@/config/env'
  import HdGame from '@/lib/hdgame'
  // import weui from 'weui.js'
  import queryString from 'query-string'
  import { getGameResult } from '@/api/games/ztoupiao'
  import storeMixin from './store_mixin'

  export default {
    name: 'app',
    mixins: [storeMixin],
    data() {
      return {
        gameResult: []
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
        this.setGameAlbums( data.gameAlbums )
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
