<template>
  <div class="PhotographsBox" style="display:none" v-show="ui.statusBox">
    <div class="weui-toptips weui-toptips_warn js_tooltips"></div>
    <div id="awardUserInfoBox" class="page  input js_show">
      <div class="awardUserInfoForm">
        <img id="PhotographsTitle" v-bind:src="skinAssets.workstop1ImgPath">
        <div class="weui-cells weui-cells_form">

          <div class="weui-cells__tips" style="text-align:left;">温馨提示：<br>建议您上传的萌宝照片尺寸不要超过8M，否则可能读取不到照片的参数而造成不能成功上传。</div>

          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">作品名称</label></div>
            <div class="weui-cell__bd">
              <input style="margin:0px;border: none;" id="workname" class="weui-input theInputDecide textInput" propname="作品名称" propkey="albumName"
                     type="text"
                     placeholder="限15字符">
            </div>
            <div class="weui-cell__ft warnIcon hide">
              <i class="weui-icon-warn"></i>
            </div>
          </div>

          <div class="weui-cell">
                <div class="weui-cell__bd">
                    <textarea class="weui-textarea" id="workdesc" placeholder="限60字符" rows="3"></textarea>
                    <div class="weui-textarea-counter"><span>0</span>/60</div>
                </div>
            </div>

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
import GameRes from './game/GameRes'
import {
  postMsg
} from '@/api/games/ztoupiao.js'
export default {
  props: {
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
      skinAssets: {
        workstop1ImgPath: GameRes.skinAssets.workstop1ImgPath
      },
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
      var workname = document.getElementById('workname').value
      var workdesc = document.getElementById('workdesc').value

      if (realname == '') {
        weui.form.showErrorTips({
          ele: document.getElementById("name"),
          msg: '姓名不能为空'
        });
        msg_is_ok = false
      }
      if (workname == '') {
        weui.form.showErrorTips({
          ele: document.getElementById("workname"),
          msg: '作品名不能为空'
        });
        msg_is_ok = false
      }
      if (workdesc == '') {
        weui.form.showErrorTips({
          ele: document.getElementById("workdesc"),
          msg: '作品描述不能为空'
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
        console.log('this.gameRound',this.gameRound);
        var data = {
          realname:realname,
          tel:tel,
          workname:workname,
          workdesc:workdesc,
          code:code,
          parsed: parsed
        }
        postMsg(number,data).then((res)=>{
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
      if( val == true){
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
