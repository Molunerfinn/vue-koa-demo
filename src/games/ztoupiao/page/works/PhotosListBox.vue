<template>
<!-- 锦囊 -->
<div class="PhotosListBox c_bg">
  <div class="back pd6"><a v-on:click="back"> <span class="iconfont icon-round-left-fill " > </span></a>
  </div>
  <div class="player  mg-rl6">
    <div class="title tac">
      <p> {{album.position}} 号 {{ album.name}}</p>
      <p>{{album.desc}} </p>
    </div>

    <div class="c_bg flex statis">
      <div class="flex-item">
        <p>1</p>
        <p>排名</p>
      </div>
      <div class="flex-item">
        <p>2</p>
        <p>票数</p>
      </div>
      <div class="flex-item">
        <p> 2 票</p>
        <p>距前一名</p>
      </div>
    </div>
    <div class="work pd12">
      <div class="">
        <img id="PhotographsTitle" v-bind:src="album.Photos[0].originalUrl">
        <div class="thumbup pd-tb6">
          <a class="weui-btn weui-btn_primary" @click="thumb_up(album.id)" href="javascript:" id="showTooltips">点赞</a>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// import moment from 'moment';
// import { getRoundState } from '@/api/games/ztoupiao'

import queryString from 'query-string'
import {
  thumbUp,
  getAlbumInfo
} from '@/api/games/ztoupiao'

export default {
  props: {
    command: {
      default: false // 可选值: showResult, showGift
    }
  },
  data() {
    return {
      album: {
        Photos: [{
          originalUrl: ''
        }]
      },
      gamePlayer: {},
      getRoundState: {}

    }
  },
  created() {


    var params = {
      id: this.albumId,
      code: 'ztoupiao'
    }
    getAlbumInfo(this.number, params).then(data => {
      console.log('getAlbumInfo---:', data);
      this.album = data
    });

  },
  computed: {
    albumId() {
      return this.$route.params.id
    }
  },
  watch: {
    '$route': 'initData'
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    thumb_up: function (id) {
      const parsed = queryString.parse(location.search)

      var number = parsed.number

      var params = {
        parsed: parsed,
        code: 'ztoupiao',
        album_id: id
      }

      thumbUp(number, params).then(data => {
        console.log(data);
      });
    },
  },

}
</script>

<style lang="css" scoped>
  .weui-navbar.works{
    position: relative;
  }
  .photo_list{
    height: 60vh;
  }
  .photo{
    position: relative;
    height: 10vh;
    background-repeat: no-repeat;
  }
  .statis{
    text-align: center;
    padding: 16px 0;
  }
  .statis .item:first-child{
    border-right: 1px solid #fff;
  }
  .statis .item:last-child{
    border-left: 1px solid #fff;
  }
  .player{
    padding: 12px;
  }
  .work{
    background-color: #fff;
  }
  .back{
    background-color: #fff;
  }
  .back .iconfont{
    font-size: 180%;
    color: rgba(0, 0, 0, 0.3);
  }
  .c_bg{
    background-color: #f2f2f2;
  }
</style>
