<template>
  <div id="loadingToast" class="hide" v-show="isLoading">
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast">
      <i class="weui-loading weui-icon_toast"></i>
      <p class="weui-toast__content"></p>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    isLoading: {
      default: false
    }
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="css" scoped>

</style>
