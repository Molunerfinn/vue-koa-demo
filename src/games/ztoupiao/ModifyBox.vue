<template>
  <div class="ModifyBox" style="display:none" v-show="ui.statusBox">
    <div class="weui-toptips weui-toptips_warn js_tooltips"></div>
    <div id="awardUserInfoBox" class="page  input js_show">
      <div class="awardUserInfoForm">
        <img id="PhotographsTitle" v-bind:src="skinAssets.workstop1ImgPath">
        <div class="weui-cells weui-cells_form">

          <div class="weui-cells__tips" style="text-align:left;">温馨提示：<br>建议您上传的萌宝照片尺寸不要超过8M，否则可能读取不到照片的参数而造成不能成功上传。</div>

          <div class="weui-cell contactInput-ausername contactInput">
            <div class="page__bd">
        <div class="weui-gallery" id="gallery">
            <span class="weui-gallery__img" id="galleryImg"></span>
            <div class="weui-gallery__opr">
                <a href="javascript:" class="weui-gallery__del">
                    <i class="weui-icon-delete weui-icon_gallery-delete"></i>
                </a>
            </div>
        </div>

        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__bd">
                    <div class="weui-uploader">
                        <div class="weui-uploader__hd">
                            <p class="weui-uploader__title">图片上传</p>
                            <div class="weui-uploader__info">0/2</div>
                        </div>
                        <div class="weui-uploader__bd">
                            <ul class="weui-uploader__files" id="uploaderFiles">
                              <li class="weui-uploader__file"
                                :style="{backgroundImage:'url(\''+photo.originalUrl+'\')'}"
                                v-for="photo in albumData.Photos"
                                @click="readyToRemove(photo)">
                              </li>
                            </ul>
                            <div class="weui-uploader__input-box">
                                <input id="uploaderInput" class="weui-uploader__input" type="file" accept="image/*" @change="showImg" multiple="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
            <div class="weui-cell__hd"><label class="weui-label">作品名称</label></div>
            <div class="weui-cell__bd">
              <input style="margin:0px;border: none;" id="workname" class="weui-input theInputDecide textInput" propname="作品名称" propkey="albumName"
                     type="text"
                     placeholder="限15字符"
                     v-model="albumData.name">
            </div>
            <div class="weui-cell__ft warnIcon hide">
              <i class="weui-icon-warn"></i>
            </div>
          </div>

          <div class="weui-cell">
                <div class="weui-cell__bd">
                    <textarea class="weui-textarea" id="workdesc" placeholder="限60字符" rows="3" v-model="albumData.desc"></textarea>
                    <div class="weui-textarea-counter"><span>0</span>/60</div>
                </div>
            </div>

          <div class="weui-cell contactInput-ausername contactInput">
            <div class="weui-cell__hd"><label class="weui-label">姓名</label></div>
            <div class="weui-cell__bd">
              <input style="margin:0px;border: none;" id="name" class="weui-input theInputDecide textInput" propname="姓名" propkey="ausername"
                     type="text"
                     placeholder="请输入姓名"
                     v-model="gamePlayerData.realname">
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
                     placeholder="请输入联系电话"
                     v-model="gamePlayerData.cellphone">
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
        <a class="weui-btn weui-btn_primary userSubmitBtn" @click="readyToModify" href="javascript:" id="showTooltips">提交</a>
      </div>
    </div>
  </div>

</template>

<script>
import weui from 'weui.js'
import $ from 'jquery'
import queryString from 'query-string'
import GameRes from './game/GameRes'
import {
  postMsg
} from '@/api/games/ztoupiao.js'
import {
  modifyAlbum
} from '@/api/albums.js'
import { FileChecksum } from "@/lib/direct_upload/file_checksum"
import { BlobUpload } from "@/lib/direct_upload/blob_upload"
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
    album: { // 游戏player相关数据
      type: Object,
      default: {}
    },
    command:{
      default: 'none' // 可选值: show, hide
    }
  },
  data () {
    return {
      filelist:[],
      newfileToDelete:[],
      oldfileToDelete:[],
      albumData:{
        name: "",
        desc: "",
        Photos:[]
      },
      gamePlayerData:{
        realname:"",
        cellphone:""
      },
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
  created(){
  },
  methods: {
    readyToRemove(photo){
      console.log('==========readyToRemove==========');
      this.newfileToDelete.push(photo.originalUrl)
      if(photo.okey!=undefined){
        this.oldfileToDelete.push(photo)
      }
      for(var i=0;i<this.albumData.Photos.length;i++){
        if(this.albumData.Photos[i].originalUrl == photo.originalUrl){
          this.albumData.Photos.splice(i, 1); //删除下标为i的元素
          break;
        }
      }
      console.log('this.album------:',this.album);
    },
    async readyToModify(){
        console.log('========readyToModify========');
        var files = this.filelist;
        console.log('files----:',files);
        console.log('this.album---:',this.album);
        var msg_is_ok = true
        var realname = this.gamePlayerData.realname
        var tel = this.gamePlayerData.cellphone
        var workname = this.albumData.name
        var workdesc = this.albumData.desc

        if (realname == '') {
          weui.form.showErrorTips({
            ele: realname,
            msg: '姓名不能为空'
          });
          msg_is_ok = false
        }
        if (workname == '') {
          console.log('作品名不能为空')
          weui.form.showErrorTips({
            ele: workname,
            msg: '作品名不能为空'
          });
          msg_is_ok = false
        }
        if (workdesc == '') {
          console.log('作品描述不能为空');
          weui.form.showErrorTips({
            ele: workdesc,
            msg: '作品描述不能为空'
          });
          msg_is_ok = false
        }

        var tel0 = /^1\d{10}$/
        var ema = tel
        if (tel0.test(ema) == false) {
          console.log('手机号码格式错误');
            weui.form.showErrorTips({
              ele: tel,
              msg: '手机号码格式错误'
            });
            msg_is_ok = false
        }
        console.log('msg_is_ok:',msg_is_ok);
        if(msg_is_ok){
          const parsed = queryString.parse(location.search);
          var number = parsed.number;
          var code = this.gameRound.code;
          let album = {
            id:this.album.id,
            name:workname,
            desc:workdesc
          }
          console.log('this.gameRound',this.gameRound);
          let photos =[]
          console.log('files---:',files);
          console.log('photos---:',photos);
          console.log('this.newfileToDelete---:',this.newfileToDelete);
          let promise = new Promise(async (resolve, reject)=>{
            for(var i=0;i<files.length;i++){
              let photo = {}
              if(this.newfileToDelete.indexOf(files[i].src)>-1){
                continue;
              }
              photo.okey="okey";
              photo.file_name = files[i].name;
              photo.content_type = files[i].type;
              photo.file_size = files[i].size;
              await FileChecksum.create(files[i], (error, checksum) => {
                if (error) {
                  return
                }
                photo.checksum = checksum
                photos.push(photo);
                console.log(' photos.length:', photos.length,'files.length:',files.length);
                if( photos.length == files.length-this.newfileToDelete.length){
                  console.log('========resolve=======');
                  var data = {
                    realname:realname,
                    tel:tel,
                    code:code,
                    parsed: parsed,
                    album:album,
                    photos:photos,
                    photosToDelete:this.oldfileToDelete
                  }

                  resolve(data)
                }
              })
            }
          })


          await promise.then((data)=>{
            console.log('data------:',data);
            postMsg(number,data).then((res)=>{
              this.$emit('signUpOver',res)
              this.statusBox = false
            })
            modifyAlbum(number,data).then((res)=>{
              console.log('res========:',res);
              let directUploadData = res.directUploadData
              console.log('directUploadData----:',directUploadData);
              for(var i=0;i<directUploadData.length;i++){
                let url = directUploadData[i].url;
                let headers = directUploadData[i].headers;
                console.log('url---:',url);
                console.log('headers----:',headers);
                const upload = new BlobUpload(files[i],directUploadData[i])
                this.notify(null, "directUploadWillStoreFileWithXHR", upload.xhr)
                upload.create(error => {
                  if (error) {
                    // upload.callback(error)
                  } else {
                    // upload.callback(null, blob.toJSON())

                    console.log('emit gotoMyAccountBox');
                    this.$emit('gotoMyAccountBox')
                  }
                })
              }
            })
          });
        }
    },
    showAlbum(){
      console.log('=============================showAlbum==================================');
          var $gallery_2 = $("#gallery_2"), $gallery_2Img = $("#gallery_2Img"),
          $modifyFiles = $("#modifyFiles");
          this.albumData = this.album;
          this.gamePlayerData = this.gamePlayer;


      $modifyFiles.on("click", "li", function(){
          $gallery_2Img.attr("style", this.getAttribute("style"));
          $gallery_2.fadeIn(100);
      });
      $gallery_2.on("click", function(){
          $gallery_2.fadeOut(100);
      });
    },
      showImg (e) {
        console.log('=============================showImg==================================');
            // var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',
                var $gallery_2 = $("#gallery_2"), $gallery_2Img = $("#gallery_2Img"),
                // $uploaderInput = $("#uploaderInput"),
                $modifyFiles = $("#modifyFiles");
                var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
                console.log('files----:',files);
                for (var i = 0, len = files.length; i < len; ++i) {
                    var file = files[i];
                    if (url) {
                        src = url.createObjectURL(file);
                    } else {
                        src = e.target.result;
                    }
                    let photo ={
                      originalUrl:src
                    }
                    file.src = src
                    this.filelist.push(file);
                    this.albumData.Photos.push(photo)
                }
            $modifyFiles.on("click", "li", function(){
                $gallery_2Img.attr("style", this.getAttribute("style"));
                $gallery_2.fadeIn(100);
            });
            $gallery_2.on("click", function(){
                $gallery_2.fadeOut(100);
            });
      },

       notify: function(object, methodName, ...messages) {
        if (object && typeof object[methodName] == "function") {
          return object[methodName](...messages)
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
        this.showAlbum();
      }else{
        console.log('hide');

        this.ui.statusBox = false
      }

    }
  }
}
</script>
