import Logger from './log'
import { decodeHtml } from './encode'
import { removeUrlArg } from './url'
const wxConfig = {};
const wxConfigArg = { }

function initWxConfig(arg){

  Logger.tlog("HdGame.initWxConfig");
  wx.config({
    debug: false,
    appId: arg.jsSdkAppid,
    timestamp: arg.timestamp,
    nonceStr: arg.nonce_str,
    signature: arg.signature,
    jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "startRecord", "stopRecord", "onRecordEnd", "playVoice", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "translateVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"]
  });

}


function setWxShare(desc, url, callBack) {
  //  g_config.$$sensitWordAndAdvance.forEach(function(item) {
  //    desc = desc.replace(new RegExp(item.sensword, "g"), item.adVance)
  //  })
  desc = decodeHtml(desc);
  url = removeUrlArg(url, "code", "state");


  var pyqUrl = url;

  wx.ready(function() {
    var wxConfigShareImg = arg.shareImg;
    if (!/^http:/.test(wxConfigShareImg) && /^\/\//.test(wxConfigShareImg)) {
      wxConfigShareImg = "http:" + wxConfigShareImg
    }
    try {
      wx.onMenuShareAppMessage({
        title: HdGame.decodeHtml(arg.activeName),
        desc: desc,
        link: url,
        imgUrl: wxConfigShareImg,
        type: "link",
        success: function() {

        },
        cancel: function() {},
        fail: function(res) {
          alert("分享失败请退出微信重新登录！");
          HdGame.logStd("wxShareFailErr", JSON.stringify(res), 2)
        }
      });
      wx.onMenuShareTimeline({
        title: desc,
        link: pyqUrl,
        imgUrl: wxConfigShareImg,
        success: function(res) {
          var setShareNum = function() {
            $.ajax({
              type: "post",
              url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=setShareNum&aid=" + g_config.aid + "&gameId=" + g_config.gameId + "&openId=" + g_config.openId + "&type=pyq&shareDeep=" + g_config.shareDeep,
              error: function(data) {
                if (m_debug) {
                  alert("服务繁忙，请稍候重试")
                }
              },
              success: function(data) {

              }
            })
          };
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
      HdGame.tlog("当前分享朋友链接：", url);
      HdGame.tlog("当前分享朋友圈链接：", pyqUrl)
    } catch(e) {
      alert(e.message)
    }
  });
  HdGame.wxConfigArg.desc = desc;
  HdGame.wxConfigArg.url = url;
  HdGame.wxConfigArg.callBack = callBack;
  HdGame.wxConfigArg.pyqUrl = pyqUrl;
  //g_config._minapp_findAct && (wx.miniProgram.postMessage({
  //  data: HdGame.getminData()
  //}))
}
