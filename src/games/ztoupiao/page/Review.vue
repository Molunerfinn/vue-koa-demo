<template>
 <div class="ReviewBox">
   <SlideBox></SlideBox>
   <div class="reviewDesc pd12">
     <p id="explaiDrawInfoBox" class="" v-html="gameRound.desc"></p>
   </div>
 </div>
</template>

<script>
import SlideBox from './slider.vue'

export default {
  components: {
    SlideBox
  },
  data() {
    return {
      style:{
        statusUserImg: {}
      },
      gamePlayerRank: [],
      menuLen: 2,
      currentPlayer:{}
    }
  },
  created() {

  },
  mounted(){

  },
  computed:{

  },
  methods: {

  },
  watch: {
  }
}
</script>

<style lang="css" >

  .reviewDesc img{
    width: 100%;
    height: auto;
  }
</style>
