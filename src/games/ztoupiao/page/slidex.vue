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
        mySwiper: null
      }
    },
    created() {
    },
    mounted() {},
    computed: {
    },
    methods: {
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
      slides: function(val, oldVal) {
        //初始化游戏
        this.initSwiper()
      }
    }
  }

</script>

<style lang="css" scoped>

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

</style>
