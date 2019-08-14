<template>
  <!-- 锦囊 -->
  <div class="SlideBox">
    <div class="swiper-container swiper-container-initialized swiper-container-horizontal">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="photo in slides">
          <img :src="photo.originalUrl" />
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>

</template>

<script>

  import $ from 'jquery'
  import moment from 'moment'
  // import queryString from 'query-string'
  import Swiper from 'swiper'
  export default {
    components: {
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
        ui: {
          showHome: true
        },
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
        mySwiper: null
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
      showPhotosList: function() {
        this.ui.showHome = false
      },
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
      // 点击查看成绩
      setSlideBar(isAnimation) {
        var anFlag = isAnimation
        if (anFlag) {
          if (!$('#poupInfoBox').hasClass('enlarge')) {
            $('#poupInfoBox').addClass('enlarge')
          }
        } else {
          $('#poupInfoBox').addClass('retrans')
        }
        //$(".gameBox,.home,.body").addClass("overflow-y-hidden");
      },
      initGame() {
        this.gameRoundEndAt = this.gameRound.end_at
        this.countTime()
      },
      initSwiper() {
        this.$nextTick(() => {
          this.mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            loop: true,
            autoplay: true,
            noSwiping: true,
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            }
          })
        })
      }
    },
    watch: {
      gameRound: function(val, oldVal) {
        //初始化游戏
        this.initGame()
      },
      slides: function(val, oldVal) {
        //初始化游戏
        this.initSwiper()
      }
    }
  }

</script>

<style lang="css" scoped>

  .ruleBox {
  }
  .poupMain {
    /*display: none;*/
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
    background-color: #1aad19;
    color: #ffffff;
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
    top: 8px;
    bottom: 16px;
    left: 5px;
    right: 5px;
    border: 1px solid gray;
    z-index: -1;
  }

  .swiper-container {
    width: 100%;
  }
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    justify-content: center;
    align-items: center;
  }
  .swiper-slide img{
    width: 100%;
    height: auto;
  }
  .statis{
    padding: 16px 0;
  }
  .flex.statis .item{
    flex-grow: 1
  }
  .flex.statis .item:first-child{
    border-right: 1px solid #40220F;
  }
  .flex.statis .item:last-child{
    border-left: 1px solid #40220F;
  }

</style>
