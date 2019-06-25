import wx from 'weixin-js-sdk'
import Logger from './log'
import { decodeHtml } from './encode'
// import { removeUrlArg } from './url'
const m_debug = false
const wxConfigArg = { }


//appId: wxConfig.appId, // 必填，公众号的唯一标识
//timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
//nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
//signature: wxConfig.signature,// 必填，签名

export function initWxConfig(wxConfig){

console.log('wxConfig--------:',wxConfig);
  wx.config({
    debug: false,
    appId: wxConfig.appId,
    timestamp: wxConfig.timestamp,
    nonceStr: wxConfig.nonceStr,
    signature: wxConfig.signature,
    jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "startRecord", "stopRecord", "onRecordEnd", "playVoice", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "translateVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"]
  });
  wx.error(function(res){
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
  });
}


export function setWxShare(wxShareArg, desc, url, callBack) {
  //  g_config.$$sensitWordAndAdvance.forEach(function(item) {
  //    desc = desc.replace(new RegExp(item.sensword, "g"), item.adVance)
  //  })
  desc = decodeHtml(desc);
  // url = removeUrlArg(url, "code", "state");
  url = wxShareArg.link
  console.log('wxShareArg =====================',wxShareArg);
  var pyqUrl = url;

  var wxConfigShareImg = wxShareArg.imgUrl;
  if (!/^http:/.test(wxConfigShareImg) && /^\/\//.test(wxConfigShareImg)) {
    wxConfigShareImg = "http:" + wxConfigShareImg
  }
  console.log('wxConfigShareImg------:',wxConfigShareImg);
  console.log('wxShareArg url=====================',url);

  wx.ready(function() {


    try {
      wx.onMenuShareAppMessage({
        title: decodeHtml(wxShareArg.title),
        desc: decodeHtml(wxShareArg.desc),
        link: url,
        imgUrl: wxConfigShareImg,
        success: function() {

        },
        cancel: function() {},
        fail: function(res) {
          alert("分享失败请退出微信重新登录！");
          Logger.logStd("wxShareFailErr", JSON.stringify(res), 2)
        }
      });
      wx.onMenuShareTimeline({
        title: decodeHtml(wxShareArg.desc),
        link: pyqUrl,
        imgUrl: wxConfigShareImg,
        success: function(res) {
          // var setShareNum = function() {
          //   $.ajax({
          //     type: "post",
          //     url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=setShareNum&aid=" + g_config.aid + "&gameId=" + g_config.gameId + "&openId=" + g_config.openId + "&type=pyq&shareDeep=" + g_config.shareDeep,
          //     error: function(data) {
          //       if (m_debug) {
          //         alert("服务繁忙，请稍候重试")
          //       }
          //     },
          //     success: function(data) {
          //
          //     }
          //   })
          // };
          //if (HdGame.isIPhone()) {
          //  setTimeout(setShareNum, 100)
          //} else {
          //  setShareNum()
          //}
        },
        cancel: function(res) {},
        fail: function(res) {
          if (m_debug) {
            alert(JSON.stringify(res))
          }
        }
      });
      Logger.tlog("当前分享朋友链接：", url);
      Logger.tlog("当前分享朋友圈链接：", pyqUrl)
    } catch(e) {
      alert(e.message)
    }
  });
  //wxConfigArg.desc = desc;
  wxConfigArg.url = url;
  wxConfigArg.callBack = callBack;
  wxConfigArg.pyqUrl = pyqUrl;
  //g_config._minapp_findAct && (wx.miniProgram.postMessage({
  //  data: HdGame.getminData()
  //}))

  return  wxConfigArg
}
