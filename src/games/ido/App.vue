<template>
  <div class="swiper-container swiper-container-initialized swiper-container-horizontal">
    <div class="swiper-wrapper">
      <!-- //////////////////////////////////////////////////////////////// -->
    <div class="swiper-slide swiper-no-swiping" style="background:#00FF00">活动已经结束</div>
      <!-- ////////////////////////////////////////////////////////// -->
    <div class="swiper-slide" style="background:#0000FF">
      <div class="div_1_img">
        <img src="../../assets/logo.png"  alt="logo" width="100vw" height="100vh"/>
      </div>
      <div class="div_1_p">
        <!-- <el-button type="primary" plain>主要按钮</el-button>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress> -->
        <button  type="button" @click="post_gameround()">POST</button>
        {{game_rounds}}
        {{stores}}
        {{player}}
        {{gifts}}
      </div>
    </div>
    <!-- ////////////////////////////////////////////////////////// -->
    <div class="swiper-slide" style="background:#00FF00">
      <div class="div_2_blank">
      </div>
      <hr style="height:1px;border:none;border-top:1px solid #555555;" />
      <div class="div_2_img">
        <img src="../../assets/logo.png"  alt="logo" width="100vw" height="100vh"/>
      </div>
      <button class="div_2_button" type="button" @click="next(2)">点我!</button>
    </div>
    <!-- ////////////////////////////////////////////////////////// -->
    <div class="swiper-slide swiper-no-swiping" style="background:#FF0000">
      <table border="1" class="div_3_table" ontouchstart="">
        <tr>
          <th>shop_name</th>
          <th>shop_tel</th>
          <th>remaining</th>
          <th>button</th>
        </tr>
        <tr v-for="store in stores">
          <td>{{store.store_name}}</td>
          <td>{{store.tel}}</td>
          <td>{{store.remaining}}</td>
          <td><button type="button" href="" :class="check_remaining(store.remaining)" @click="sign_up(store.store_id,check_remaining(store.remaining))">报名</button></td>
        </tr>
      </table>
    </div>
    <!-- ////////////////////////////////////////////////////////// -->
    <div class="swiper-slide swiper-no-swiping" style="background:#0000FF">
      <div class="div_4_img">
        <img src="../../assets/logo.png"  alt="logo" width="100vw" height="100vh"/>
      </div>
      <table border="1" class="div_4_table" align="right">
        <tr>
          <td>NAME:</td>
          <td><input id="name" v-model="player_info.name"></input></td><a id="name1"></a>
        </tr>
        <tr>
          <td>TEL:</td>
          <td><input id="tel" v-model="player_info.tel"></input></td><a id="tel1"></a>
        </tr>
        <tr>
          <td>DATE:</td>
          <td>
            <form name="reg_testdate">
              <select name="YYYY" id="YYYY">
                <option value="">请选择 年</option>
                <Option v-for="y in yearList" :value="y.value" :key="y.value" name="yearValue" id="YYYY">{{y.lable }}</Option>
            </select>
              <select name="MM" id="MM">
              <option value="">请选择 月</option>
              <Option v-for="m in monthList" :value="m.value" :key="m.value" name="yearValue" id="MM">{{m.lable }}</Option>
          </select>
          <select name="DD" id="DD">
            <option value="">请选择 日</option>
            <Option v-for="d in dayList" :value="d.value" :key="d.value" name="yearValue" id="DD">{{d.lable }}</Option>
        </select>
            </form>
          </td>
        </tr>
      </table>
      <button  @click="post_msg()" style="margin-top:5vh" type="button">点我!</button>
    </div>
    <!-- ////////////////////////////////////////////////////////// -->
    <div class="swiper-slide swiper-no-swiping" style="background:#00FF00">
      <p><button  type="button" @click="next(5)">点我down</button></p>
      <p><button  type="button" @click="next(3)">点我up</button></p>

    </div>
    <!-- ////////////////////////////////////////////////////////// -->
    <div class="swiper-slide swiper-no-swiping" style="background:#FF0000">
      <div class="div_6_p">
        <!-- <button  @click="countTime()" type="button"></button> -->
        剩余天数:{{d}}天{{h}}时{{m}}分{{s}}秒
      </div>
      <div class="div_6_div">
        <table border="1" align="center" class="div_6_table">
          <tr><button  @click="thumb_up()" style="margin-top:5vh" type="button">点赞</button></tr>
          <tr>
            <th>gift_img</th>
            <th>gift_name</th>
            <th>remaining_qty</th>
          </tr>
          <tr v-for="gift in gifts">
            <td><img src="../../assets/logo.png" alt="logo" width="100vw" height="100vh"/></td>
            <td>{{gift.gift_name}}</td>
            <td>{{gift.remaining}}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- ////////////////////////////////////////////////////////// -->
    <div class="swiper-slide swiper-no-swiping" style="background:#0000FF">
      <div>
        <table style="width: 90vw;" align="center">
          <tr>
            <td><a id="thumb_result"></a></td>
            <td><button type="button" @click="next(0)">点我!</button></td>
          </tr>
        </table>
      </div>
      <hr style="height:1px;border:none;border-top:1px solid #555555;" />
      <div class="div_7_p">
        aaaaaaaaaaaaaaaaaaaaaaaaaa
      </div>
      <div class="div_7_div">
        <table border="1" align="center" class="div_7_table">
          <tr>
            <th>gift_img</th>
            <th>gift_name</th>
          </tr>
          <tr v-for="gift in gifts">
            <td><img src="../../assets/logo.png" alt="logo" width="100vw" height="100vh"/></td>
            <td>{{gift.gift_name}}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- ////////////////////////////////////////////////////////// -->
    <div class="swiper-slide" style="background:#00FF00">Slide 8</div>
  </div>
     <div class="swiper-pagination"></div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import { getGameInfo,postSignUp,postThumbUp,postMsg } from '@/api/games/ido'

export default {
  name: 'App',
  data () {
    return {
      stores: null,
      player: null,
      player_info: {
        name: '请输入姓名',
        tel: 1
      },
      gifts: {},
      results: null,
      game_rounds: null,
      gameround_store_gifts: null,
      d: null,
      h: null,
      m: null,
      s: null,
      mySwiper: null,
      n: null,
      year: null,
      yearList: [],
      monthList: [],
      dayList:[]
    }
  },
  methods: {
    next: function (page) {
      this.mySwiper.slideTo(page,100)
    },
    check_remaining: function (remaining) {
      // //console.log(remaining);
      if (remaining > 0) {
        return 'weui-btn weui-btn_primary'
      } else {
        return 'weui-btn weui-btn_disabled weui-btn_primary'
      }
    },
    selectArInfo: function (val) {
      this.selectArr = val
    },
    post_msg: function () {
      var msg_is_ok = true

      var name = document.getElementById('name')
      var name1 = document.getElementById('name1')
      var verify = name.value
      if (verify == '') {
        name1.innerHTML = '姓名不能为空'
        name1.style.color = 'red'
        msg_is_ok = false
      } else {
        name1.innerHTML = '正确'
        name1.style.color = 'green'
      }

      var tel0 = /^1\d{10}$/
      var ema = document.getElementById('tel').value
      var ema1 = document.getElementById('tel1')
      if (tel0.test(ema) == true) {
        ema1.innerHTML = '正确'
        ema1.style.color = 'green'
      } else {
        ema1.innerHTML = '格式错误'
        ema1.style.color = 'red'
        msg_is_ok = false
      }

      if (msg_is_ok) {
          var openid =  this.player.openid
          var realname = document.getElementById('name').value
          var tel = parseInt(document.getElementById('tel').value)
          var birth = document.getElementById('YYYY').value +
            '-' + document.getElementById('MM').value +
            '-' + document.getElementById('DD').value
            //console.log('birth:',birth);
          var data = {openid,realname,tel,birth}
        postMsg(data).then((res)=>{
          //console.log( 100000, res )
          return res
        })
        this.next(4)
      }
    },
    sign_up: function (store_id,status) {
      //console.log('status:'+status);
      if(status=='weui-btn weui-btn_primary'){
        var player = this.player
        const openid = player.openid
        const default_store_id = store_id
        const start_at = this.getServerTime();
        const end_at = this.getServerTime();
        const data = {openid,default_store_id,start_at,end_at}

        postSignUp(data).then((res)=>{
          //console.log( 100000, res )
          return res
        })

        this.next(3)
      }
    },
    thumb_up: function () {
      var player = this.player

      var now_year = new Date().getFullYear()
      var now_month = new Date().getMonth() + 1
      var now_day = new Date().getDate()
      var date_str = now_year + '-' + now_month + '-' + now_day
      var is_ok = true
      for (var i = 0; i < this.results.length; i++) {
        //console.log(date_str);
        //console.log(this.results[i].createtime);
        if (date_str === this.results[i].createtime) {
          is_ok = false
        }
      }
      var thumb_result = document.getElementById('thumb_result')
      if (is_ok) {
            var openid=player.openid
            var to_player_id=player.to_player_id

            const data = {openid,to_player_id,now_year,now_month,now_day}

            postThumbUp(data).then((res)=>{
              //console.log( 100000, res )
              return res
            })
        thumb_result.innerHTML = '点赞成功!!!目前' + player.nickname + '已经收集了' + (this.results.length + 1) + '个赞'
      } else {
        thumb_result.innerHTML = '你今天已经点过赞了!!目前' + player.nickname + '已经收集了' + (this.results.length) + '个赞'
      }
      this.next(6)
    },
    countTime: function () {
      // 获取当前时间
      var date = this.getServerTime();
      // 设置截止时间
      var endDate = new Date(2019,3,22,17,0,0)
      var end = endDate.getTime()
      // 时间差
      var leftTime = end - date
      // 定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        this.d = Math.floor(leftTime / 1000 / 60 / 60 / 24)
        this.h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
        this.m = Math.floor(leftTime / 1000 / 60 % 60)
        this.s = Math.floor(leftTime / 1000 % 60)
      }
      // 递归每秒调用countTime方法，显示动态时间效果
      setTimeout(this.countTime, 1000)
    },
    checkTime: function () {
      // 获取当前时间
      var date = this.getServerTime();
      // 设置截止时间
      var endDate = new Date(2019,11,11)
      //console.log(endDate);
      var end = endDate.getTime()
      //console.log(end);
      // 时间差
      var leftTime = end - date
      //console.log(leftTime);

      if (leftTime >= 0) {
        this.mySwiper.removeSlide(0)
      }
    },
    getServerTime: function() {
      var time = new Date();
      //console.log('time:',time,'this.timeDeviation',this.timeDeviation);
      if (typeof this.timeDeviation != "undefined") {
        time += this.timeDeviation
      }
      return time
    }
  },
  created () {

    let data=  1
    getGameInfo( data ).then((res)=>{
      //console.log( 100000, res )
      return res
    }).then(json => {
      var start_info = json
      this.game_rounds = start_info['round']
      //console.log('start_info:',start_info['player_info']);
      if(start_info['player_info']!==null){
        //console.log('inininininininin');
        this.player_info = start_info['player_info']
      }
      this.player = start_info['player']
      this.stores = start_info['store']
      this.gifts = start_info['gift']
      this.results = start_info['result']
    })
  },
  mounted () {
    this.mySwiper = new Swiper('.swiper-container',
      {
        direction: 'vertical',
        noSwiping: true,
        pagination: {
          clickable: true
        }
      })
    this.mySwiper.on('click', (e) => {
      //console.log(e)
    })

    this.checkTime()
    this.countTime()

    for(let i = 1960;i<2019;i++){
      let option = {
        value: i,
        lable: i+'年'
      }
      this.yearList.push(option);
    }
    for(let i=1;i<13;i++){
      let option = {
        value: i,
        lable: i+'月'
      }
      this.monthList.push(option);
    }

    for(let i=1;i<32;i++){
      let option = {
        value: i,
        lable: i+'日'
      }
      this.dayList.push(option);
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    html, body {
      position: relative;
      height: 100%;
    }
    body {
      background: #eee;
      font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
      font-size: 14px;
      color:#000;
      margin: 0;
      padding: 0;
    }
    .swiper-container {
      width: 100%;
      height: 100%;
    }
    .swiper-slide {
      text-align: center;
      font-size: 18px;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
    }
    .div_1_img{
      border:2px solid #F00;
      width:100vw;
      height:20vh;
    }.div_1_p{
      border:2px solid #F00;
      position:absolute;
      left:5vw;
      right:5vw;
      top:25vh;
      bottom:0vh;
    }.div_2_blank{
      border:2px solid #F00;
      width:100vw;
      height:20vh;
    }.div_2_img{
      border:2px solid #F00;
      position:absolute;
      left:10vw;
      right:10vw;
      top:50vh;
      bottom:20vh;
    }.div_2_button{
      position:absolute;
      left:45vw;
      right:40vw;
      top:80vh;
      bottom:15vh;
    }.div_3_table{
      width: 100vw;
      border-spacing:0px 10px
    }.div_4_img{
      border:2px solid #F00;
      width:100vw;
      height:45vh;
    }.div_4_table{
      width: 100vw;
      border-spacing:0px 10px
    }.div_6_p{
      border:2px solid #0F0;
      position:absolute;
      left:5vw;
      right:5vw;
      top:5vh;
      bottom:65vh;
    }.div_6_table{
      word-wrap:break-word;
      word-break:break-all;
      position:absolute;
      table-layout: fixed;
      left:5vw;
      width: 90vw;
      height:30vh;
      bottom:5vh;
    }
    .div_7_p{
      border:2px solid #0F0;
      position:absolute;
      left:5vw;
      right:5vw;
      top:8vh;
      bottom:65vh;
    }.div_7_table{
      word-wrap:break-word;
      word-break:break-all;
      position:absolute;
      table-layout: fixed;
      left:5vw;
      width: 90vw;
      height:10vh;
      bottom:5vh;
    }
    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      margin-top: 60px;
    }
  </style>
