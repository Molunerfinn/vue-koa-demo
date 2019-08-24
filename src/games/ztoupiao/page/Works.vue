<template>

  <!-- 锦囊 -->
  <div class="works-wrap " >
    <SlideBox></SlideBox>
    <div class="widgets ">
      <div class="c_bg flex statis pd6">
          <div class="flex-item">
            <p>参与选手</p>
            <p> {{playerCount}} </p>
          </div>
          <div class="flex-item">
            <p>累计投票</p>
            <p> {{resultCount}} </p>
          </div>
          <div class="flex-item">
            <p>累计浏览</p>
            <p> 0 </p>
          </div>
        </div>
      <div class="pd6">
        <div class="countdown-wrap">
          <div class="abg"> </div>
          <div class="title tac"> <span> 距离活动结束还有 </span> </div>
          <ul class="countdown">
            <li><span class="c_bg time">{{timeToEnd.d1}}</span>
              <span class="c_bg time">{{timeToEnd.d2}}</span>
              <span> 天 </span>
            </li>
            <li> <span class="c_bg time">{{timeToEnd.h1}}</span>
              <span class="c_bg time">{{timeToEnd.h2}}</span>
              <span> 时 </span></li>
            <li> <span class="c_bg time">{{timeToEnd.m1}}</span>
              <span class="c_bg time">{{timeToEnd.m2}}</span>
              <span> 分 </span></li>
            <li> <span class="c_bg time">{{timeToEnd.s1}}</span>
              <span class="c_bg time">{{timeToEnd.s2}}</span>
              <span> 秒 </span></li>
          </ul>
        </div>

      </div>
      <div class="pd6">
        <p>开始时间: {{displayStartAt}} </p>
        <p>结束时间: {{displayEndAt}} </p>
      </div>
    </div>
    <WorksListBox  class=" " > </WorksListBox>
  </div>

</template>

<script>

  import $ from 'jquery'
  import moment from 'moment'
  import WorksListBox from './works/WorksListBox.vue'
  import SlideBox from './slider.vue'
  export default {
    components: {
      WorksListBox,
      SlideBox
    },
    props: {
      gamePlayer: {
        type: Object
      }
    },
    data() {
      return {
        postersData: [],
        gameRoundEndAt: null,

        timeToEnd: {
          d1: 0,
          d2: 0,
          h1: 0,
          h2: 0,
          m1: 0,
          m2: 0,
          s1: 0,
          s2: 0
        },
        style: {
          statusUserImg: {}
        },
        gamePlayerRank: [],
        menuLen: 2,
        currentPlayer: {},
      }
    },
    created() {
      window.$ = $
    },
    mounted() {},
    computed: {
      hasRank() {
        return this.gamePlayerRank.length > 0
      },
      currentPlayerRank() {
        return this.currentPlayer.rank != undefined && this.currentPlayer.rank != null && this.currentPlayer.rank >= 0
          ? this.currentPlayer.rank
          : '无'
      },
      displayStartAt() {
        return moment(this.gameRound.start_at).format('YYYY年MM月DD日 HH时mm分')
      },
      displayEndAt() {
        return moment(this.gameRound.end_at).format('YYYY年MM月DD日 HH时mm分')
      }
    },
    methods: {

      countTime: function() {
        var that = this
        // 获取当前时间

        // 设置截止时间
        var endDate = new Date(this.gameRoundEndAt)
        var end = endDate.getTime()
        // 时间差
        // 定义变量 d,h,m,s保存倒计时的时间
        setInterval(function() {
          var date = new Date()
          var now = date.getTime()
          var leftTime = end - now
          if (leftTime >= 0) {
            var d = Math.floor(leftTime / 1000 / 60 / 60 / 24)
            that.timeToEnd.d1 = parseInt(d / 10)
            that.timeToEnd.d2 = parseInt(d % 10)
            var h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
            that.timeToEnd.h1 = parseInt(h / 10)
            that.timeToEnd.h2 = parseInt(h % 10)
            var m = Math.floor((leftTime / 1000 / 60) % 60)
            that.timeToEnd.m1 = parseInt(m / 10)
            that.timeToEnd.m2 = parseInt(m % 10)
            var s = Math.floor((leftTime / 1000) % 60)
            that.timeToEnd.s1 = parseInt(s / 10)
            that.timeToEnd.s2 = parseInt(s % 10)
          }
        }, 1000)
      },
      initGame() {
        this.gameRoundEndAt = this.gameRound.end_at
        this.countTime()
      },
    },
    watch: {
      gameRound: function(val, oldVal) {
        //初始化游戏
        this.initGame()
      }

    }
  }

</script>

<style lang="css" scoped>

  .works-wrap {
    height: 100%;
   }
  ul.countdown {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  ul.countdown li {
    background-color: #fff;
    padding: 5px;
  }
  ul.countdown li .time {
    border-radius: 5px;
    padding: 2px 8px;
    font-size: 18px;
  }
  .countdown-wrap {
    position: relative;
  }
  .countdown-wrap .title {
    padding: 8px 0;
  }
  .countdown-wrap .title span {
    background-color: #fff;
    padding: 0 5px;
  }

  .countdown-wrap .abg {
    position: absolute;
    top: 24px;
    bottom: 16px;
    left: 1px;
    right: 1px;
    border: 1px solid gray;
    z-index: -1;
  }
   .statis{
    text-align: center;
    padding: 16px 0;
  }
  .flex.statis .item:first-child{
    border-right: 1px solid #40220F;
  }
  .flex.statis .item:last-child{
    border-left: 1px solid #40220F;
  }

</style>
