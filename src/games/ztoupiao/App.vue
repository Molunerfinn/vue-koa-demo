<style>

#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
    width: 100%;
}

.footer .weui-tabbar__item span {
    display: inline-block;
    position: relative;
}

</style>

<template>

<div id="app">
    <div class="weui-dialog" v-show="showDialog">
        <div class="weui-dialog__bd">{{warnStr}}</div>
        <div class="weui-dialog__ft">
            <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">知道了</a>
        </div>
    </div>
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
import {
    getGameInfo
}
from '@/api/games/ztoupiao'
import constant from '../../../game_constant.js'

import skin from '@/assets/game/ztoupiao/css/skin.tmpl'

export default {
    name: 'app',
    //mixins: [storeMixin],
    data() {
        return {
            number: null,
            showDialog:false,
            warnStr:'',
            preview:'no'
        }
    },
    created() {
        const parsed = queryString.parse(location.search)
        this.number = parsed.number
        this.preview = parsed.preview
        console.log('this.preview---:',this.preview);

        var params = {
            parsed: parsed,
            code: 'ztoupiao'
        }
        getGameInfo(this.number, params).then(data => {
            console.log('getGameInfo data-----:', data)
            let gameRound = data.gameRound
                // 先设置skin color
            let originalColor = '#F8B62D'
            let newColor = gameRound.color || '#FFFFFF'
            if(gameRound.state != constant.GameRoundStates.started && this.preview!='yes'){
              console.log('this.preview!=yes');
              if(gameRound.state == constant.GameRoundStates.created){
                console.log('warnStr created');
                this.warnStr = 'warnStr created'
                this.showDialog = true
              }else if (gameRound.state == constant.GameRoundStates.completed) {
                console.log('warnStr completed');
                this.warnStr = 'warnStr completed'
                this.showDialog = true
              }else if (gameRound.state == constant.GameRoundStates.disabled) {
                console.log('warnStr disabled');
                this.warnStr = 'warnStr disabled'
                this.showDialog = true
              }
            }
            console.log('getGameInfo data-----:', data)

            this.setGameRound(data.gameRound)
            this.setGameAlbums(data.gameAlbums)
            this.setSlides(data.slides)
            this.setResultCount(data.resultCount)
            this.setPlayerCount(data.playerCount)

            let style = skin.replace(originalColor, newColor)
            this.useTheme(style)

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
        useTheme(newStyle) {
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
