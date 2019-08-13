<template>
  <div id="app">
    <div class="weui-tab">
      <div class="weui-tab__panel">
        <router-view class="view"></router-view>
      </div>
      <div class="weui-tabbar footer">
        <router-link to="/review" class="c_bg weui-tabbar__item">
          <i class="iconfont cl-icon-store"></i>
          <p class="c_bg weui-tabbar__label">介绍</p>
        </router-link>
        <router-link to="/" class="c_bg weui-tabbar__item">
          <i class="iconfont cl-icon-view-gallery"></i>
          <p class="c_bg weui-tabbar__label">作品</p>
        </router-link>

        <router-link to="/apply" class="c_bg weui-tabbar__item">
          <i class="iconfont cl-icon-share"></i>

          <p class="c_bg weui-tabbar__label">上传</p>
        </router-link>

        <router-link to="/myaccount" class="c_bg weui-tabbar__item">
          <i class="iconfont cl-icon-account"></i>
          <p class="c_bg weui-tabbar__label">我的</p>
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

  import skin from '@/assets/game/ztoupiao/css/skin.tmpl'

  export default {
    name: 'app',
    mixins: [storeMixin],
    data() {
      return {
        number: null,
        gameResult: []
      }
    },
    created() {
      const parsed = queryString.parse(location.search)
      this.number = parsed.number

      var params = {
        parsed: parsed,
        code: 'ztoupiao'
      }
      getGameResult(this.number, params).then(data => {
        console.log('getGameResult data-----:', data)
        let gameRound = data.gameRound
        // 先设置skin color
        let originalColor = '#F8B62D'
        let newColor = gameRound.color || '#FFFFFF'

        console.log('getGameResult data-----:', data)


        this.setGameRound( data.gameRound )
        this.setGameAlbums( data.gameAlbums )
        console.log( "this.skin=", skin)
        let style = skin.replace(originalColor, newColor )
        this.useTheme( style )

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

      useTheme( newStyle ){
        let id = this.number
        let styleTag = document.getElementById(id)
        if (!styleTag) {
          styleTag = document.createElement('style')
          styleTag.setAttribute('id', id)
          document.head.appendChild(styleTag)
        }
        styleTag.innerHTML = newStyle
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
