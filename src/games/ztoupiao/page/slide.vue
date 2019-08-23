<template>
<!-- 锦囊 -->
<div class="SlideBox">
  <mt-swipe :auto="4000">
    <mt-swipe-item v-for="photo in slides" :key="photo.id"><img :src="photo.originalUrl" /></mt-swipe-item>
  </mt-swipe>
</div>
</template>

<script>
import { Swipe, SwipeItem } from 'mint-ui';

export default {
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem
  },
  props: {
    gamePlayer: {
      type: Object
    }
  },
  data() {
    return {

    }
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {

  },
  watch: {
    slides: function (val, oldVal) {
      //初始化游戏
    }
  }
}
</script>

<style lang="css" scoped>


</style>
