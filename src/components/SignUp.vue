<template>
  <div class="sign_up" style="display:none" v-show="ui.statusBox">
    <div class="weui-toptips weui-toptips_warn js_tooltips"></div>
    <div id="awardUserInfoBox" class="page  input js_show">
      <div class="awardUserInfoTitle">
        <h2>填写联系信息</h2>
        <p class="tipsColor">为了方便兑奖，请先填写您的联系信息</p>
      </div>

      <div class="awardUserInfoForm">
        <div class="weui-cells weui-cells_form">
          <div style="text-align: center"><img id="headImg" v-bind:src="gamePlayer.avatar"></div>
          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">姓名</label></div>
            <div class="weui-cell__bd">
              <input style="margin:0px;border: none;" id="name" class="weui-input theInputDecide textInput" propname="姓名" propkey="ausername"
                     type="text"
                     placeholder="请输入姓名">
            </div>
            <div class="weui-cell__ft warnIcon hide">
              <i class="weui-icon-warn"></i>
            </div>
          </div>
          <div class="weui-cell contactInput-aphone contactInput">
            <div class="weui-cell__hd"><label class="weui-label">联系电话</label></div>
            <div class="weui-cell__bd">
              <input style="margin:0px;border: none;" id="tel" class="weui-input theInputDecide textInput" propname="联系电话" propkey="aphone"
                     type="text"
                     placeholder="请输入联系电话">
            </div>
            <div class="weui-cell__ft warnIcon phoneWarn hide">
              <i class="weui-icon-warn"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="weui-cells__tips">
        注:若因未填写资料或资料填写错误导致无法兑奖，主办方不承担相关法律责任;
      </div>
      <div class="weui-btn-area">
        <a class="weui-btn weui-btn_primary userSubmitBtn" @click="post_msg()" href="javascript:" id="showTooltips">提交</a>
      </div>
    </div>
  </div>

</template>

<script>
import weui from 'weui.js'
import queryString from 'query-string'
import {
  postMsg
} from '@/api/base.js'
export default {
  props: {
    gamePlayer: { // 游戏player相关数据
      type: Object,
      default: {}
    },
    gameRound: { // 游戏player相关数据
      type: Object,
      default: {}
    },
    command:{
      default: 'none' // 可选值: show, hide
    }
  },
  data () {
    return {
      ui:{
        statusBox: false
      },
      account: '',
      password: ''
    }
  },
  methods: {
    post_msg: function () {
      console.log('========post_msg========');
      var msg_is_ok = true
      var realname = document.getElementById('name').value
      var tel = parseInt(document.getElementById('tel').value)

      if (realname == '') {
        weui.form.showErrorTips({
          ele: document.getElementById("name"),
          msg: '姓名不能为空'
        });
        msg_is_ok = false
      }

      var tel0 = /^1\d{10}$/
      var ema = document.getElementById('tel').value
      if (tel0.test(ema) == false) {
          weui.form.showErrorTips({
            ele: document.getElementById("tel"),
            msg: '手机号码格式错误'
          });
          msg_is_ok = false
      }
      if(msg_is_ok){
        const parsed = queryString.parse(location.search);
        var number = parsed.number;
        var code = this.gameRound.code;
        console.log('code===:',code);
        var data = {
          gamePlayer: this.gamePlayer,
          realname:realname,
          tel:tel
        }
        postMsg(code,number,data).then((res)=>{
          this.$emit('signUpOver',res)
          this.statusBox = false
        })

      }
    },
  },
  watch: {
    command: function (val, oldVal) {
      //外部触发游戏开始
      console.log('watch-command new: %s, old: %s', val, oldVal)
      if( val == 'show'){
        console.log('show');
        this.ui.statusBox = true
      }else{
        console.log('hide');
        this.ui.statusBox = false
      }

    }
  }
}
</script>
