<template>
  <div id="app">
    <div class="weui-tabbar footer">
        <div align="center" class="index" @touchstart="handleTouchIndex">
          <div class="footer_text">首页</div>
        </div>
        <div align="center" class="works" @touchstart="handleTouchWorks">
          <div class="footer_text">作品</div>
        </div>
        <div align="center" class="photographs" @touchstart="handleTouchPhotographs">
          <div class="footer_text">上传</div>
        </div>
        <div align="center" class="review" @touchstart="handleTouchReview">
          <div class="footer_text">追溯</div>
        </div>
        <div align="center" class="my_account" @touchstart="handleTouchMyAccount">
          <div class="footer_text">我的</div>
        </div>
    </div>
    <IndexBox :game-player="gamePlayer" :gameRound="gameRound":command="ui.indexBoxVisible"> </IndexBox>
    <WorksBox :game-player="gamePlayer" :gameRound="gameRound":command="ui.worksBoxVisible"> </WorksBox>
    <PhotographsBox :game-player="gamePlayer" :gameRound="gameRound":command="ui.photographsBoxVisible"> </PhotographsBox>
    <ReviewBox :game-player="gamePlayer" :gameRound="gameRound":command="ui.reviewBoxVisible"> </ReviewBox>
    <MyAccountBox :game-player="gamePlayer" :gameRound="gameRound":command="ui.my_accountBoxVisible"> </MyAccountBox>
  </div>
</template>

<script>
  import { gameSkinName } from '@/config/env'
  import HdGame from '@/lib/hdgame'
  import weui from 'weui.js'
  import IndexBox from './IndexBox.vue'
  import WorksBox from './WorksBox.vue'
  import PhotographsBox from './PhotographsBox.vue'
  import ReviewBox from './ReviewBox.vue'
  import MyAccountBox from './MyAccountBox.vue'
  import queryString from 'query-string'
  import { getGameResult } from '@/api/games/zhaobaba'

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
      getGameResult();
    },
    data() {
      return {
        ui: {
          indexBoxVisible: true, // 初始页面是否可见
          worksBoxVisible: false,
          photographsBoxVisible: false,
          reviewBoxVisible: false,
          my_accountBoxVisible: false
        },
    },
    methods: {
      handleTouchIndex(event){

      },
      handleTouchWorks(event){

      },
      handleTouchPhotographs(event){

      },
      handleTouchReview(event){

      },
      handleTouchMyAccount(event){

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
