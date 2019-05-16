<template>
  <div class="msgbox" v-show="visible">
    <div class="weui-mask" style="z-index:5000" ></div>

    <div class="weui-dialog">
      <div class="weui-dialog__bd">
        <span id="statusTip-msg"></span><br/><span id="sTime"></span></div>
      <div class="weui-dialog__ft"><a href="javascript:;" @touchstart="handleOK" class="weui-dialog__btn weui-dialog__btn_primary">知道了</a></div>
    </div>

  </div>
</template>


<script>

  export default {
    props: {

      msg: String, // 提示信息

      command: {
        default: 'none' // 可选值: showResult, showGift
      }
    },
    data() {
      return {
        visible: false
      }
    },
    methods:{
      handleOK(){
        console.log( "handleOK ")
        this.visible = false
      }

    },
    watch: {
      command: function (val, oldVal) {
        //外部触发游戏开始
        console.log('watch-command new: %s, old: %s', val, oldVal)
        if( val == 'show'){
          this.visible = true
        }
        if( val == 'hide'){
          this.visible = false
        }
        this.$emit('commandDone')
      }
    }
  }

</script>
