<template>
  <div class="home">
    <div class="login" v-show="ui.loginVisiable">
      <p>Login</p>
      <div class="weui-cell__bd">
        <input style="margin:0px;border: none;" id="name" class="weui-input theInputDecide textInput" propname="帐号" propkey="username"
               type="text"
               placeholder="请输入帐号"
               v-model="userInfo.username">
      </div>
      <div class="weui-cell__bd">
        <input style="margin:0px;border: none;" id="password" class="weui-input theInputDecide textInput" propname="密码" propkey="password"
               type="password"
               placeholder="请输入密码"
               v-model="userInfo.password">
      </div>
      <div class="weui-btn-area">
        <a class="weui-btn weui-btn_primary userSubmitBtn" @click="gotomodify()" href="javascript:" id="showTooltips">modify password</a>
        <a class="weui-btn weui-btn_primary userSubmitBtn" @click="login()" href="javascript:" id="showTooltips">login</a>
      </div>
    </div>
    <div class="modify" v-show="ui.modifyCode">
      <div v-show="!ui.checksuccess">
        <div class="weui-cell__bd">
          <input style="margin:0px;border: none;" id="modifyname" class="weui-input theInputDecide textInput" propname="帐号" propkey="modifyname"
                 type="text"
                 placeholder="请输入帐号"
                 v-model="modifyInfo.username">
        </div>
        <div class="weui-cell__bd">
          <input style="margin:0px;border: none;" id="oldpassword" class="weui-input theInputDecide textInput" propname="旧密码" propkey="oldpassword"
                 type="password"
                 placeholder="请输入旧密码"
                 v-model="modifyInfo.oldpassword">
        </div>
        <div class="weui-btn-area">
          <a class="weui-btn weui-btn_primary userSubmitBtn" @click="check()" href="javascript:" id="showTooltips">commit</a>
        </div>
        <div class="weui-btn-area">
          <a class="weui-btn weui-btn_primary userSubmitBtn" @click="back()" href="javascript:" id="showTooltips">return</a>
        </div>
      </div>
      <div v-show="ui.checksuccess">
        <div class="weui-cell__bd">
          <input style="margin:0px;border: none;" id="newpassword" class="weui-input theInputDecide textInput" propname="请密码" propkey="newpassword"
                 type="password"
                 placeholder="请输入新密码"
                 v-model="modifyInfo.newpassword">
        </div>
        <div class="weui-cell__bd">
          <input style="margin:0px;border: none;" id="checkpassword" class="weui-input theInputDecide textInput" propname="确认密码" propkey="checkpassword"
                 type="password"
                 placeholder="请确认密码"
                 v-model="modifyInfo.checkpassword">
        </div>
        <a class="weui-btn weui-btn_primary userSubmitBtn" @click="modify()" href="javascript:" id="showTooltips">commit</a>
      </div>
    </div>
    <authorize v-show="ui.authorizeVisiable"></authorize>
  </div>
</template>

<script>
import {
  login,
  check,
  modify
} from '@/api/backend.js'

import authorize from './authorize.vue'

const md5 = require('md5');

  export default {
    name: 'app',
    components: {
      authorize
    },
    created() {

    },
    data() {
      return {
        userInfo:{
          username:'',
          password:''
        },
        modifyInfo:{
          username:'',
          oldpassword:'',
          newpassword:'',
          checkpassword:''
        },
        ui:{
          loginVisiable:true,
          modifyCode:false,
          checksuccess:false,
          authorizeVisiable:false
        }
      }
    },
    methods: {
      login: function(){
        console.log('login function');
        let secretString = 'md5'+this.userInfo.username+this.userInfo.password+'md5'
        let secret = md5(secretString)

        let params = {
          username:this.userInfo.username,
          secret:secret
        }
        console.log('params--:',params);
        login(params).then(data => {
          console.log('data--:',data);
          if(data.res =='login success!'){
            this.ui.authorizeVisiable = true
            this.ui.loginVisiable = false
          }
        })
      },
      gotomodify: function(){
        this.ui.loginVisiable =false
        this.ui.modifyCode = true
      },
      back: function(){
        this.ui.loginVisiable =true
        this.ui.modifyCode = false
      },
      check: function(){
        let secretString = 'md5'+this.modifyInfo.username+this.modifyInfo.oldpassword+'md5'
        let secret = md5(secretString)
        let params = {
          username:this.modifyInfo.username,
          secret:secret
        }
        console.log('params--:',params);
        check(params).then(data => {
          console.log('data--:',data);
          if(data.res =='login success!'){
            this.ui.checksuccess =true
          }
        })
      },
      modify: function(){
        let newpassword = this.modifyInfo.newpassword
        let checkpassword = this.modifyInfo.checkpassword

        if(newpassword!=null){
          if(newpassword == checkpassword){
            let params = {
              username:this.modifyInfo.username,
              newpassword:newpassword
            }
            console.log('params--:',params);
            modify(params).then(data => {
              console.log('data--:',data);
              if(data.res =='modify success!'){
                this.ui.loginVisiable = true
                this.ui.modifyCode = false
                this.ui.checksuccess = false
              }
            })
          }
        }
      }
    }
  }

</script>

<style>

</style>
