<template>
  <div class="swiper-container swiper-container-initialized swiper-container-horizontal">
    <div class="swiper-wrapper">
      <!-- //////////////////////////////////////////////////////////////// -->
    <div class="swiper-slide" style="background:#00FF00">活动已经结束</div>
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
          <td><el-input id="name" v-model="player_info.name" placeholder="请输入姓名" clearable></el-input></td><a id="name1"></a>
        </tr>
        <tr>
          <td>TEL:</td>
          <td><el-input id="tel" v-model="player_info.tel" placeholder="请输入电话" clearable></el-input></td><a id="tel1"></a>
        </tr>
        <tr>
          <td>DATE:</td>
          <td>
            <form name="reg_testdate">
              <select name="YYYY" id="YYYY" @onchange="YYYYDD(this.value)">
                <option value="">请选择 年</option>
              </select>
              <select name="MM"  id="MM"@onchange="MMDD(this.value)">
                <option value="">选择 月</option>
              </select>
              <select name="DD" id="DD">
                <option value="">选择 日</option>
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
    <div class="swiper-slide" style="background:#FF0000">
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
import fetch from 'node-fetch'

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
      mySwiper: null
    }
  },
  methods: {
    post_gameround: function () {
      const body = {
        id: 1,
        game_round: {
          game_id: 1,
          name: 'a new data',
          creator_id: 1
        }
      }

      fetch('http://127.0.0.1:3000/post/game_rounds', {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
      })
    },
    next: function (page) {
      this.mySwiper.slideTo(page, 100, false)
    },
    check_remaining: function (remaining) {
      // console.log(remaining);
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
        this.player_info.name = document.getElementById('name').value
        this.player_info.tel = parseInt(document.getElementById('tel').value)
        this.player_info.birth = document.getElementById('YYYY').value +
          '-' + document.getElementById('MM').value +
          '-' + document.getElementById('DD').value

        const body = {
          openid: this.player.openid,
          player_info: this.player_info
        }
        console.log(JSON.stringify(body))
        fetch('http://127.0.0.1:3000/put/put_msg', {
          method: 'put',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' }
        })
        this.next(4)
      }
    },
    sign_up: function (store_id,status) {
      console.log('status:'+status);
      if(status=='weui-btn weui-btn_primary'){
        var player = this.player
        const body = {
          player_info: {
            openid: player.openid,
            default_store_id: store_id,
            start_at: new Date(),
            end_at: new Date()
          }
        }

        fetch('http://127.0.0.1:3000/post/sign_up', {
          method: 'post',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' }
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
        if (date_str === this.results[i].createtime) {
          is_ok = false
        }
      }
      var thumb_result = document.getElementById('thumb_result')
      if (is_ok) {
        const body = {
          result: {
            openid: player.openid,
            to_player_id: player.to_player_id,
            createtime: date_str,
            sourceid: ""+player.openid+player.to_player_id+now_year+now_month+now_day
          }
        }
        fetch('http://127.0.0.1:3000/post/thumb_up', {
          method: 'post',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' }
        })
        thumb_result.innerHTML = '点赞成功!!!目前' + player.nickname + '已经收集了' + (this.results.length + 1) + '个赞'
      } else {
        thumb_result.innerHTML = '你今天已经点过赞了!!目前' + player.nickname + '已经收集了' + (this.results.length) + '个赞'
      }
      this.next(6)
    },
    countTime: function () {
      // 获取当前时间
      var date = new Date()
      var now = date.getTime()
      // 设置截止时间
      var endDate = new Date('2019-04-16 16:59:59')
      var end = endDate.getTime()
      // 时间差
      var leftTime = end - now
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
      var date = new Date()
      var now = date.getTime()
      // 设置截止时间
      var endDate = new Date('2019-11-10 23:59:59')
      var end = endDate.getTime()
      // 时间差
      var leftTime = end - now
      var mySwiper = new Swiper('.swiper-container',
        {
          preventInteractionOnTransition: true,
          direction: 'vertical',
          noSwiping: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        })
      if (leftTime >= 0) {
        mySwiper.removeSlide(0)
      } else {
        mySwiper.lockSwipes()
      }
    }
  },
  created () {
    fetch('http://127.0.0.1:3000/start?1')
      .then(res => {
        return res.json()
      })
      .then(json => {
        var start_info = json
        this.game_rounds = start_info['round']
        this.player_info = start_info['player_info']
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
          el: '.swiper-pagination',
          clickable: true
        }
      })
    this.mySwiper.on('click', (e) => {
      console.log(e)
    })

    this.checkTime()
    this.countTime()
  }
}
function YYYYMMDDstart () {
  var MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  // 先给年下拉框赋内容
  var y = new Date().getFullYear()
  for (var i = (y - 100); i < (y + 10); i++) // 以今年为准，前100年，后10年
  { document.reg_testdate.YYYY.options.add(new Option(' ' + i + ' 年', i)) }

  // 赋月份的下拉框
  for (var m = 1; m < 13; m++) { document.reg_testdate.MM.options.add(new Option(' ' + m + ' 月', m)) }

  document.reg_testdate.YYYY.value = y
  document.reg_testdate.MM.value = new Date().getMonth() + 1
  var n = MonHead[new Date().getMonth()]
  if (new Date().getMonth() == 1 && IsPinYear(y)) n++
  writeDay(n) // 赋日期下拉框Author:meizz
  document.reg_testdate.DD.value = new Date().getDate()
}
if (document.attachEvent) { window.attachEvent('onload', YYYYMMDDstart) } else { window.addEventListener('load', YYYYMMDDstart, false) }
function YYYYDD (str) // 年发生变化时日期发生变化(主要是判断闰平年)
{
  var MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  var MMvalue = document.reg_testdate.MM.options[document.reg_testdate.MM.selectedIndex].value
  if (MMvalue == '') { var e = document.reg_testdate.DD; optionsClear(e); return }
  var n = MonHead[MMvalue - 1]
  if (MMvalue == 2 && IsPinYear(str)) n++
  writeDay(n)
}
function MMDD (str) // 月发生变化时日期联动
{
  var MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  var YYYYvalue = document.reg_testdate.YYYY.options[document.reg_testdate.YYYY.selectedIndex].value
  if (YYYYvalue == '') { var e = document.reg_testdate.DD; optionsClear(e); return }
  var n = MonHead[str - 1]
  if (str == 2 && IsPinYear(YYYYvalue)) n++
  writeDay(n)
}
function writeDay (n) // 据条件写日期的下拉框
{
  var e = document.reg_testdate.DD; optionsClear(e)
  for (var i = 1; i <= (n + 1); i++) { e.options.add(new Option(' ' + i + ' 日', i)) }
}
function IsPinYear (year)// 判断是否闰平年
{
  return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
}
function optionsClear (e) {
  e.options.length = 1
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
